<?php

namespace Tests\AppBundle\API\Edit;

use AppBundle\Entity\User\FennecUser;
use Doctrine\ORM\EntityManagerInterface;
use Tests\AppBundle\API\WebserviceTestCase;
use AppBundle\API\Details;
use AppBundle\API\Edit;

class UpdateProjectTest extends WebserviceTestCase
{
    const NICKNAME = 'UpdateProjectTestUser';
    const USERID = 'UpdateProjectTestUser';
    const PROVIDER = 'UpdateProjectTestUser';
    const TOKEN = 'UpdateProjectTestToken';

    /** @var  EntityManagerInterface */
    private $em;
    private $projectDetails;
    private $updateProject;

    public function setUp()
    {
        $kernel = self::bootKernel();

        $this->em = $kernel->getContainer()
            ->get('doctrine')
            ->getManager('test_user');
        $this->projectDetails = $kernel->getContainer()->get(Details\Projects::class);
        $this->updateProject = $kernel->getContainer()->get(Edit\UpdateProject::class);
    }

    public function tearDown()
    {
        parent::tearDown();

        $this->em->close();
        $this->em = null; // avoid memory leaks
    }

    public function testBeforeUpdate()
    {
        $user = $this->em->getRepository('AppBundle:FennecUser')->findOneBy(array(
            'username' => UpdateProjectTest::NICKNAME
        ));
        $projectId = $this->em->getRepository('AppBundle:Project')->findOneBy(array(
            'webuser' => $user
        ))->getWebuserDataId();
        $results = $this->projectDetails->execute($projectId, $user);
        $biom = json_decode($results['projects'][$projectId]['biom'], true);
        // Check for initial state
        $this->assertEquals('table_1', $biom['id']);
        $this->assertFalse(array_key_exists('comment', $biom));
    }

    /**
     * @depends testBeforeUpdate
     */
    public function testAfterUpdate(){
        $user = $this->em->getRepository('AppBundle:FennecUser')->findOneBy(array(
            'username' => UpdateProjectTest::NICKNAME
        ));
        $projectId = $this->em->getRepository('AppBundle:Project')->findOneBy(array(
            'webuser' => $user
        ))->getWebuserDataId();
        $results = $this->projectDetails->execute($projectId,$user);
        $biom = json_decode($results['projects'][$projectId]['biom'], true);
        // Now update the project
        $biom['id'] = 'Updated ID';
        $biom['comment'] = 'New comment';
        $results = $this->updateProject->execute($projectId, json_encode($biom), $user);
        $this->assertNull($results['error']);
        $this->em->clear();
        $results = $this->projectDetails->execute($projectId,$user);
        $biom = json_decode($results['projects'][$projectId]['biom'], true);
        // Check for initial state
        $this->assertEquals('Updated ID', $biom['id']);
        $this->assertEquals('New comment', $biom['comment']);
    }
}