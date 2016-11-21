<?php

namespace Test\AppBundle\API\Details;

use Symfony\Component\HttpFoundation\ParameterBag;
use Tests\AppBundle\API\WebserviceTestCase;

class TraitsOfOrganismsTest extends WebserviceTestCase
{

    public function testExecute()
    {
        $default_db = $this->default_db;
        $session = null;
        $traitsOfOrganisms = $this->webservice->factory('details', 'traitsOfOrganisms');

        //Test if an empty array is returned if fennec_ids is empty
        $parameterBag = new ParameterBag(array('dbversion' => $default_db, 'fennec_ids' => array()));
        $results = $traitsOfOrganisms->execute($parameterBag, $session);
        $expected = [];
        $this->assertEquals($expected, $results);

        //Test if the traits to one organism is returned correctly
        $parameterBag = new ParameterBag(array('dbversion' => $default_db, 'fennec_ids' => array('615')));
        $results = $traitsOfOrganisms->execute($parameterBag, $session);
        $expected = [
            '1' => [
                'trait_type' => 'Plant Habit',
                'trait_format' => 'categorical_free',
                'trait_entry_ids' => [54133, 54134],
                'fennec_ids' => [615]
            ],
            '2' => [
                'trait_type' => 'Plant Life Cycle Habit',
                'trait_format' => 'categorical_free',
                'trait_entry_ids' => [83435, 83436, 83437],
                'fennec_ids' => [615]
            ]
        ];
        $this->assertEquals($expected, $results);
        
        //Test if the traits to a collection of organisms is returned correctly
        $parameterBag = new ParameterBag(array('dbversion' => $default_db, 'fennec_ids' => array('42077','159679', '25545')));
        $results = $traitsOfOrganisms->execute($parameterBag, $session);
        $expected = [
            '1' => [
                'trait_type' => 'Plant Habit',
                'trait_format' => 'categorical_free',
                'trait_entry_ids' => [50128, 50129, 50130, 61609, 61728, 61729, 61730, 61731],
                'fennec_ids' => [4207, 5637, 23547]
            ],
            '2' => [
                'trait_type' => 'Plant Life Cycle Habit',
                'trait_format' => 'categorical_free',
                'trait_entry_ids' => [82072, 85541, 85589],
                'fennec_ids' => [4207, 5637, 23547]
            ],
            '3' => [
                'trait_type' => 'IUCN Threat Status',
                'trait_format' => 'categorical_free',
                'trait_entry_ids' => [5],
                'fennec_ids' => [181840]
            ]
        ];
        $this->assertEquals($expected, $results);
    }
}
