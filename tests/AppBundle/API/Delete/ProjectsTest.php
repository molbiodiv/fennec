<?php

namespace Tests\AppBundle\API\Delete;

use AppBundle\Entity\FennecUser;
use Symfony\Component\HttpFoundation\ParameterBag;
use Tests\AppBundle\API\WebserviceTestCase;

class ProjectsTest extends WebserviceTestCase 
{
    const NICKNAME = 'ProjectRemoveTestUser';
    const USERID = 'ProjectRemoveTestUser';
    const PROVIDER = 'ProjectRemoveTestUser';

    public function testExecute()
    {
        $projectListing = $this->webservice->factory('listing', 'projects');
        $service = $this->webservice->factory('delete', 'projects');
        $this->user = new FennecUser(ProjectsTest::USERID,ProjectsTest::NICKNAME,ProjectsTest::PROVIDER);
        $entries = $projectListing->execute(
            new ParameterBag(
                array('dbversion' => $this->default_db)
            ),
            $this->user
        );
        $this->assertEquals(1, count($entries['data']));
        $id = $entries['data'][0]['internal_project_id'];
        $expected = array("deletedProjects"=>1);
        $results = $service->execute(
            new ParameterBag(array('dbversion' => $this->default_db, 'ids' => array($id))),
            $this->user
        );
        $this->assertEquals($expected, $results);
        $entries = $projectListing->execute(
            new ParameterBag(
                array('dbversion' => $this->default_db)
            ),
            $this->user
        );
        $this->assertEquals(0, count($entries['data']));
    }
}
