<?php
require_once __DIR__ . DIRECTORY_SEPARATOR . 'config.php';

class OrganismsDetailsTest extends PHPUnit_Framework_TestCase
{
    public function testExecute()
    {
        list($service) = \WebService::factory('listing/Details');
        
        $results = ($service->execute(array('id' => 20)));
        $this->assertEquals(2, $results['organism_id']);
    }
}
?>