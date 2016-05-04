<?php

namespace fennecweb;

class ProjectTest extends \PHPUnit_Framework_TestCase
{
    public function setUp()
    {
        $_SESSION['user'] = array(
            'nickname' => $user->getNickName(),
            'id' => $user->getId(),
            'provider' => 'github',
            'token' => $token->getToken()
        );
    }

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
        $expected = array("files"=>array(array("name" => "empty", "size" => 0, "error" => \fennecweb\ajax\upload\Project::ERROR_NOT_BIOM)));
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
        $expected = array("files"=>array(array("name" => "noJson", "size" => 71, "error" => \fennecweb\ajax\upload\Project::ERROR_NOT_JSON)));
        $this->assertEquals($expected, $results);

        // Test for error returned by non biom json file
        $_FILES = array(
            'files' => array(
                'names' => array('noBiom.json'),
                'types' => array('text/plain'),
                'sizes' => array(71),
                'tmp_names' => array(__DIR__ . '/testFiles/noBiom.json'),
                'errors' => 0
            )
        );
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION)));
        $expected = array(
            "files"=>array(array("name" => "noBiom.json", "size" => 71, "error" => \fennecweb\ajax\upload\Project::ERROR_NOT_BIOM))
        );
        $this->assertEquals($expected, $results);

        // Test for success returned by simple biom file
        $_FILES = array(
            'files' => array(
                'names' => array('simpleBiom.json'),
                'types' => array('text/plain'),
                'sizes' => array(1067),
                'tmp_names' => array(__DIR__ . '/testFiles/simpleBiom.json'),
                'errors' => 0
            )
        );
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION)));
        $expected = array("files"=>array(array("name" => "simpleBiom.json", "size" => 1067, "error" => null)));
        $this->assertEquals($expected, $results);
    }
}
