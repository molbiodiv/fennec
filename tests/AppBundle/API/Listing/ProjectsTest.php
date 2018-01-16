<?php

namespace Tests\AppBundle\API\Listing;

use AppBundle\API\Listing;
use Symfony\Component\HttpFoundation\ParameterBag;
use Tests\AppBundle\API\WebserviceTestCase;

class ProjectsTest extends WebserviceTestCase
{
    const NICKNAME = 'listingProjectsTestUser';
    const USERID = 'listingProjectsTestUser';
    const PROVIDER = 'listingProjectsTestUser';

    private $em;
    private $listingProjects;

    public function setUp()
    {
        $kernel = self::bootKernel();

        $this->em = $kernel->getContainer()
            ->get('doctrine')
            ->getManager('test');
        $this->listingProjects = $kernel->getContainer()->get(Listing\Projects::class);
    }

    public function tearDown()
    {
        parent::tearDown();

        $this->em->close();
        $this->em = null; // avoid memory leaks
    }

    public function testIfUserIsNotLoggedIn()
    {
        $results = $this->listingProjects->execute();
        $expected = array("error" => Listing\Projects::ERROR_NOT_LOGGED_IN, "data" => array());
        $this->assertEquals($expected, $results);
    }

    public function testProjectIfUserIsLoggedIn(){
        $user = $this->em->getRepository('AppBundle:FennecUser')->findOneBy(array(
            'username' => ProjectsTest::NICKNAME
        ));
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
