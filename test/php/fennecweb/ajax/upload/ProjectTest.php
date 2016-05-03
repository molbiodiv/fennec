<?php

namespace fennecweb;

class ProjectTest extends \PHPUnit_Framework_TestCase
{
    public function testExecute()
    {
        // Test for error returned by empty file
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
        
        // Test for error returned by non json file
        $_FILES = array(
            'files' => array(
                'names' => array('noJson'),
                'types' => array('text/plain'),
                'sizes' => array(71),
                'tmp_names' => array(__DIR__ . '/testFiles/noJson'),
                'errors' => 0
            )
        );
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION)));
        $expected = array("files"=>array(array("name" => "noJson", "size" => 71, "error" => null)));
        $this->assertEquals($expected, $results);
    }
}
