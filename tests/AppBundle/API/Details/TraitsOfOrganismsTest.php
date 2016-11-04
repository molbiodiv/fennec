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

        //Test if an empty array is returned if organism_ids is empty
        $parameterBag = new ParameterBag(array('dbversion' => $default_db, 'organism_ids' => array()));
        $results = $traitsOfOrganisms->execute($parameterBag, $session);
        $expected = [];
        $this->assertEquals($expected, $results);

        //Test if the traits to one organism is returned correctly
        $parameterBag = new ParameterBag(array('dbversion' => $default_db, 'organism_ids' => array('61579')));
        $results = $traitsOfOrganisms->execute($parameterBag, $session);
        $expected = [
            '1' => [
                'trait_type' => 'PlantHabit',
                'trait_format' => 'categorical_free',
                'trait_entry_ids' => [49506],
                'organism_ids' => [61579]
            ]
        ];
        $this->assertEquals($expected, $results);
        
        //Test if the traits to a collection of organisms is returned correctly
        $parameterBag = new ParameterBag(array('dbversion' => $default_db, 'organism_ids' => array('42077','159679', '25545')));
        $results = $traitsOfOrganisms->execute($parameterBag, $session);
        $expected = [
            '1' => [
                'trait_type' => 'PlantHabit',
                'trait_format' => 'categorical_free',
                'trait_entry_ids' => [49507, 49508, 49509, 49510, 49511, 49512, 49513],
                'organism_ids' => [42077, 159679, 25545]
            ]
        ];
        $this->assertEquals($expected, $results);
    }
}
