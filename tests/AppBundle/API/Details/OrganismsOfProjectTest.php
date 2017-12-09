<?php

namespace AppBundle\API\Details;

use AppBundle\API\Webservice;
use AppBundle\Entity\FennecUser;
use Symfony\Component\HttpFoundation\ParameterBag;
use Tests\AppBundle\API\Delete\ProjectsTest;
use Tests\AppBundle\API\WebserviceTestCase;

class OrganismsOfProjectTest extends WebserviceTestCase
{
    const NICKNAME = 'detailsOrganismsOfProjectTestUser';
    const USERID = 'detailsOrganismsOfProjectTestUser';
    const PROVIDER = 'detailsOrganismsOfProjectTestUser';

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

    public function testNotLoggedIn()
    {
        $default_db = $this->default_db;
        $service = $this->webservice->factory('details', 'OrganismsOfProject');
        $results = $service->execute(new ParameterBag(array('dbversion' => $default_db)), null);
        $expected = array("error" => Webservice::ERROR_NOT_LOGGED_IN);
        $this->assertEquals($expected, $results, 'User is not loggend in, return error message');
    }


    public function testOrganismsOfProject()
    {
        $default_db = $this->default_db;
        $service = $this->webservice->factory('details', 'OrganismsOfProject');
        $user = $this->em->getRepository('AppBundle:FennecUser')->findOneBy(array(
            'username' => OrganismsOfProjectTest::NICKNAME
        ));
        $id = $this->em->getRepository('AppBundle:WebuserData')->findOneBy(array(
            'webuser' => $user
        ))->getWebuserDataId();

        $results = $service->execute(new ParameterBag(array('dbversion' => $default_db, 'internal_project_id' => $id, 'dimension' => 'rows')), $user);
        $expected = array(
            3, 42
        );
        $this->assertEquals(2, count($results), 'Example project, return uniq organism ids for rows');
        $this->assertContains($expected[0], $results, 'Example project, return uniq organism ids for rows');
        $this->assertContains($expected[1], $results, 'Example project, return uniq organism ids for rows');
        $results = $service->execute(new ParameterBag(array('dbversion' => $default_db, 'internal_project_id' => $id, 'dimension' => 'columns')), $user);
        $expected = array(
            1340, 1630
        );
        $this->assertEquals(2, count($results), 'Example project, return uniq organism ids for samples');
        $this->assertContains($expected[0], $results, 'Example project, return uniq organism ids for samples');
        $this->assertContains($expected[1], $results, 'Example project, return uniq organism ids for samples');
    }

    public function testNoValidUserOfProject(){

        $default_db = $this->default_db;
        $service = $this->webservice->factory('details', 'OrganismsOfProject');
        $user = $this->em->getRepository('AppBundle:FennecUser')->findOneBy(array(
            'username' => OrganismsOfProjectTest::NICKNAME
        ));
        $noValidProjectId = 15;
        $results = $service->execute(new ParameterBag(array('dbversion' => $default_db, 'internal_project_id' => $noValidProjectId)), $user);
        $expected = array("error" => OrganismsOfProject::ERROR_PROJECT_NOT_FOUND);
        $this->assertEquals($expected, $results, 'Project does not belong to user, return error message');

    }
}