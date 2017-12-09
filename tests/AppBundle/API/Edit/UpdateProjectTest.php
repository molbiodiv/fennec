<?php

namespace Tests\AppBundle\API\Edit;

use AppBundle\Entity\FennecUser;
use Symfony\Component\HttpFoundation\ParameterBag;
use Tests\AppBundle\API\WebserviceTestCase;

class UpdateProjectTest extends WebserviceTestCase
{
    const NICKNAME = 'UpdateProjectTestUser';
    const USERID = 'UpdateProjectTestUser';
    const PROVIDER = 'UpdateProjectTestUser';
    const TOKEN = 'UpdateProjectTestToken';

    private $em;

    public function setUp()
    {
        $kernel = self::bootKernel();

        $this->em = $kernel->getContainer()
            ->get('app.orm')
            ->getManagerForVersion('test');
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
        $id = $this->em->getRepository('AppBundle:WebuserData')->findOneBy(array(
            'webuser' => $user
        ))->getWebuserDataId();
        $detailsProject = $this->webservice->factory('details', 'projects');
        $results = $detailsProject->execute(new ParameterBag(array(
            'dbversion' => $this->default_db,
            'ids' => array($id))),
            $user
        );
        $biom = json_decode($results['projects'][$id]['biom'], true);
        // Check for initial state
        $this->assertEquals('table_1', $biom['id']);
        $this->assertFalse(array_key_exists('comment', $biom));
    }

    public function testAfterUpdate(){
        $service = $this->webservice->factory('edit', 'updateProject');
        $user = $this->em->getRepository('AppBundle:FennecUser')->findOneBy(array(
            'username' => UpdateProjectTest::NICKNAME
        ));
        $id = $this->em->getRepository('AppBundle:WebuserData')->findOneBy(array(
            'webuser' => $user
        ))->getWebuserDataId();
        $detailsProject = $this->webservice->factory('details', 'projects');
        // Now update the project
        $biom['id'] = 'Updated ID';
        $biom['comment'] = 'New comment';
        $results = $service->execute(
            new ParameterBag(array(
                'dbversion' => $this->default_db,
                'biom' => json_encode($biom),
                'project_id' => $id
            )),
            $user
        );
        $this->assertNull($results['error']);
        $results = $detailsProject->execute(new ParameterBag(array(
            'dbversion' => $this->default_db,
            'ids' => array($id))),
            $user
        );
        $biom = json_decode($results['projects'][$id]['biom'], true);
        // Check for initial state
        $this->assertEquals('Updated ID', $biom['id']);
        $this->assertEquals('New comment', $biom['comment']);
    }
}