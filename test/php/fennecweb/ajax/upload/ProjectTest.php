<?php

namespace fennecweb;

class ProjectTest extends \PHPUnit_Framework_TestCase
{
    public function testExecute()
    {
        $_FILES = array(
            'files' => array(
                'names' => array('empty'),
                'types' => array('text/plain'),
                'sizes' => array(0),
                'tmp_names' => array(__DIR__ . '/testFiles/empty'),
                'errors' => 0
            )
        );
        list($service) = WebService::factory('upload/Project');
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION)));
        $expected = array("files"=>array(array("name" => "empty", "size" => 0, "error" => null)));
        $this->assertEquals($expected, $results);
    }
}
