<?php

namespace AppBundle\API\Details;

use AppBundle\API\Webservice;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\MockArraySessionStorage;

class OrganismsOfProjectTest extends WebTestCase
{
    const NICKNAME = 'detailsOrganismsOfProjectTestUser';
    const USERID = 'detailsOrganismsOfProjectTestUser';
    const PROVIDER = 'detailsOrganismsOfProjectTestUser';

    public function testExecute()
    {
        $container = static::createClient()->getContainer();
        $default_db = $container->getParameter('default_db');
        $projectListing = $container->get('app.api.webservice')->factory('listing', 'projects');
        $service = $container->get('app.api.webservice')->factory('details', 'OrganismsOfProject');
        $session = new Session(new MockArraySessionStorage());
        $session->set('user',
            array(
                'nickname' => OrganismsOfProjectTest::NICKNAME,
                'id' => OrganismsOfProjectTest::USERID,
                'provider' => OrganismsOfProjectTest::PROVIDER,
                'token' => 'detailsOrganismsOfProjectTestToken'
            )
        );

        $results = $service->execute(new ParameterBag(array('dbversion' => $default_db)), null);
        $expected = array("error" => Webservice::ERROR_NOT_LOGGED_IN);
        $this->assertEquals($expected, $results, 'User is not loggend in, return error message');

        $entries = $projectListing->execute(new ParameterBag(array('dbversion' => $default_db)), $session);
        $id = $entries['data'][0]['internal_project_id'];

        $results = $service->execute(new ParameterBag(array('dbversion' => $default_db, 'internal_project_id' => $id)), $session);
        $expected = array(
            3, 42
        );
        $this->assertEquals(2, count($results), 'Example project, return uniq organism ids');
        $this->assertContains($expected[0], $results, 'Example project, return uniq organism ids');
        $this->assertContains($expected[1], $results, 'Example project, return uniq organism ids');

        $session->set('user', array('id' => 'noValidUserID', 'provider' => OrganismsOfProjectTest::PROVIDER));
        $results = $service->execute(new ParameterBag(array('dbversion' => $default_db, 'internal_project_id' => $id)), $session);
        $expected = array("error" => OrganismsOfProject::ERROR_PROJECT_NOT_FOUND);
        $this->assertEquals($expected, $results, 'Project does not belong to user, return error message');

    }
}