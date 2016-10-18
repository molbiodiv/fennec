<?php

namespace Tests\AppBundle\API\Delete;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\MockArraySessionStorage;

class ProjectsTest extends WebTestCase
{
    const NICKNAME = 'ProjectRemoveTestUser';
    const USERID = 'ProjectRemoveTestUser';
    const PROVIDER = 'ProjectRemoveTestUser';

    public function testExecute()
    {
        $container = static::createClient()->getContainer();
        $default_db = $container->getParameter('default_db');
        $projectListing = $container->get('app.api.webservice')->factory('listing', 'projects');
        $service = $container->get('app.api.webservice')->factory('delete', 'projects');
        $session = new Session(new MockArraySessionStorage());
        $session->set('user',
            array(
                'nickname' => ProjectsTest::NICKNAME,
                'id' => ProjectsTest::USERID,
                'provider' => ProjectsTest::PROVIDER,
                'token' => 'ProjectRemoveTestUserToken'
            )
        );
        $entries = $projectListing->execute(
            new ParameterBag(
                array('dbversion' => $default_db)
            ),
            $session
        );
        $this->assertEquals(1, count($entries['data']));
        $id = $entries['data'][0]['internal_project_id'];
        $expected = array("deletedProjects"=>1);
        $results = $service->execute(
            new ParameterBag(array('dbversion' => $default_db, 'ids' => array($id))),
            $session
        );
        $this->assertEquals($expected, $results);
        $entries = $projectListing->execute(
            new ParameterBag(
                array('dbversion' => $default_db)
            ),
            $session
        );
        $this->assertEquals(0, count($entries['data']));
    }
}
