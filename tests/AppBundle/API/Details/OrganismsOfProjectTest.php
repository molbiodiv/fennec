<?php

namespace AppBundle\API\Details;

use AppBundle\API\Webservice;
use AppBundle\Entity\FennecUser;
use Symfony\Component\HttpFoundation\ParameterBag;
use Tests\AppBundle\API\WebserviceTestCase;

class OrganismsOfProjectTest extends WebserviceTestCase
{
    const NICKNAME = 'detailsOrganismsOfProjectTestUser';
    const USERID = 'detailsOrganismsOfProjectTestUser';
    const PROVIDER = 'detailsOrganismsOfProjectTestUser';

    public function testExecute()
    {
        $default_db = $this->default_db;
        $projectListing = $this->webservice->factory('listing', 'projects');
        $service = $this->webservice->factory('details', 'OrganismsOfProject');
        $this->user = new FennecUser(OrganismsOfProjectTest::USERID,OrganismsOfProjectTest::NICKNAME,OrganismsOfProjectTest::PROVIDER);

        $results = $service->execute(new ParameterBag(array('dbversion' => $default_db)), null);
        $expected = array("error" => Webservice::ERROR_NOT_LOGGED_IN);
        $this->assertEquals($expected, $results, 'User is not loggend in, return error message');

        $entries = $projectListing->execute(new ParameterBag(array('dbversion' => $default_db)), $this->user);
        $id = $entries['data'][0]['internal_project_id'];

        $results = $service->execute(new ParameterBag(array('dbversion' => $default_db, 'internal_project_id' => $id, 'dimension' => 'rows')), $this->user);
        $expected = array(
            3, 42
        );
        $this->assertEquals(2, count($results), 'Example project, return uniq organism ids for rows');
        $this->assertContains($expected[0], $results, 'Example project, return uniq organism ids for rows');
        $this->assertContains($expected[1], $results, 'Example project, return uniq organism ids for rows');

        $results = $service->execute(new ParameterBag(array('dbversion' => $default_db, 'internal_project_id' => $id, 'dimension' => 'columns')), $this->user);
        $expected = array(
            1340, 1630
        );
        $this->assertEquals(2, count($results), 'Example project, return uniq organism ids for samples');
        $this->assertContains($expected[0], $results, 'Example project, return uniq organism ids for samples');
        $this->assertContains($expected[1], $results, 'Example project, return uniq organism ids for samples');

        $this->user = new FennecUser('noValidUserID',OrganismsOfProjectTest::NICKNAME,OrganismsOfProjectTest::PROVIDER);
        $results = $service->execute(new ParameterBag(array('dbversion' => $default_db, 'internal_project_id' => $id)), $this->user);
        $expected = array("error" => OrganismsOfProject::ERROR_PROJECT_NOT_FOUND);
        $this->assertEquals($expected, $results, 'Project does not belong to user, return error message');

    }
}