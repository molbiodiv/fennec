<?php

namespace fennecweb\ajax\details;

use \fennecweb\WebService as WebService;

class TraitsOfOrganismsTest extends \PHPUnit_Framework_TestCase
{

    public function testExecute()
    {
        //Test if the traits to one organism is returned correctly
        list($service) = WebService::factory('details/TraitsOfOrganisms');
        $organism_ids = ['61579'];
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION, 'organism_ids' => $organism_ids)));
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
        list($service) = WebService::factory('details/TraitsOfOrganisms');
        $organism_ids = ['42077','159679', '25545'];
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION, 'organism_ids' => $organism_ids)));
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
