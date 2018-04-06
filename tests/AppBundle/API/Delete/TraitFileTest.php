<?php

namespace Tests\AppBundle\API\Listing;

use AppBundle\API\Listing;
use AppBundle\API\Upload;
use AppBundle\API\Delete;
use Tests\AppBundle\API\WebserviceTestCase;

class TraitFileTest extends WebserviceTestCase
{
    const NICKNAME = 'deleteTraitFileUser';
    const PASSWORD = 'deleteTraitFileUser';
    const EMAIL = 'listingTraitFileUploadUser@example.com';

    private $data_em;
    private $deleteTraitFile;
    private $listingTraitFileUpload;
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
        $this->listingTraitFileUpload = $kernel->getContainer()->get(Listing\TraitsFileUpload::class);
        $this->deleteTraitFile = $kernel->getContainer()->get(Delete\TraitFile::class);
        $this->uploadTraits = $kernel->getContainer()->get(Upload\Traits::class);
        $user = $user_em->getRepository('AppBundle:FennecUser')->findOneBy(array(
            'username' => TraitFileTest::NICKNAME,
            'email' => TraitFileTest::EMAIL
        ));
        if($user == null){
            $user = new FennecUser();
            $user->setUsername(TraitFileTest::NICKNAME);
            $user->setEmail(TraitFileTest::EMAIL);
            $user->setPassword(TraitFileTest::PASSWORD);
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
        $results = $this->deleteTraitFile->execute();
        $expected = array("error" => Delete\TraitFile::ERROR_NOT_LOGGED_IN, "success" => null);
        $this->assertEquals($expected, $results);
    }

    public function testTraitFileUploadsIfUserIsLoggedIn(){
        $user = $this->user;
        $result = $this->listingTraitFileUpload->execute($user);
        $expected = array("error" => array(), "data" => array());
        $this->assertEquals($expected, $result);
         // Import categorical trait file
        $_FILES = array(
            array(
                'name' => 'categoricalTrait.tsv',
                'type' => 'text/plain',
                'size' => 583,
                'tmp_name' => __DIR__ . '/../Listing/testFiles/categoricalTrait.tsv',
                'error' => 0
            )
        );
        $traitType = 'Plant Habit';
        $defaultCitation = 'deleteTraitFile_defaultCitation';
        $mapping = null;
        $skipUnmapped = true;
        $this->uploadTraits->execute($this->user, $traitType, $defaultCitation, $mapping, $skipUnmapped);

        $result = $this->listingTraitFileUpload->execute($user);
        $this->assertEquals(null, $result["error"]);
        $this->assertEquals(1, count($result["data"]));
        $this->assertEquals("categoricalTrait.tsv", $result["data"][0]["filename"]);
        $this->assertEquals("Plant Habit", $result["data"][0]["traitType"]);
        $this->assertEquals("5", $result["data"][0]["entries"]);
        $this->assertEquals("categorical", $result["data"][0]["format"]);
        $this->assertArrayHasKey("importDate", $result["data"][0]);
        $this->assertEquals(5, count($result["data"][0]));

        $traitFileId = $result["data"][0]["traitFileId"];
        $deleteResult = $this->deleteTraitFile->execute($traitFileId, $user);
        $expected = array("error" => null, "success" => "Delete trait file with id ".$traitFileId." successfully");
        $this->assertEquals($expected, $deleteResult);
        $result = $this->listingTraitFileUpload->execute($user);
        $this->assertEquals(array("error" => null, "data" => array()), $result);


    }
}
