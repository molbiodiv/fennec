<?php

namespace Tests\AppBundle\API\Delete;

use AppBundle\API\Listing;
use AppBundle\API\Upload;
use AppBundle\API\Delete;
use Tests\AppBundle\API\WebserviceTestCase;

class TraitFileTest extends WebserviceTestCase
{
    const NICKNAME = 'deleteTraitFileUser';
    const PASSWORD = 'deleteTraitFileUser';
    const EMAIL = 'listingTraitFileUser@example.com';

    private $data_em;
    private $deleteTraitFile;
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

    public function testDeleteTraitFileIfUserIsLoggedIn(){
        $user = $this->user;
        $result = $this->listingTraitFiles->execute($user);
        $expected = array("error" => null, "data" => array());
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
        $traitType = new TraitType();
        $traitType->setType('testDeleteTraits_traitType');
        $traitType->setUnit('m');
        $categoricalFormat = $this->data_em->getRepository('AppBundle:TraitFormat')->findOneBy(['format' => 'categorical']);
        $traitType->setTraitFormat($categoricalFormat);
        $this->data_em->persist($traitType);
        $this->data_em->flush();
        $traitType = $traitType->getType();
        $defaultCitation = 'deleteTraitFile_defaultCitation';
        $mapping = null;
        $skipUnmapped = true;
        $this->uploadTraits->execute($this->user, $traitType, $defaultCitation, $mapping, $skipUnmapped);

        $result = $this->listingTraitFiles->execute($user);
        $this->assertEquals(null, $result["error"]);
        $this->assertEquals(1, count($result["data"]));
        $this->assertEquals("categoricalTrait.tsv", $result["data"][0]["filename"]);
        $this->assertEquals("testDeleteTraits_traitType", $result["data"][0]["traitType"]);
        $this->assertEquals("5", $result["data"][0]["entries"]);
        $this->assertEquals("categorical", $result["data"][0]["format"]);
        $this->assertArrayHasKey("importDate", $result["data"][0]);
        $this->assertArrayHasKey("traitFileId", $result["data"][0]);
        $this->assertEquals(6, count($result["data"][0]));

        $traitFileId = $result["data"][0]["traitFileId"];
        $deleteResult = $this->deleteTraitFile->execute($traitFileId, $user);
        $expected = array("error" => null, "success" => "Delete trait file with id ".$traitFileId." successfully");
        $this->assertEquals($expected, $deleteResult);
        $result = $this->listingTraitFiles->execute($user);
        $this->assertEquals(array("error" => null, "data" => array()), $result);


    }
}
