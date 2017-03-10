<?php

namespace Tests\AppBundle\API\Listing;

use AppBundle\API\Webservice;
use AppBundle\User\FennecUser;
use Symfony\Component\HttpFoundation\ParameterBag;
use Tests\AppBundle\API\WebserviceTestCase;

class ProjectsTest extends WebserviceTestCase
{
    const NICKNAME = 'listingProjectsTestUser';
    const USERID = 'listingProjectsTestUser';
    const PROVIDER = 'listingProjectsTestUser';

    public function testExecute()
    {
        $default_db = $this->default_db;
        $service = $this->webservice->factory('listing', 'projects');

        //Test for error returned by user is not logged in
        $results = $service->execute(
            new ParameterBag(array('dbversion' => $default_db)),
            $this->user
        );
        $expected = array("error" => Webservice::ERROR_NOT_LOGGED_IN, "data" => array());
        
        $this->assertEquals($expected, $results);
        
        //Test of correct project if the user has only one project
        $this->user = new FennecUser(ProjectsTest::USERID,ProjectsTest::NICKNAME,ProjectsTest::PROVIDER);
        $results = $service->execute(
            new ParameterBag(array('dbversion' => $default_db)),
            $this->user
        );
        $expected = array("data" => array(
                array(
                    "id" => "table_1",
                    "rows" => 10,
                    "columns" => 5,
                    "import_filename" => "listingProjectsTestFile.biom"
                )
            )
        );
        $this->assertArraySubset($expected, $results);
    }
}
