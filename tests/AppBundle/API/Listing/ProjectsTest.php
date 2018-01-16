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
        $default_db = $this->default_db;
        $service = $this->webservice->factory('listing', 'projects');

        //Test for error returned by user is not logged in
        $results = $service->execute(
            new ParameterBag(array('dbversion' => $default_db)),
            null
        );
        $expected = array("error" => Webservice::ERROR_NOT_LOGGED_IN, "data" => array());

        $this->assertEquals($expected, $results);
    }

    public function testProjectIfUserIsLoggedIn(){
        //Test of correct project if the user has only one project
        $default_db = $this->default_db;
        $service = $this->webservice->factory('listing', 'projects');
        $user = $this->em->getRepository('AppBundle:FennecUser')->findOneBy(array(
            'username' => ProjectsTest::NICKNAME
        ));
        $results = $service->execute(
            new ParameterBag(array('dbversion' => $default_db)),
            $user
        );
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
