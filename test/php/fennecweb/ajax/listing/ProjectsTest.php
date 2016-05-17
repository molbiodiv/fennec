<?php

namespace fennecweb;

class ProjectTest extends \PHPUnit_Framework_TestCase
{
    const NICKNAME = 'listingProjectsTestUser';
    const USERID = 'listingProjectsTestUser';
    const PROVIDER = 'listingProjectsTestUser';

    public function setUp()
    {
        $_SESSION['user'] = array(
            'nickname' => ProjectTest::NICKNAME,
            'id' => ProjectTest::USERID,
            'provider' => ProjectTest::PROVIDER,
            'token' => 'listingProjectsTestUserToken'
        );
    }

    public function testExecute()
    {
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

