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
        $traitType = 'TraitType';
        $defaultCitation = 'DefaultCitation';
        $mapping = null;
        $skipUnmapped = true;
        $results = $this->uploadTraits->execute($this->user, $traitType, $defaultCitation, $mapping, $skipUnmapped);
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

    public function testUploadNoTsv()
    {
        $_FILES = array(
            array(
                'name' => 'noTsv',
                'type' => 'text/plain',
                'size' => 583,
                'tmp_name' => __DIR__ . '/testFiles/noTsv.tsv',
                'error' => 0
            )
        );
        $traitType = 'TraitType';
        $defaultCitation = 'DefaultCitation';
        $mapping = null;
        $skipUnmapped = true;
        $results = $this->uploadTraits->execute($this->user, $traitType, $defaultCitation, $mapping, $skipUnmapped);
        $expected = array(
            "result" => null,
            "error" => "Error could not import file. Line 1 does not have 5 columns."
        );
        $this->assertEquals($expected, $results);
    }

    public function testUploadCategoricalTsv()
    {
        $_FILES = array(
            array(
                'name' => 'categoricalTrait.tsv',
                'type' => 'text/plain',
                'size' => 583,
                'tmp_name' => __DIR__ . '/testFiles/categoricalTrait.tsv',
                'error' => 0
            )
        );
        $traitType = 'Plant Growth Habit';
        $defaultCitation = 'uploadCategoricalTrait_defaultCitation';
        $mapping = null;
        $skipUnmapped = true;
        $results = $this->uploadTraits->execute($this->user, $traitType, $defaultCitation, $mapping, $skipUnmapped);
        $expected = array(
            "result" => array(
                "Imported entries" => 5,
                "Distinct new values" => 2,
                "Distinct new citations" => 3,
                "Skipped (no hit)" => 0,
                "Skipped (multiple hits)" => 0
            ),
            "error" => null
        );
        $this->assertEquals($expected, $results);
    }

    public function testUploadNumericalTsv()
    {
        $_FILES = array(
            array(
                'name' => 'numericalTrait.tsv',
                'type' => 'text/plain',
                'size' => 583,
                'tmp_name' => __DIR__ . '/testFiles/numericalTrait.tsv',
                'error' => 0
            )
        );
        $traitType = 'Plant Height';
        $defaultCitation = 'uploadNumericalTrait_defaultCitation';
        $mapping = 'ncbi_taxonomy';
        $skipUnmapped = true;
        $results = $this->uploadTraits->execute($this->user, $traitType, $defaultCitation, $mapping, $skipUnmapped);
        $expected = array(
            "result" => array(
                "Imported entries" => 7,
                "Distinct new values" => 0,
                "Distinct new citations" => 3,
                "Skipped (no hit)" => 3,
                "Skipped (multiple hits)" => 0
            ),
            "error" => null
        );
        $this->assertEquals($expected, $results);
    }
}
