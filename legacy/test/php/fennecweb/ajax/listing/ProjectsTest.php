<?php

namespace fennecweb\ajax\listing;

use \fennecweb\WebService as WebService;

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
        $expected = array("error" => WebService::ERROR_NOT_LOGGED_IN, "data" => array());
        
        $this->assertEquals($expected, $results);
        
        //Test of correct project if the user has only one project
        $_SESSION['user'] = array(
            'nickname' => ProjectsTest::NICKNAME,
            'id' => ProjectsTest::USERID,
            'provider' => ProjectsTest::PROVIDER,
            'token' => 'listingProjectsTestUserToken'
        );
        list($service) = WebService::factory('listing/Projects');
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION)));
        $expected = array("data" => array(
                array(
                    "id" => "table_1",
                    "import_date" => "2016-05-17 10:00:52.627236+00",
                    "rows" => 10,
                    "columns" => 5,
                    "import_filename" => "listingProjectsTestFile.biom"
                )
            )
        );
        $this->assertArraySubset($expected, $results);
    }
}
