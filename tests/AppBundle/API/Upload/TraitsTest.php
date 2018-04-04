<?php

namespace Tests\AppBundle\API\Upload;

use AppBundle\API\Upload;
use AppBundle\Entity\Data\TraitType;
use AppBundle\Entity\User\FennecUser;
use Tests\AppBundle\API\WebserviceTestCase;

require_once __DIR__.'/overload_is_uploaded_file.php';

class TraitsTest extends WebserviceTestCase
{
    const NICKNAME = 'UploadTraitsTestUser';
    const EMAIL = 'UploadTraitsTestUser@example.com';
    const PASSWORD = 'UploadTraitsTestUser';

    private $data_em;
    private $uploadTraits;

    public function setUp()
    {
        $kernel = self::bootKernel();

        $this->data_em = $kernel->getContainer()
            ->get('doctrine')
            ->getManager('test_data');
        $user_em = $kernel->getContainer()
            ->get('doctrine')
            ->getManager($this->user_db);
        $this->uploadTraits = $kernel->getContainer()->get(Upload\Traits::class);
        $user = $user_em->getRepository('AppBundle:FennecUser')->findOneBy(array(
            'username' => TraitsTest::NICKNAME,
            'email' => TraitsTest::EMAIL
        ));
        if($user == null){
            $user = new FennecUser();
            $user->setUsername(TraitsTest::NICKNAME);
            $user->setEmail(TraitsTest::EMAIL);
            $user->setPassword(ProjectsTest::PASSWORD);
            $user_em->persist($user);
            $user_em->flush();
        }
        $this->user = $user;
    }

    public function tearDown()
    {
        parent::tearDown();

        $this->data_em->close();
        $this->data_em = null; // avoid memory leaks
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
        $traitType = 'Plant Habit';
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
        $traitType = 'Plant Habit';
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
        // Tests before import
        $uploadTraitTree = $this->data_em->getRepository('AppBundle:TraitCategoricalValue')->findOneBy(array(
            'value' => 'uploadTraitTree'
        ));
        $this->assertNull($uploadTraitTree, 'Before import there is no trait uploadTraitTree');
        $fileImportEntry = $this->data_em->getRepository('AppBundle:TraitFileUpload')->findOneBy(array(
            'fennecUserId' => $this->user->getId(),
            'filename' => 'categoricalTrait.tsv'
        ));
        $this->assertNull($fileImportEntry, 'Before import there is no fileImportEntry for categoricalTrait.tsv');

        // Import
        $_FILES = array(
            array(
                'name' => 'categoricalTrait.tsv',
                'type' => 'text/plain',
                'size' => 583,
                'tmp_name' => __DIR__ . '/testFiles/categoricalTrait.tsv',
                'error' => 0
            )
        );
        $traitType = 'Plant Habit';
        $defaultCitation = 'uploadCategoricalTrait_defaultCitation';
        $mapping = null;
        $skipUnmapped = true;
        $results = $this->uploadTraits->execute($this->user, $traitType, $defaultCitation, $mapping, $skipUnmapped);
        $expected = array(
            "result" => array(
                "Imported entries" => "5",
                "Distinct new values" => "3",
                "Distinct new citations" => "4",
                "Skipped (no hit)" => "0",
                "Skipped (multiple hits)" => "0"
            ),
            "error" => null
        );
        $this->assertEquals($expected, $results);

        // Tests after import
        $uploadTraitTree = $this->data_em->getRepository('AppBundle:TraitCategoricalValue')->findOneBy(array(
            'value' => 'uploadTraitTree'
        ));
        $this->assertNotNull($uploadTraitTree);
        $traitEntry = $this->data_em->getRepository('AppBundle:TraitCategoricalEntry')->findOneBy(array(
            'traitCategoricalValue' => $uploadTraitTree
        ));
        $this->assertNotNull($traitEntry, 'After import a trait by a user there should be the related trait entry');
        $traitFileUploadEntry = $this->data_em->getRepository('AppBundle:TraitFileUpload')->findOneBy(array(
            'fennecUserId' => $this->user->getId(),
            'filename' => 'categoricalTrait.tsv'
        ));
        $this->assertNotNull($traitFileUploadEntry, 'After import there is a fileImportEntry categoricalTrait.tsv');
        $this->assertEquals($traitEntry->getTraitFileUpload(), $traitFileUploadEntry, 'The connection between traitType and fileUpload is correct');
    }

    public function testUploadNumericalTsv()
    {
        // Tests before import
        $this->assertNull($this->data_em->getRepository('AppBundle:TraitType')->findOneBy(array(
            'type' => 'testNumericalTraitUpload'
        )), 'before import there is no trait type called "testNumericalTraitUpload"');
        $testImportTraitByUser = new TraitType();
        $testImportTraitByUser->setType('testNumericalTraitUpload');
        $testImportTraitByUser->setUnit('m');
        $numericalFormat = $this->data_em->getRepository('AppBundle:TraitFormat')->findOneBy(['format' => 'numerical']);
        $testImportTraitByUser->setTraitFormat($numericalFormat);
        $this->data_em->persist($testImportTraitByUser);
        $this->data_em->flush();

        // Import
        $_FILES = array(
            array(
                'name' => 'numericalTrait.tsv',
                'type' => 'text/plain',
                'size' => 583,
                'tmp_name' => __DIR__ . '/testFiles/numericalTrait.tsv',
                'error' => 0
            )
        );
        $traitType = 'testNumericalTraitUpload';
        $defaultCitation = 'uploadNumericalTrait_defaultCitation';
        $mapping = 'ncbi_taxonomy';
        $skipUnmapped = true;
        $results = $this->uploadTraits->execute($this->user, $traitType, $defaultCitation, $mapping, $skipUnmapped);
        $expected = array(
            "result" => array(
                "Imported entries" => "3",
                "Distinct new values" => "0",
                "Distinct new citations" => "3",
                "Skipped (no hit)" => "2",
                "Skipped (multiple hits)" => "0"
            ),
            "error" => null
        );
        $this->assertEquals($expected, $results);

        // Tests after import
        $traitType = $this->data_em->getRepository('AppBundle:TraitType')->findOneBy(array(
            'type' => 'testNumericalTraitUpload'
        ));
        $this->assertNotNull($traitType);
        $numEntry = $this->data_em->getRepository('AppBundle:TraitNumericalEntry')->findOneBy(array(
            'traitType' => $traitType
        ));
        $this->assertNotNull($numEntry, 'After import a numerical entry of type "testNumericalTraitUpload" exists');

        $traitFileUploadEntry = $this->data_em->getRepository('AppBundle:TraitFileUpload')->findOneBy(array(
            'fennecUserId' => $this->user->getId(),
            'filename' => 'numericalTrait.tsv'
        ));
        $this->assertNotNull($traitFileUploadEntry, 'After import there is a fileImportEntry for user 1 and numericalTraitsByUser.tsv');
        $this->assertEquals($numEntry->getTraitFileUpload(), $traitFileUploadEntry, 'The connection between traitType and fileUpload is correct');
    }
}
