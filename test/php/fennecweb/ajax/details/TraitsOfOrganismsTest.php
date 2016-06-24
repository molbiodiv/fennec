<?php

namespace fennecweb\ajax\details;

use \fennecweb\WebService as WebService;

class TraitsOfOrganismsTest extends \PHPUnit_Framework_TestCase
{

    public function testExecute()
    {
        //Test if the traits to one organism is returned correctly
        list($service) = WebService::factory('details/TraitsOfOrganisms');
        $organism_ids = ['12049'];
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION, 'organism_ids' => $organism_ids)));
        $expected = [
            '20' => [
                'cvterm' => 'extinction status', 
                'trait_entry_ids' => [753126],
                'organism_ids' => [12049]
            ],
            '10' => [
                'cvterm' => 'geographic distribution', 
                'trait_entry_ids' => [753127, 753128, 753131],
                'organism_ids' => [12049]
            ],
            '188' => [
                'cvterm' => 'type specimen repository', 
                'trait_entry_ids' => [753129],
                'organism_ids' => [12049]
            ],
            '27' => [
                'cvterm' => 'habitat', 
                'trait_entry_ids' => [753130],
                'organism_ids' => [12049]
            ]
        ];
        $this->assertEquals($expected, $results);
        
        //Test if the traits to a collection of organisms is returned correctly
        list($service) = WebService::factory('details/TraitsOfOrganisms');
        $organism_ids = ['47757','200', '12049'];
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION, 'organism_ids' => $organism_ids)));
        $expected = [
            '29' => [
                'cvterm' => 'habitat', 
                'trait_entry_ids' => [199,200,201,202,203],
                'organism_ids' => [47757]
            ],
            '20' => [
                'cvterm' => 'extinction status', 
                'trait_entry_ids' => [387869,753126],
                'organism_ids' => [200,12049]
            ],
            '188' => [
                'cvterm' => 'type specimen repository', 
                'trait_entry_ids' => [387870,753129],
                'organism_ids' => [200,12049]
            ],
            '27' => [
                'cvterm' => 'habitat', 
                'trait_entry_ids' => [387871,753130],
                'organism_ids' => [200,12049]
            ],
            '10' => [
                'cvterm' => 'geographic distribution', 
                'trait_entry_ids' => [753127,753128,753131],
                'organism_ids' => [12049]
            ]
        ];
        $this->assertEquals($expected, $results);
    }
}
