<?php

namespace fennecweb\ajax\details;

use \fennecweb\WebService as WebService;

class OrganismsWithTraitTest extends \PHPUnit_Framework_TestCase
{
    public function testExecute()
    {
        //Test for the correct number of elements in the returned array
        list($service) = WebService::factory('details/OrganismsWithTrait');
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION, 'trait_type_id' => 1)));
        $this->assertEquals(5, count($results));
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION, 'trait_type_id' => 1, 'limit' => 10)));
        $this->assertEquals(10, count($results));
    }
}