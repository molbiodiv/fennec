<?php

namespace fennecweb\ajax\listing;

use \fennecweb\WebService as WebService;

class TraitsTest extends \PHPUnit_Framework_TestCase
{

    public function testExecute()
    {
        list($service) = WebService::factory('listing/Traits');
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION, 'search' => '')));
        $expected = array(
            array(
                "name" => "PlantHabit",
                "trait_type_id" => 1,
                "frequency" => 48916
            )
        );
        $this->assertEquals($expected, $results, 'Search without term and limit, result should be a list of all traits');

        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION, 'search' => 'SomethingThatWillNeverBeATraitType')));
        $expected = array();
        $this->assertEquals($expected, $results, 'Search term does not hit, result should be an empty array');
    }
}
