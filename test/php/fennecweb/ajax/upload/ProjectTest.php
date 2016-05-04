<?php

namespace fennecweb;

class ProjectTest extends \PHPUnit_Framework_TestCase
{
    const NICKNAME = 'UploadProjectTestUser';
    const USERID = 'UploadProjectTestUser';
    const PROVIDER = 'UploadProjectTest';

    public function setUp()
    {
        $_SESSION['user'] = array(
            'nickname' => ProjectTest::NICKNAME,
            'id' => ProjectTest::USERID,
            'provider' => ProjectTest::PROVIDER,
            'token' => 'UploadProjectTestUserToken'
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
        $expected = array(
            "files"=>array(
                array(
                    "name" => "empty",
                    "size" => 0,
                    "error" => \fennecweb\ajax\upload\Project::ERROR_NOT_BIOM
                )
            )
        );
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
        $jsonContent = file_get_contents($_FILES['files']['tmp_names'][0]);
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
        $this->assertTrue($stm_get_project_from_db->fetch(\PDO::FETCH_ASSOC));
    }
}
