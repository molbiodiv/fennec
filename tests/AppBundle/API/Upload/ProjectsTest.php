<?php

namespace Tests\AppBundle\API\Upload;

use AppBundle\API\Upload\Projects;
use AppBundle\Entity\FennecUser;
use Symfony\Component\HttpFoundation\ParameterBag;
use Tests\AppBundle\API\WebserviceTestCase;
use AppBundle\API\Upload;

require_once __DIR__.'/overload_is_uploaded_file.php';

class ProjectsTest extends WebserviceTestCase
{
    const NICKNAME = 'UploadProjectTestUser';
    const USERID = 'UploadProjectTestUser';
    const PROVIDER = 'UploadProjectTest';

    private $em;
    private $uploadProjects;

    public function setUp()
    {
        $kernel = self::bootKernel();

        $this->em = $kernel->getContainer()
            ->get('doctrine')
            ->getManager('test');
        $this->uploadProjects = $kernel->getContainer()->get(Upload\Projects::class);
    }

    public function tearDown()
    {
        parent::tearDown();

        $this->em->close();
        $this->em = null; // avoid memory leaks
    }


    public function testUploadEmptyFile()
    {
        $user = new FennecUser();
        $user->setUsername('UploadProjectTestUser');
        $user->setEmail('UploadProjectTestUser@test.de');
        $_FILES = array(
            array(
                'name' => 'empty',
                'type' => 'text/plain',
                'size' => 0,
                'tmp_name' => __DIR__ . '/testFiles/empty',
                'error' => 0
            )
        );
        $results = $this->uploadProjects->execute($user);
        $expected = array(
            "files" => array(
                array(
                    "name" => "empty",
                    "size" => 0,
                    "error" => Projects::ERROR_NOT_BIOM
                )
            )
        );
        $this->assertEquals($expected, $results);
    }

    /**
     * @depends testUploadEmptyFile
     */
    public function testUploadNoJSON()
    {
        $user = new FennecUser();
        $user->setUsername('UploadProjectTestUser');
        $user->setEmail('UploadProjectTestUser@test.de');
        $_FILES = array(
            array(
                'name' => 'noJson',
                'type' => 'text/plain',
                'size' => 71,
                'tmp_name' => __DIR__ . '/testFiles/noJson',
                'error' => 0
            )
        );
        $results = $this->uploadProjects->execute($user);
        $expected = array(
            "files" => array(
                array(
                    "name" => "noJson",
                    "size" => 71,
                    "error" => Projects::ERROR_NOT_BIOM
                )
            )
        );
        $this->assertEquals($expected, $results);
    }

    public function testUploadNoBIOM()
    {
        $user = new FennecUser();
        $user->setUsername('UploadProjectTestUser');
        $user->setEmail('UploadProjectTestUser@test.de');
        $_FILES = array(
            array(
                'name' => 'noBiom.json',
                'type' => 'text/plain',
                'size' => 71,
                'tmp_name' => __DIR__ . '/testFiles/noBiom.json',
                'error' => 0
            )
        );
        $results = $this->uploadProjects->execute($user);
        $expected = array(
            "files" => array(
                array(
                    "name" => "noBiom.json",
                    "size" => 71,
                    "error" => Projects::ERROR_NOT_BIOM
                )
            )
        );
        $this->assertEquals($expected, $results);
    }

    public function testUploadBiom()
    {
        $user = new FennecUser();
        $user->setUsername('UploadProjectTestUser');
        $user->setEmail('UploadProjectTestUser@test.de');
        $_FILES = array(
            array(
                'name' => 'simpleBiom.json',
                'type' => 'text/plain',
                'size' => 1067,
                'tmp_name' => __DIR__ . '/testFiles/simpleBiom.json',
                'error' => 0
            )
        );
        $results = $this->uploadProjects->execute($user);
        $expected = array("files" => array(array("name" => "simpleBiom.json", "size" => 1067, "error" => null)));
        $this->assertEquals($expected, $results);
    }

    public function testUploadSimpleBiomInHdf5()
    {
        $user = new FennecUser();
        $user->setUsername('UploadProjectTestUser');
        $user->setEmail('UploadProjectTestUser@test.de');
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
        $results = $this->uploadProjects->execute($user);
        $expected = array("files" => array(array("name" => "simpleBiom.hdf5", "size" => 33840, "error" => null)));
        $this->assertEquals($expected, $results);
        rename(__DIR__ . '/testFiles/simpleBiom.hdf5.backup', __DIR__ . '/testFiles/simpleBiom.hdf5');
    }

    public function testUploadOtuTable(){
        $user = new FennecUser();
        $user->setUsername('UploadProjectTestUser');
        $user->setEmail('UploadProjectTestUser@test.de');
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
        $results = $this->uploadProjects->execute($user);
        $expected = array("files"=>array(array("name" => "otuTable.tsv", "size" => 67, "error" => null)));
        $this->assertEquals($expected, $results);
        rename(__DIR__ . '/testFiles/otuTable.tsv.backup', __DIR__ . '/testFiles/otuTable.tsv');
    }
}
