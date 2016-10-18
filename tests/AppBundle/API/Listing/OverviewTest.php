<?php

namespace Tests\AppBundle\API\Listing;

use AppBundle\AppBundle;
use AppBundle\DB;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\MockArraySessionStorage;

class OverviewTest extends WebTestCase
{
    const NICKNAME = 'listingOverviewTestUser';
    const USERID = 'listingOverviewTestUser';
    const PROVIDER = 'listingOverviewTestUser';

    public function testExecute()
    {
        $client = static::createClient();
        //Test for overview if user is not logged in
        $default_db = $client->getContainer()->getParameter('default_db');
        $session = new Session(new MockArraySessionStorage());
        $overview = $client->getContainer()->get('app.api.webservice')->factory('listing', 'overview');
        $parameterBag = new ParameterBag(array('dbversion' => $default_db));
        $results = $overview->execute($parameterBag, $session);
        $expected = array(
            "projects" => 0,
            "organisms" => 173716,
            "trait_entries" => 48916,
            "trait_types" => 1
        );
        $this->assertEquals($expected, $results);

        //Test of correct project if the user has only one project
        $session->set('user', array(
            'nickname' => OverviewTest::NICKNAME,
            'id' => OverviewTest::USERID,
            'provider' => OverviewTest::PROVIDER,
            'token' => 'listingOverviewTestUserToken'
        ));
        $results = $overview->execute($parameterBag, $session);
        $expected['projects'] = 1;
        $this->assertEquals($expected, $results);
    }
}