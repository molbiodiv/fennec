<?php
require_once __DIR__ . DIRECTORY_SEPARATOR . 'config.php';

class DetailsTest extends PHPUnit_Framework_TestCase
{
    public function testExecute()
    {
        list($service) = \WebService::factory('listing/Details');
        $results = ($service->execute(array('id' => 12)));
        $this->assertEquals(2, $results['organism_id']);
    }
}
?>