<?php

namespace Tests\AppBundle\API\Upload;

use AppBundle\API\Upload\Projects;
use AppBundle\Entity\FennecUser;
use Symfony\Component\HttpFoundation\ParameterBag;
use Tests\AppBundle\API\WebserviceTestCase;

require_once __DIR__.'/overload_is_uploaded_file.php';

class ProjectsTest extends WebserviceTestCase
{
    const NICKNAME = 'UploadProjectTestUser';
    const USERID = 'UploadProjectTestUser';
    const PROVIDER = 'UploadProjectTest';

    public function testExecute()
    {
        $default_db = $this->default_db;
        $service = $this->webservice->factory('upload', 'projects');
        $this->user = new FennecUser(ProjectsTest::USERID, ProjectsTest::NICKNAME, ProjectsTest::PROVIDER);
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

        $results = $service->execute(
            new ParameterBag(array('dbversion' => $default_db)),
            $this->user
        );
        $expected = array(
            "files"=>array(
                array(
                    "name" => "empty",
                    "size" => 0,
                    "error" => Projects::ERROR_NOT_BIOM
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
        $results = $service->execute(
            new ParameterBag(array('dbversion' => $default_db)),
            $this->user
        );
        $expected = array(
            "files"=>array(
                array(
                    "name" => "noJson",
                    "size" => 71,
                    "error" => Projects::ERROR_NOT_BIOM
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
        $results = $service->execute(
            new ParameterBag(array('dbversion' => $default_db)),
            $this->user
        );
        $expected = array(
            "files"=>array(
                array(
                    "name" => "noBiom.json",
                    "size" => 71,
                    "error" => Projects::ERROR_NOT_BIOM
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
        $results = $service->execute(
            new ParameterBag(array('dbversion' => $default_db)),
            $this->user
        );
        $expected = array("files"=>array(array("name" => "simpleBiom.json", "size" => 1067, "error" => null)));
        $this->assertEquals($expected, $results);
        $jsonContent = file_get_contents($_FILES[0]['tmp_name']);
        $db = $this->container->get('app.orm')->getManagerForVersion($default_db)->getConnection();
        $constant = 'constant';
        $query_get_project_from_db = <<<EOF
SELECT project, import_filename
    FROM webuser_data WHERE webuser_id =
        (SELECT webuser_id FROM webuser WHERE oauth_provider_id =
            (SELECT oauth_provider_id FROM oauth_provider
                WHERE provider = '{$constant('Tests\AppBundle\API\Upload\ProjectsTest::PROVIDER')}'
            )
            AND oauth_id = '{$constant('Tests\AppBundle\API\Upload\ProjectsTest::USERID')}'
        )
        AND project::jsonb = '{$jsonContent}'::jsonb
EOF;
        $stm_get_project_from_db = $db->prepare($query_get_project_from_db);
        $stm_get_project_from_db->execute();
        //this test is commented out according to issue #108
//        $this->assertEquals(1, $stm_get_project_from_db->rowCount());
//        $result = $stm_get_project_from_db->fetch(\PDO::FETCH_ASSOC);
//        $this->assertEquals('simpleBiom.json', $result['import_filename']);

        // Test for success returned by simple biom file in hdf5 format
        copy(__DIR__ . '/testFiles/simpleBiom.hdf5', __DIR__ . '/testFiles/simpleBiom.hdf5.backup');
        $_FILES = array(
            array(
                'name' => 'simpleBiom.hdf5',
                'type' => 'application/octet-stream',
                'size' => 33840,
                'tmp_name' => __DIR__ . '/testFiles/simpleBiom.hdf5',
                'error' => 0
            )
        );
        $results = $service->execute(
            new ParameterBag(array('dbversion' => $default_db)),
            $this->user
        );
        $expected = array("files"=>array(array("name" => "simpleBiom.hdf5", "size" => 33840, "error" => null)));
        $this->assertEquals($expected, $results);
        rename(__DIR__ . '/testFiles/simpleBiom.hdf5.backup', __DIR__ . '/testFiles/simpleBiom.hdf5');

        // Test for success returned by plain otu table file
        copy(__DIR__ . '/testFiles/otuTable.tsv', __DIR__ . '/testFiles/otuTable.tsv.backup');
        $_FILES = array(
            array(
                'name' => 'otuTable.tsv',
                'type' => 'text/plain',
                'size' => 67,
                'tmp_name' => __DIR__ . '/testFiles/otuTable.tsv',
                'error' => 0
            )
        );
        $results = $service->execute(
            new ParameterBag(array('dbversion' => $default_db)),
            $this->user
        );
        $expected = array("files"=>array(array("name" => "otuTable.tsv", "size" => 67, "error" => null)));
        $this->assertEquals($expected, $results);
        rename(__DIR__ . '/testFiles/otuTable.tsv.backup', __DIR__ . '/testFiles/otuTable.tsv');
    }
}
