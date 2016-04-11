<?php

namespace fennecweb;

class DetailsTest extends \PHPUnit_Framework_TestCase
{
    public function testExecute()
    {
        list($service) = WebService::factory('details/Organisms');
        $results = ($service->execute(array('id' => 13, 'dbversion' => DEFAULT_DBVERSION)));
        $this->assertEquals(13, $results['organism_id']);
    }
}
