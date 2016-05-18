<?php

namespace fennecweb;

class ProjectsTest extends \PHPUnit_Framework_TestCase
{
    const NICKNAME = 'listingProjectsTestUser';
    const USERID = 'listingProjectsTestUser';
    const PROVIDER = 'listingProjectsTestUser';

    public function testExecute()
    {
        //Test for error returned by user is not logged in
        $_SESSION['user'] = array();
        list($service) = WebService::factory('listing/Projects');
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION)));
        $expected = array("error" => \fennecweb\ajax\listing\Projects::ERROR_NOT_LOGGED_IN);
        
        $this->assertEquals($expected, $results);
        
        //Test for correct project
        $_SESSION['user'] = array(
            'nickname' => ProjectTest::NICKNAME,
            'id' => ProjectTest::USERID,
            'provider' => ProjectTest::PROVIDER,
            'token' => 'listingProjectsTestUserToken'
        );
        list($service) = WebService::factory('listing/Projects');
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION)));
        $expected = array(
            array(
                "This is a Table ID",
                "2016-05-17 10:00:52.627236+00",
                10,
                5
            )
        );
        $this->assertEquals($expected, $results);
    }
}
