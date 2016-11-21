<?php

namespace Tests\AppBundle\API\Listing;

use Symfony\Component\HttpFoundation\ParameterBag;
use Tests\AppBundle\API\WebserviceTestCase;

class OverviewTest extends WebserviceTestCase
{
    const NICKNAME = 'listingOverviewTestUser';
    const USERID = 'listingOverviewTestUser';
    const PROVIDER = 'listingOverviewTestUser';

    public function testExecute()
    {
        //Test for overview if user is not logged in
        $default_db = $this->default_db;
        $session = $this->session;
        $overview = $this->webservice->factory('listing', 'overview');
        $parameterBag = new ParameterBag(array('dbversion' => $default_db));
        $results = $overview->execute($parameterBag, $session);
        $expected = array(
            "projects" => 0,
            "organisms" => 198102,
            "trait_entries" => 88855,
            "trait_types" => 3
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