<?php

namespace Test\AppBundle\API\Details;

use Symfony\Component\HttpFoundation\ParameterBag;
use Tests\AppBundle\API\WebserviceTestCase;

class TraitsOfOrganismsTest extends WebserviceTestCase
{

    public function testExecute()
    {
        $default_db = $this->default_db;
        $user = null;
        $traitsOfOrganisms = $this->webservice->factory('details', 'traitsOfOrganisms');

        //Test if an empty array is returned if fennec_ids is empty
        $parameterBag = new ParameterBag(array('dbversion' => $default_db, 'fennec_ids' => array()));
        $results = $traitsOfOrganisms->execute($parameterBag, $user);
        $expected = [];
        $this->assertEquals($expected, $results);

        //Test if the traits to one organism is returned correctly
        $parameterBag = new ParameterBag(array('dbversion' => $default_db, 'fennec_ids' => array('615')));
        $results = $traitsOfOrganisms->execute($parameterBag, $user);
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

        //Test if the traits to a collection of organisms is returned correctly
        $parameterBag = new ParameterBag(array('dbversion' => $default_db, 'fennec_ids' => array(4207, 5637, 23547, 181840)));
        $results = $traitsOfOrganisms->execute($parameterBag, $user);
        $expected = [
            '1' => [
                'trait_type' => 'Plant Habit',
                'trait_format' => 'categorical_free',
                'trait_entry_ids' => [50128, 50129, 61731, 61729, 50130, 61728, 61609, 61730],
                'fennec_ids' => [4207, 23547, 5637],
                'unit' => null
            ],
            '2' => [
                'trait_type' => 'Plant Life Cycle Habit',
                'trait_format' => 'categorical_free',
                'trait_entry_ids' => [82072, 85589, 85541],
                'fennec_ids' => [4207, 23547, 5637],
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

        //Test if both categorical and numerical traits are returned correctly
        $parameterBag = new ParameterBag(array('dbversion' => $default_db, 'fennec_ids' => array(1262, 5514, 25219)));
        $results = $traitsOfOrganisms->execute($parameterBag, $user);
        $expected = [
            '1' => [
                'trait_type' => 'Plant Habit',
                'trait_format' => 'categorical_free',
                'trait_entry_ids' => [28957, 28954, 23398, 28956, 28955],
                'fennec_ids' => [1262, 5514],
                'unit' => null
            ],
            '2' => [
                'trait_type' => 'Plant Life Cycle Habit',
                'trait_format' => 'categorical_free',
                'trait_entry_ids' => [74215, 72164],
                'fennec_ids' => [1262, 5514],
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
                'trait_entry_ids' => [7094, 7075, 7090, 7093],
                'fennec_ids' => [1262, 5514, 25219],
                'unit' => 'mm^2'
            ],
            '8' => [
                'trait_type' => 'Leaf mass',
                'trait_format' => 'numerical',
                'trait_entry_ids' => [10482, 10483, 10500, 10495, 10501],
                'fennec_ids' => [5514, 1262, 25219],
                'unit' => 'mg'
            ]
        ];
        $this->assertEquals($expected, $results);
    }
}
