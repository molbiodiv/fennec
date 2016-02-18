<?php
require_once __DIR__ . DIRECTORY_SEPARATOR . 'config.php';

class OrganismsTest extends PHPUnit_Framework_TestCase
{
    public function testPushAndPop()
    {
        list($service) = \WebService::factory('listing/Organisms');
        $results = ($service->execute(array('ids' => array(1))));
        //var_dump($results);
        
        $this->assertEquals(1, $results[0]["organism_id"]);

    }
}
?>