<?php

namespace Test\AppBundle\API\Details;

use Symfony\Component\HttpFoundation\ParameterBag;
use Tests\AppBundle\API\WebserviceTestCase;
use AppBundle\API\Details;

class TraitsOfOrganismsTest extends WebserviceTestCase
{
    private $em;
    private $traitsOfOrganisms;

    public function setUp()
    {
        $kernel = self::bootKernel();

        $this->em = $kernel->getContainer()
            ->get('doctrine')
            ->getManager('test');
        $this->traitsOfOrganisms = $kernel->getContainer()->get(Details\TraitsOfOrganisms::class);

    }

    public function tearDown()
    {
        parent::tearDown();

        $this->em->close();
        $this->em = null; // avoid memory leaks
    }

    public function testWithEmptyFennecIds()
    {
        $fennecIds = array();
        $results = $this->traitsOfOrganisms->execute($fennecIds);
        $expected = [];
        $this->assertEquals($expected, $results);
    }

    public function testWithOneFennecId()
    {
        $fennecIds = array('615');
        $results = $this->traitsOfOrganisms->execute($fennecIds);
        $expected = [
            '1' => [
                'trait_type' => 'Plant Habit',
                'trait_format' => 'categorical_free',
                'trait_entry_ids' => [54133, 54134],
                'fennec_ids' => [615],
                'unit' => null
            ],
            '2' => [
                'trait_type' => 'Plant Life Cycle Habit',
                'trait_format' => 'categorical_free',
                'trait_entry_ids' => [83437, 83436, 83435],
                'fennec_ids' => [615],
                'unit' => null
            ]
        ];
        $this->assertEquals($expected, $results);
    }

    public function testWithMoreFennecIds()
    {
        $fennecIds = array('4207', '5637', '23547', '181840');
        $results = $this->traitsOfOrganisms->execute($fennecIds);
        $expected = [
            '1' => [
                'trait_type' => 'Plant Habit',
                'trait_format' => 'categorical_free',
                'trait_entry_ids' => [50128, 50129, 50130, 61731, 61729, 61728, 61609, 61730],
                'fennec_ids' => [4207, 23547, 5637],
                'unit' => null
            ],
            '2' => [
                'trait_type' => 'Plant Life Cycle Habit',
                'trait_format' => 'categorical_free',
                'trait_entry_ids' => [85589, 85541, 82072],
                'fennec_ids' => [23547, 5637, 4207],
                'unit' => null
            ],
            '3' => [
                'trait_type' => 'IUCN Threat Status',
                'trait_format' => 'categorical_free',
                'trait_entry_ids' => [88860],
                'fennec_ids' => [181840],
                'unit' => null
            ],
            '4' => [
                'trait_type' => 'Flower Color',
                'trait_format' => 'categorical_free',
                'trait_entry_ids' => [113422],
                'fennec_ids' => [4207],
                'unit' => null
            ]
        ];
        $this->assertEquals($expected, $results);
    }

    public function testWithDifferentFormats(){
        $fennecIds = array('1262', '5514', '25219');
        $results = $this->traitsOfOrganisms->execute($fennecIds);
        $expected = [
            '1' => [
                'trait_type' => 'Plant Habit',
                'trait_format' => 'categorical_free',
                'trait_entry_ids' => [28955, 28954, 23398, 28956, 28957],
                'fennec_ids' => [1262, 5514],
                'unit' => null
            ],
            '2' => [
                'trait_type' => 'Plant Life Cycle Habit',
                'trait_format' => 'categorical_free',
                'trait_entry_ids' => [72164, 74215],
                'fennec_ids' => [5514, 1262],
                'unit' => null
            ],
            '3' => [
                'trait_type' => 'IUCN Threat Status',
                'trait_format' => 'categorical_free',
                'trait_entry_ids' => [91532, 95880, 104870],
                'fennec_ids' => [1262, 25219, 5514],
                'unit' => null
            ],
            '4' => [
                'trait_type' => 'Flower Color',
                'trait_format' => 'categorical_free',
                'trait_entry_ids' => [112441],
                'fennec_ids' => [1262],
                'unit' => null
            ],
            '7' => [
                'trait_type' => 'Leaf size',
                'trait_format' => 'numerical',
                'trait_entry_ids' => [7094, 7093, 7075, 7090],
                'fennec_ids' => [1262, 5514, 25219],
                'unit' => 'mm^2'
            ],
            '8' => [
                'trait_type' => 'Leaf mass',
                'trait_format' => 'numerical',
                'trait_entry_ids' => [10482, 10500, 10495, 10501, 10483],
                'fennec_ids' => [5514, 1262, 25219],
                'unit' => 'mg'
            ]
        ];
        $this->assertEquals($expected, $results);
    }
}
