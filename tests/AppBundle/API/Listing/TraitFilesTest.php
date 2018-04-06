<?php

namespace Tests\AppBundle\API\Listing;

use AppBundle\API\Listing;
use AppBundle\API\Upload;
use AppBundle\Entity\User\FennecUser;
use Tests\AppBundle\API\WebserviceTestCase;

class TraitFilesTest extends WebserviceTestCase
{
    const NICKNAME = 'listingTraitFileser';
    const PASSWORD = 'listingTraitFileser';
    const EMAIL = 'listingTraitFileser@example.com';

    private $data_em;
    private $listingTraitFiles;
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
        $this->listingTraitFiles = $kernel->getContainer()->get(Listing\TraitFiles::class);
        $this->uploadTraits = $kernel->getContainer()->get(Upload\Traits::class);
        $user = $user_em->getRepository('AppBundle:FennecUser')->findOneBy(array(
            'username' => TraitFilesTest::NICKNAME,
            'email' => TraitFilesTest::EMAIL
        ));
        if($user == null){
            $user = new FennecUser();
            $user->setUsername(TraitFilesTest::NICKNAME);
            $user->setEmail(TraitFilesTest::EMAIL);
            $user->setPassword(TraitFilesTest::PASSWORD);
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

    public function testIfUserIsNotLoggedIn()
    {
        $results = $this->listingTraitFiles->execute();
        $expected = array("error" => Listing\TraitFiles::ERROR_NOT_LOGGED_IN, "data" => array());
        $this->assertEquals($expected, $results);
    }

    public function testTraitFileUploadsIfUserIsLoggedIn(){
        $user = $this->user;
        $result = $this->listingTraitFiles->execute($user);
        $expected = array("error" => array(), "data" => array());
        $this->assertEquals($expected, $result);

         // Import categorical trait file
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
        $defaultCitation = 'listingTraitFiles_defaultCitation';
        $mapping = null;
        $skipUnmapped = true;
        $this->uploadTraits->execute($this->user, $traitType, $defaultCitation, $mapping, $skipUnmapped);

        $result = $this->listingTraitFiles->execute($user);
        $this->assertEquals(null, $result["error"]);
        $this->assertEquals(1, count($result["data"]));
        $this->assertEquals("categoricalTrait.tsv", $result["data"][0]["filename"]);
        $this->assertEquals("Plant Habit", $result["data"][0]["traitType"]);
        $this->assertEquals("5", $result["data"][0]["entries"]);
        $this->assertEquals("categorical", $result["data"][0]["format"]);
        $this->assertArrayHasKey("importDate", $result["data"][0]);
        $this->assertArrayHasKey("traitFileId", $result["data"][0]);
        $this->assertEquals(6, count($result["data"][0]));

        // Import numerical trait file
        $_FILES = array(
            array(
                'name' => 'numericalTrait.tsv',
                'type' => 'text/plain',
                'size' => 583,
                'tmp_name' => __DIR__ . '/testFiles/categoricalTrait.tsv',
                'error' => 0
            )
        );
        $traitType = 'Leaf size';
        $defaultCitation = 'listingTraitFiles_defaultCitation';
        $mapping = 'ncbi_taxonomy';
        $skipUnmapped = true;
        $this->uploadTraits->execute($this->user, $traitType, $defaultCitation, $mapping, $skipUnmapped);

        $result = $this->listingTraitFiles->execute($user);
        $this->assertEquals(null, $result["error"]);
        $this->assertEquals(2, count($result["data"]));
        $this->assertEquals("numericalTrait.tsv", $result["data"][1]["filename"]);
        $this->assertEquals("Leaf size", $result["data"][1]["traitType"]);
        $this->assertEquals("3", $result["data"][1]["entries"]);
        $this->assertEquals("numerical", $result["data"][1]["format"]);
        $this->assertArrayHasKey("importDate", $result["data"][1]);
        $this->assertArrayHasKey("traitFileId", $result["data"][1]);
        $this->assertEquals(6, count($result["data"][1]));
    }
}
