<?php
require_once __DIR__ . DIRECTORY_SEPARATOR . 'config.php';

class OrganismsTest extends PHPUnit_Framework_TestCase
{
    public function testExecute()
    {
        list($service) = \WebService::factory('listing/Organisms');
        $results = ($service->execute(array('ids' => array(1))));
        $this->assertEquals(1, $results[0]["organism_id"]);

    }
    
    public function testGetOrganismAbbr()
    {
        list($service) = \WebService::factory('listing/Organisms');
        $results = ($service->getOrganismAbbr(array('ids' => array(1))));
        var_dump($results);
        
        $this->assertEquals("H.sapiens", $results[0]["abbreviation"]);

    }
}
?>