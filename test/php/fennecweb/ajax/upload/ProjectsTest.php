<?php

namespace fennecweb\ajax\upload;

class ProjectsTest extends \PHPUnit_Framework_TestCase
{
    const NICKNAME = 'UploadProjectTestUser';
    const USERID = 'UploadProjectTestUser';
    const PROVIDER = 'UploadProjectTest';

    public function setUp()
    {
        $_SESSION['user'] = array(
            'nickname' => ProjectsTest::NICKNAME,
            'id' => ProjectsTest::USERID,
            'provider' => ProjectsTest::PROVIDER,
            'token' => 'UploadProjectTestUserToken'
        );
    }

    public function testExecute()
    {
        // Test for error returned by empty file
        $_FILES = array(
            array(
                'name' => 'empty',
                'type' => 'text/plain',
                'size' => 0,
                'tmp_name' => __DIR__ . '/testFiles/empty',
                'error' => 0
            )
        );
        list($service) = WebService::factory('upload/Projects');
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION)));
        $expected = array(
            "files"=>array(
                array(
                    "name" => "empty",
                    "size" => 0,
                    "error" => \fennecweb\ajax\upload\Project::ERROR_NOT_JSON
                )
            )
        );
        $this->assertEquals($expected, $results);

        // Test for error returned by non json file
        $_FILES = array(
            array(
                'name' => 'noJson',
                'type' => 'text/plain',
                'size' => 71,
                'tmp_name' => __DIR__ . '/testFiles/noJson',
                'error' => 0
            )
        );
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION)));
        $expected = array(
            "files"=>array(
                array(
                    "name" => "noJson",
                    "size" => 71,
                    "error" => \fennecweb\ajax\upload\Project::ERROR_NOT_JSON
                )
            )
        );
        $this->assertEquals($expected, $results);

        // Test for error returned by non biom json file
        $_FILES = array(
            array(
                'name' => 'noBiom.json',
                'type' => 'text/plain',
                'size' => 71,
                'tmp_name' => __DIR__ . '/testFiles/noBiom.json',
                'error' => 0
            )
        );
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION)));
        $expected = array(
            "files"=>array(
                array(
                    "name" => "noBiom.json",
                    "size" => 71,
                    "error" => \fennecweb\ajax\upload\Project::ERROR_NOT_BIOM
                )
            )
        );
        $this->assertEquals($expected, $results);

        // Test for success returned by simple biom file
        $_FILES = array(
            array(
                'name' => 'simpleBiom.json',
                'type' => 'text/plain',
                'size' => 1067,
                'tmp_name' => __DIR__ . '/testFiles/simpleBiom.json',
                'error' => 0
            )
        );
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION)));
        $expected = array("files"=>array(array("name" => "simpleBiom.json", "size" => 1067, "error" => null)));
        $this->assertEquals($expected, $results);
        $jsonContent = file_get_contents($_FILES[0]['tmp_name']);
        $db = DB::getDbForVersion(DEFAULT_DBVERSION);
        $constant = 'constant';
        $query_get_project_from_db = <<<EOF
SELECT project
    FROM webuser_data WHERE webuser_id =
        (SELECT webuser_id FROM webuser WHERE oauth_provider_id =
            (SELECT oauth_provider_id FROM oauth_provider
                WHERE provider = '{$constant('fennecweb\ProjectTest::PROVIDER')}'
            )
            AND oauth_id = '{$constant('fennecweb\ProjectTest::USERID')}'
        )
        AND project::jsonb = '{$jsonContent}'::jsonb
EOF;
        $stm_get_project_from_db = $db->prepare($query_get_project_from_db);
        $stm_get_project_from_db->execute();
        $this->assertEquals(1, $stm_get_project_from_db->rowCount());
    }
}
