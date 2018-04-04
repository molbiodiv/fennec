<?php

namespace Tests\AppBundle\API\Upload;

use AppBundle\API\Upload;
use AppBundle\API\Upload\Projects;
use AppBundle\Entity\User\FennecUser;
use Tests\AppBundle\API\WebserviceTestCase;

require_once __DIR__.'/overload_is_uploaded_file.php';

class TraitsTest extends WebserviceTestCase
{
    const NICKNAME = 'UploadTraitsTestUser';
    const EMAIL = 'UploadTraitsTestUser@example.com';
    const PASSWORD = 'UploadTraitsTestUser';

    private $user_em;
    private $data_em;
    private $uploadTraits;
    private $user;

    public function setUp()
    {
        $kernel = self::bootKernel();

        $this->user_em = $kernel->getContainer()
            ->get('doctrine')
            ->getManager('test_user');
        $this->data_em = $kernel->getContainer()
            ->get('doctrine')
            ->getManager('test_data');
        $this->uploadTraits = $kernel->getContainer()->get(Upload\Traits::class);
        $user = new FennecUser();
        $user->setUsername(TraitsTest::NICKNAME);
        $user->setEmail(TraitsTest::EMAIL);
        $user->setPassword(ProjectsTest::PASSWORD);
        $this->user_em->persist($user);
        $this->user_em->flush();
        $this->user = $user;
    }

    public function tearDown()
    {
        parent::tearDown();

        $this->data_em->close();
        $this->user_em->close();
        $this->data_em = null; // avoid memory leaks
        $this->user_em = null; // avoid memory leaks
    }


    public function testUploadEmptyFile()
    {
        $_FILES = array(
            array(
                'name' => 'empty',
                'type' => 'text/plain',
                'size' => 0,
                'tmp_name' => __DIR__ . '/testFiles/empty',
                'error' => 0
            )
        );
        $skipUnmapped = true;
        $results = $this->uploadTraits->execute($this->user, 'TraitType', 'DefaultCitation', 'Mapping', $skipUnmapped);
        $expected = array(
            "result" => array(
                "Imported entries" => 0,
                "Distinct new values" => 0,
                "Distinct new citations" => 0,
                "Skipped (no hit)" => 0,
                "Skipped (multiple hits)" => 0
            ),
            "error" => null
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
        $user->setPassword(ProjectsTest::PASSWORD);
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
        $user->setPassword(ProjectsTest::PASSWORD);
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
        $user->setUsername('UploadBiomTestUser');
        $user->setEmail('UploadBiomTestUser@test.de');
        $user->setPassword(ProjectsTest::PASSWORD);
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
        $user->setUsername('UploadHdf5TestUser');
        $user->setEmail('UploadHdf5TestUser@test.de');
        $user->setPassword(ProjectsTest::PASSWORD);
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
        $user->setUsername('UploadOTUTestUser');
        $user->setEmail('UploadOTUTestUser@test.de');
        $user->setPassword(ProjectsTest::PASSWORD);
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
