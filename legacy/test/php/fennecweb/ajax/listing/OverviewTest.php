<?php

namespace fennecweb\ajax\listing;

use \fennecweb\WebService as WebService;

class OverviewTest extends \PHPUnit_Framework_TestCase
{
    const NICKNAME = 'listingOverviewTestUser';
    const USERID = 'listingOverviewTestUser';
    const PROVIDER = 'listingOverviewTestUser';

    public function testExecute()
    {
        //Test for overview if user is not logged in
        list($service) = WebService::factory('listing/Overview');
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION)));
        $expected = array(
            "projects" => 0,
            "organisms" => 173716,
            "trait_entries" => 48916,
            "trait_types" => 1
        );
        $this->assertEquals($expected, $results);
        
        //Test of correct project if the user has only one project
        $_SESSION['user'] = array(
            'nickname' => OverviewTest::NICKNAME,
            'id' => OverviewTest::USERID,
            'provider' => OverviewTest::PROVIDER,
            'token' => 'listingOverviewTestUserToken'
        );
        list($service) = WebService::factory('listing/Overview');
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION)));
        $expected['projects'] = 1;
        $this->assertArraySubset($expected, $results);
    }
}
