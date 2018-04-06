<?php

namespace Tests\AppBundle\API\Listing;

use AppBundle\API\Listing;
use AppBundle\API\Upload;
use AppBundle\Entity\Data\TraitFileUpload;
use Tests\AppBundle\API\WebserviceTestCase;

class TraitFileUploadsTest extends WebserviceTestCase
{
    const NICKNAME = 'listingTraitFileUploadUser';
    const PASSWORD = 'listingTraitFileUploadUser';
    const EMAIL = 'listingTraitFileUploadUser@example.com';

    private $data_em;
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
        $this->listingTraitFileUpload = $kernel->getContainer()->get(Listing\TraitFileUploads::class);
        $this->uploadTraits = $kernel->getContainer()->get(Upload\Traits::class);
        $user = $user_em->getRepository('AppBundle:FennecUser')->findOneBy(array(
            'username' => TraitFileUploadsTest::NICKNAME,
            'email' => TraitFileUploadsTest::EMAIL
        ));
        if($user == null){
            $user = new FennecUser();
            $user->setUsername(TraitFileUploadsTest::NICKNAME);
            $user->setEmail(TraitFileUploadsTest::EMAIL);
            $user->setPassword(TraitFileUploadsTest::PASSWORD);
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
        $results = $this->listingTraitFileUpload->execute();
        $expected = array("error" => Listing\TraitFileUploads::ERROR_NOT_LOGGED_IN, "data" => array());
        $this->assertEquals($expected, $results);
    }

    public function testTraitFileUploadsIfUserIsLoggedIn(){
        $user = $this->em->getRepository('AppBundle:FennecUser')->findOneBy(array(
            'username' => ProjectsTest::NICKNAME
        ));
        $result = $this->listingTraitFileUpload->execute($user);
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
        $defaultCitation = 'uploadCategoricalTrait_defaultCitation';
        $mapping = null;
        $skipUnmapped = true;
        $results = $this->uploadTraits->execute($this->user, $traitType, $defaultCitation, $mapping, $skipUnmapped);


        $results = $this->listingProjects->execute($user);
        $expected = array("data" => array(
                array(
                    "id" => "table_1",
                    "rows" => 10,
                    "columns" => 5,
                    "import_filename" => "listingProjectsTestFile.biom"
                )
            )
        );
        $this->assertArraySubset($expected, $results);
    }
}
