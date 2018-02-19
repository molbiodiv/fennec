<?php

namespace Test\AppBundle\API\Details;

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
            ->getManager('test_data');
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
                'traitType' => 'Plant Habit',
                'traitFormat' => 'categorical_free',
                'traitEntryIds' => [54133, 54134],
                'fennec' => [615],
                'unit' => null
            ],
            '2' => [
                'traitType' => 'Plant Life Cycle Habit',
                'traitFormat' => 'categorical_free',
                'traitEntryIds' => [83435, 83436, 83437],
                'fennec' => [615],
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
                'traitType' => 'Plant Habit',
                'traitFormat' => 'categorical_free',
                'traitEntryIds' => [50128, 50129, 50130, 61609, 61728, 61729, 61730, 61731],
                'fennec' => [4207, 5637, 23547],
                'unit' => null
            ],
            '2' => [
                'traitType' => 'Plant Life Cycle Habit',
                'traitFormat' => 'categorical_free',
                'traitEntryIds' => [82072, 85541, 85589],
                'fennec' => [4207, 5637, 23547],
                'unit' => null
            ],
            '3' => [
                'traitType' => 'IUCN Threat Status',
                'traitFormat' => 'categorical_free',
                'traitEntryIds' => [88860],
                'fennec' => [181840],
                'unit' => null
            ],
            '4' => [
                'traitType' => 'Flower Color',
                'traitFormat' => 'categorical_free',
                'traitEntryIds' => [113422],
                'fennec' => [4207],
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
                'traitType' => 'Plant Habit',
                'traitFormat' => 'categorical_free',
                'traitEntryIds' => [23398, 28954, 28955, 28956, 28957],
                'fennec' => [5514, 1262],
                'unit' => null
            ],
            '2' => [
                'traitType' => 'Plant Life Cycle Habit',
                'traitFormat' => 'categorical_free',
                'traitEntryIds' => [72164, 74215],
                'fennec' => [5514, 1262],
                'unit' => null
            ],
            '3' => [
                'traitType' => 'IUCN Threat Status',
                'traitFormat' => 'categorical_free',
                'traitEntryIds' => [91532, 95880, 104870],
                'fennec' => [1262, 25219, 5514],
                'unit' => null
            ],
            '4' => [
                'traitType' => 'Flower Color',
                'traitFormat' => 'categorical_free',
                'traitEntryIds' => [112441],
                'fennec' => [1262],
                'unit' => null
            ],
            '7' => [
                'traitType' => 'Leaf size',
                'traitFormat' => 'numerical',
                'traitEntryIds' => [7075, 7090, 7093, 7094],
                'fennec' => [5514, 25219, 1262],
                'unit' => 'mm^2'
            ],
            '8' => [
                'traitType' => 'Leaf mass',
                'traitFormat' => 'numerical',
                'traitEntryIds' => [10482, 10483, 10495, 10500, 10501],
                'fennec' => [5514, 25219, 1262],
                'unit' => 'mg'
            ]
        ];
        $this->assertEquals($expected, $results);
    }
}
