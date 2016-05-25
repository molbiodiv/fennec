<?php

namespace fennecweb\ajax\details;

class ProjectsTest extends \PHPUnit_Framework_TestCase
{
    const NICKNAME = 'detailsProjectsTestUser';
    const USERID = 'detailsProjectsTestUser';
    const PROVIDER = 'detailsProjectsTestUser';

    public function testExecute()
    {
        //Test if the selected project contains the correct information
        $_SESSION['user'] = array(
            'nickname' => ProjectsTest::NICKNAME,
            'id' => ProjectsTest::USERID,
            'provider' => ProjectsTest::PROVIDER,
            'token' => 'detailsProjectTestUserToken'
        );
        list($service) = WebService::factory('details/Project');
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION)));
        $expected = array(
                      'table_1' 
        );
        $this->assertArraySubset($expected, $results);
    }
}


