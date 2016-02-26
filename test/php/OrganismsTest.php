<?php
require_once __DIR__ . DIRECTORY_SEPARATOR . 'config.php';

class OrganismsTest extends PHPUnit_Framework_TestCase
{
    public function testExecute()
    {
        list($service) = \WebService::factory('listing/Organisms');
        
        $results = ($service->execute(array('limit' => 2)));
        $this->assertEquals(2, count($results));
        
        $results = ($service->execute(array()));
        $this->assertEquals(5, count($results));
        
        $organism = 'Thermopsis';
        $results = ($service->execute(array('limit' => 1, 'search' => $organism)));
        $this->assertEquals(1, count($results));
        $pos = strpos($results['scientific_name'], $organism);
        $this->assertEquals(0, $pos);

    }
}
?>