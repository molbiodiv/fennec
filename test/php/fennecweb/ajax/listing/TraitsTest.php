<?php

namespace fennecweb\ajax\listing;

use \fennecweb\WebService as WebService;

class TraitsTest extends \PHPUnit_Framework_TestCase
{

    public function testExecute()
    {
        //Test for traits without search term or limit
        list($service) = WebService::factory('listing/Traits');
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION, 'search' => '')));
        $expected = array(
            array(
                "name" => "PlantHabit",
                "trait_type_id" => 1,
                "frequency" => 48916
            )
        );
        $this->assertEquals($expected, $results);
    }
}
