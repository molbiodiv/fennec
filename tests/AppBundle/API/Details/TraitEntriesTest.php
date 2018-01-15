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
                'fennec_id' => 97935,
                'type' => 'Plant Habit',
                'type_definition' => 'http://eol.org/schema/terms/PlantHabit',
                'value' => 'vine',
                'value_definition' => 'http://eol.org/schema/terms/vine',
                'citation' => 'Smithsonian Institution, National Museum of Narutal History, Department of Botany. http://collections.mnh.si.edu/search/botany/',
                'unit' => null,
                'origin_url' => 'http://eol.org/pages/5626774/data#data_point_15414795'
            ]
        ];
        $this->assertEquals($expected1, $results);

        //Test if the details for another trait entry with categorical value is returned correctly
        $parameterBag = new ParameterBag(array('dbversion' => $default_db, 'trait_entry_ids' => ['35123'], 'trait_format' => 'categorical_free'));
        $results = $service->execute($parameterBag, $user);
        $expected2 = [
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
        $this->assertEquals($expected2, $results);

        //Test if the details for two trait entries are returned correctly
        $parameterBag = new ParameterBag(array('dbversion' => $default_db, 'trait_entry_ids' => ['47484', '35123'], 'trait_format' => 'categorical_free'));
        $results = $service->execute($parameterBag, $user);
        $expected = array('47484' => $expected1['47484'], '35123' => $expected2['35123']);
        $this->assertEquals($expected, $results);

        //Test if the details for two trait entries with numerical value are returned correctly
        $parameterBag = new ParameterBag(array('dbversion' => $default_db, 'trait_entry_ids' => ['7100', '14136'], 'trait_format' => 'numerical'));
        $results = $service->execute($parameterBag, $user);
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
