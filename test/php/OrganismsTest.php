<?php
require_once __DIR__ . DIRECTORY_SEPARATOR . 'config.php';

/**
 * @backupGlobals disabled
 */
class OrganismsTest extends PHPUnit_Framework_TestCase
{
    public function testExecute()
    {
        list($service) = \WebService::factory('listing/Organisms');
        
        $results = ($service->execute(array('limit' => 2, 'dbversion' => DEFAULT_DBVERSION)));
        $this->assertEquals(2, count($results));
        
        $results = ($service->execute(array('limit' => 7, 'dbversion' => DEFAULT_DBVERSION)));
        $this->assertEquals(7, count($results));
        
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION)));
        $this->assertEquals(5, count($results));
        
        $organism = 'Thermopsis';
        $results = ($service->execute(array('limit' => 1, 'search' => $organism, 'dbversion' => DEFAULT_DBVERSION)));
        $this->assertEquals(1, count($results));
        $pos = strpos($results[0]['scientific_name'], $organism);
        $this->assertEquals(0, $pos);

    }
}
?>