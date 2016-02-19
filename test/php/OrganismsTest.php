<?php
require_once __DIR__ . DIRECTORY_SEPARATOR . 'config.php';

class OrganismsTest extends PHPUnit_Framework_TestCase
{
    public function testExecute()
    {
        list($service) = \WebService::factory('listing/Organisms');
        
        $results = ($service->execute(array('limit' => 2)));
        $this->assertEquals(1, count($results));
        
        $results = ($service->execute(array()));
        $this->assertEquals(1, count($results));
        
        $results = ($service->execute(array('limit' => 10000000)));
        $this->assertEquals(1, count($results));

    }
}
?>