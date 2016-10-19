<?php

namespace Tests\AppBundle\API\Delete;

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
        $this->session->set('user',
            array(
                'nickname' => ProjectsTest::NICKNAME,
                'id' => ProjectsTest::USERID,
                'provider' => ProjectsTest::PROVIDER,
                'token' => 'ProjectRemoveTestUserToken'
            )
        );
        $entries = $projectListing->execute(
            new ParameterBag(
                array('dbversion' => $this->default_db)
            ),
            $this->session
        );
        $this->assertEquals(1, count($entries['data']));
        $id = $entries['data'][0]['internal_project_id'];
        $expected = array("deletedProjects"=>1);
        $results = $service->execute(
            new ParameterBag(array('dbversion' => $this->default_db, 'ids' => array($id))),
            $this->session
        );
        $this->assertEquals($expected, $results);
        $entries = $projectListing->execute(
            new ParameterBag(
                array('dbversion' => $this->default_db)
            ),
            $this->session
        );
        $this->assertEquals(0, count($entries['data']));
    }
}
