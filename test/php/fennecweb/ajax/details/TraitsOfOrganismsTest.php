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
        $expected = [['trait_entry_id' => 753126, 'cvterm' => 'extinction status'], ['trait_entry_id' => 753127, 'cvterm' => 'geographic distribution'],
            ['trait_entry_id' => 753128, 'cvterm' => 'geographic distribution'],['trait_entry_id' => 753129, 'cvterm' => 'type specimen repository'],
            ['trait_entry_id' => 753130, 'cvterm' => 'habitat'],['trait_entry_id' => 753131, 'cvterm' => 'geographic distribution']];
        $this->assertEquals($expected, $results);
        
        //Test if the traits to a collection of organisms is returned correctly
        list($service) = WebService::factory('details/TraitsOfOrganisms');
        $organism_ids = ['47757','200', '12049'];
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION, 'organism_ids' => $organism_ids)));
        $expected = [1 => 'habitat', 5 => 'elevation', 7 => 'plant growth habitat'];
        $this->assertEquals($expected, $results);
    }
}
