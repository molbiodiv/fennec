<?php

namespace fennecweb\ajax\details;

use \fennecweb\WebService as WebService;

class TraitsOfOrganismsTest extends \PHPUnit_Framework_TestCase
{

    public function testExecute()
    {
        //Test if the traits to a selection of organisms is returned correctly
        list($service) = WebService::factory('details/TraitsOfOrganisms');
        $organism_ids = ['13','21','17'];
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION, 'organism_ids' => $organism_ids)));
        $expected = [1 => 'habitat', 5 => 'elevation', 7 => 'plant growth habitat'];
        $this->assertEquals($expected, $results);
    }
}
