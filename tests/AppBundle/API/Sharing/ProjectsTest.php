<?php

use Tests\AppBundle\API\WebserviceTestCase;
use AppBundle\API\Sharing;

class ProjectsTest extends WebserviceTestCase
{
    private $em;
    private $sharingProjects;

    public function setUp()
    {
        $kernel = self::bootKernel();

        $this->em = $kernel->getContainer()
            ->get('doctrine')
            ->getManager('test');
        $this->sharingProjects = $kernel->getContainer()->get(Sharing\Projects::class);
    }

    public function tearDown()
    {
        parent::tearDown();

        $this->em->close();
        $this->em = null; // avoid memory leaks
    }
}