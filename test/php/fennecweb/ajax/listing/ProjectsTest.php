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
        list($service) = WebService::factory('listing/Projects');
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION)));
        $expected = array("error" => \fennecweb\ajax\listing\Projects::ERROR_NOT_LOGGED_IN);
        
        $this->assertEquals($expected, $results);
        
        //Test for correct project
        $_SESSION['user'] = array(
            'nickname' => ProjectsTest::NICKNAME,
            'id' => ProjectsTest::USERID,
            'provider' => ProjectsTest::PROVIDER,
            'token' => 'listingProjectsTestUserToken'
        );
        list($service) = WebService::factory('listing/Projects');
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION)));
        $expected = array(
            array(
                "id" => "This is a Table ID",
                "import_date" => "2016-05-17 10:00:52.627236+00",
                "rows" => 10,
                "columns" => 5
            )
        );
        $this->assertEquals($expected, $results);
    }
}
