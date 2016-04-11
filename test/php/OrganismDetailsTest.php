<?php

require_once __DIR__ . DIRECTORY_SEPARATOR . 'config.php';

class DetailsTest extends PHPUnit_Framework_TestCase
{
    public function testExecute()
    {
        list($service) = \fennecweb\WebService::factory('details/Organisms');
        $results = ($service->execute(array('id' => 13, 'dbversion' => DEFAULT_DBVERSION)));
        $this->assertEquals(13, $results['organism_id']);
    }
}
