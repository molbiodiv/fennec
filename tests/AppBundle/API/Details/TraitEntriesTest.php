<?php

namespace Test\AppBundle\API\Details;

use AppBundle\API\Details;
use Tests\AppBundle\API\WebserviceTestCase;

class TraitEntriesTest extends WebserviceTestCase
{
    private $em;
    private $traitEntries;
    private $resultForOneTraitEntry;
    private $resultForAnotherTraitEntry;


    public function setUp()
    {
        $kernel = self::bootKernel();

        $this->em = $kernel->getContainer()
            ->get('doctrine')
            ->getManager('test');
        $this->traitEntries = $kernel->getContainer()->get(Details\TraitEntries::class);
        $this->resultForOneTraitEntry = [
            '47484' => [
                'fennec' => 97935,
                'type' => 'Plant Habit',
                'typeDefinition' => 'http://eol.org/schema/terms/PlantHabit',
                'value' => 'vine',
                'valueDefinition' => 'http://eol.org/schema/terms/vine',
                'citation' => 'Smithsonian Institution, National Museum of Narutal History, Department of Botany. http://collections.mnh.si.edu/search/botany/',
                'unit' => null,
                'originUrl' => 'http://eol.org/pages/5626774/data#data_point_15414795'
            ]
        ];
        $this->resultForAnotherTraitEntry = [
            '35123' => [
                'fennec_id' => 55850,
                'type' => 'Plant Habit',
                'type_definition' => 'http://eol.org/schema/terms/PlantHabit',
                'value' => 'subshrub',
                'value_definition' => 'http://eol.org/schema/terms/subshrub',
                'citation' => 'The PLANTS Database, United States Department of Agriculture, National Resources Conservation Service. http://plants.usda.gov/',
                'unit' => null,
                'origin_url' => 'http://eol.org/pages/231283/data#data_point_5580717'
            ]
        ];

    }

    public function tearDown()
    {
        parent::tearDown();

        $this->em->close();
        $this->em = null; // avoid memory leaks
    }

    public function testUnknownTraitFormat()
    {
        $traitEntryIds = array('1');
        $traitFormat = 'non_existing_format';
        $results = $this->traitEntries->execute($traitEntryIds, $traitFormat);
        $expected = [
            'error' => TraitEntries::ERROR_UNKNOWN_TRAIT_FORMAT
        ];
        $this->assertEquals($expected, $results);
    }

    public function testOneTraitWithCategoricalValue()
    {
        $traitEntryIds = array('47484');
        $traitFormat = 'categorical_free';
        $results = $this->traitEntries->execute($traitEntryIds, $traitFormat);
        $expected = $this->resultForOneTraitEntry;
        $this->assertEquals($expected, $results);
    }

    public function testAnotherTraitWithCategoricalValue()
    {
        $traitEntryIds = array('35123');
        $traitFormat = 'categorical_free';
        $results = $this->traitEntries->execute($traitEntryIds, $traitFormat);
        $expected = $this->resultForAnotherTraitEntry;
        $this->assertEquals($expected, $results);
    }

    public function testTwoTraitsWithCategoricalValue()
    {
        $traitEntryIds = array('47484', '35123');
        $traitFormat = 'categorical_free';
        $results = $this->traitEntries->execute($traitEntryIds, $traitFormat);
        $expected = array('47484' => $this->resultForOneTraitEntry['47484'], '35123' => $this->resultForAnotherTraitEntry['35123']);
        $this->assertEquals($expected, $results);
    }

    public function testDetailsForNumericalTraits(){
        $traitEntryIds = array('7100', '14136');
        $traitFormat = 'numerical';
        $results = $this->traitEntries->execute($traitEntryIds, $traitFormat);
        $expected = [
            '7100' => [
                'fennec_id' => 5818,
                'type' => 'Leaf size',
                'type_definition' => '',
                'value' => 279.0000000000,
                'value_definition' => null,
                'citation' => 'Source data from University of Groningen, Community and Conservation Ecology Group, NL (Steendam), Corresponding address: R.m.bekker@rug.nl',
                'unit' => 'mm^2',
                'origin_url' => ''
            ],
            '14136' => [
                'fennec_id' => 2866,
                'type' => 'Leaf mass',
                'type_definition' => '',
                'value' => 376.7100000000,
                'value_definition' => null,
                'citation' => 'Source data from Carl von Ossietzky university of Oldenburg, Landscape Ecology Group, DE (Kunzmann), E-Mail: dkunzmann@gmx.de',
                'unit' => 'mg',
                'origin_url' => ''
            ]
        ];
        $this->assertEquals($expected, $results);
    }
}
