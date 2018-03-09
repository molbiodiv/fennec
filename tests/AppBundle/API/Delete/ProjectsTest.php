<?php

namespace Tests\AppBundle\API\Delete;

use Tests\AppBundle\API\WebserviceTestCase;
use AppBundle\Entity\User\Project;
use AppBundle\API\Delete;
use AppBundle\API\Listing;

class ProjectsTest extends WebserviceTestCase 
{
    const NICKNAME = 'ProjectRemoveTestUser';
    const USERID = 'ProjectRemoveTestUser';
    const PROVIDER = 'ProjectRemoveTestUser';

    private $em;
    private $deleteProject;
    private $listingProject;

    public function setUp()
    {
        $kernel = self::bootKernel();

        $this->em = $kernel->getContainer()
            ->get('doctrine')
            ->getManager('test_user');
        $this->deleteProject = $kernel->getContainer()->get(Delete\Projects::class);
        $this->listingProject = $kernel->getContainer()->get(Listing\Projects::class);

    }

    public function tearDown()
    {
        parent::tearDown();

        $this->em->close();
        $this->em = null; // avoid memory leaks
    }

    public function testBeforeDelete(){
        $user = $this->em->getRepository('AppBundle:FennecUser')->findOneBy(array(
            'username' => ProjectsTest::NICKNAME
        ));
        $projectListing = $this->em->getRepository(Project::class)->getDataForUser($user);
        $this->assertEquals(1, count($projectListing));
    }

    /**
     * @depends testBeforeDelete
     */
    public function testDelete(){
        $user = $this->em->getRepository('AppBundle:FennecUser')->findOneBy(array(
            'username' => ProjectsTest::NICKNAME
        ));
        $project = $this->em->getRepository(Project::class)->getDataForUser($user);
        $projectId = $project[0]['webuserDataId'];
        $expected = array("deletedProjects"=>1);
        $attribute = 'owner';
        $results = $this->deleteProject->execute($user, $projectId, $attribute);
        $this->assertEquals($expected, $results);
    }

    /**
     * @depends testDelete
     */
    public function testAfterDelete(){
        $user = $this->em->getRepository('AppBundle:FennecUser')->findOneBy(array(
            'username' => ProjectsTest::NICKNAME
        ));
        $entries = $this->listingProject->execute($user);
        $this->assertEquals(0, count($entries['data']));
    }
}
