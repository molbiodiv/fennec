<?php
require_once __DIR__ . DIRECTORY_SEPARATOR . 'config.php';

/**
 * @backupGlobals disabled
 */
class DetailsTest extends PHPUnit_Framework_TestCase
{
    public function testExecute()
    {
        list($service) = \WebService::factory('listing/Details');
        $results = ($service->execute(array('id' => 13)));
        $this->assertEquals(13, $results['organism_id']);
    }
}
?>