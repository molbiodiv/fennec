<?php

namespace Tests\AppBundle\API\Listing;

use Symfony\Component\HttpFoundation\ParameterBag;
use Tests\AppBundle\API\WebserviceTestCase;

class TraitsTest extends WebserviceTestCase
{

    public function testExecute()
    {
        $default_db = $this->default_db;
        $service = $this->webservice->factory('listing', 'traits');
        $results = $service->execute(
            new ParameterBag(array('dbversion' => $default_db, 'search' => '')),
            null
        );
        $expected = array(
            array(
                "name" => "Plant Habit",
                "trait_type_id" => 1,
                "frequency" => 48842
            ),
            array(
                "name" => "IUCN Threat Status",
                "trait_type_id" => 3,
                "frequency" => 23185
            ),
            array(
                "name" => "Plant Life Cycle Habit",
                "trait_type_id" => 2,
                "frequency" => 16819
            ),
            array(
                "name" => "Leaf mass",
                "trait_type_id" => 8,
                "frequency" => 3667
            ),
            array(
                "name" => "Leaf size",
                "trait_type_id" => 7,
                "frequency" => 3407
            ),
            array(
                "name" => "Flower Color",
                "trait_type_id" => 4,
                "frequency" => 2556
            ),
            array(
                "name" => "EPPO Lists",
                "trait_type_id" => 6,
                "frequency" => 92
            )
        );
        $this->assertEquals($expected, $results, 'Search without term and limit, result should be a list of all traits');

        $results = $service->execute(
            new ParameterBag(array('dbversion' => $default_db, 'search' => 'SomethingThatWillNeverBeATraitType')),
            null
        );
        $expected = array();
        $this->assertEquals($expected, $results, 'Search term does not hit, result should be an empty array');
    }
}
