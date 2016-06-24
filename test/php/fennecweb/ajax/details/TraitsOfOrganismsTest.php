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
            ['trait_entry_id' => 199, 'cvterm' => 'habitat'],
            ['trait_entry_id' => 200, 'cvterm' => 'habitat'],
            ['trait_entry_id' => 201, 'cvterm' => 'habitat'],
            ['trait_entry_id' => 202, 'cvterm' => 'habitat'],
            ['trait_entry_id' => 203, 'cvterm' => 'habitat'],
            ['trait_entry_id' => 387869, 'cvterm' => 'extinction status'],
            ['trait_entry_id' => 387870, 'cvterm' => 'type specimen repository'],
            ['trait_entry_id' => 387871, 'cvterm' => 'habitat'],
            ['trait_entry_id' => 753126, 'cvterm' => 'extinction status'],
            ['trait_entry_id' => 753127, 'cvterm' => 'geographic distribution'],
            ['trait_entry_id' => 753128, 'cvterm' => 'geographic distribution'],
            ['trait_entry_id' => 753129, 'cvterm' => 'type specimen repository'],
            ['trait_entry_id' => 753130, 'cvterm' => 'habitat'],
            ['trait_entry_id' => 753131, 'cvterm' => 'geographic distribution']
        ];
        $this->assertEquals($expected, $results);
    }
}
