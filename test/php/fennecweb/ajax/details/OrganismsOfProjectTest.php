<?php

namespace fennecweb\ajax\details;

use \fennecweb\WebService as WebService;

class OrganismsOfProjectTest extends \PHPUnit_Framework_TestCase
{
    const NICKNAME = 'detailsOrganismsOfProjectTestUser';
    const USERID = 'detailsOrganismsOfProjectTestUser';
    const PROVIDER = 'detailsOrganismsOfProjectTestUser';

    public function testExecute()
    {
        list($service) = WebService::factory('details/OrganismsOfProject');
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION)));
        $expected = array("error" => WebService::ERROR_NOT_LOGGED_IN);
        $this->assertEquals($expected, $results, 'User is not loggend in, return error message');

        $_SESSION['user'] = array(
            'nickname' => OrganismsOfProjectTest::NICKNAME,
            'id' => OrganismsOfProjectTest::USERID,
            'provider' => OrganismsOfProjectTest::PROVIDER,
            'token' => 'detailsOrganismsOfProjectTestToken'
        );

        list($service) = WebService::factory('listing/Projects');
        $entries = ($service->execute(array('dbversion' => DEFAULT_DBVERSION)));
        $id = $entries['data'][0]['internal_project_id'];

        list($service) = WebService::factory('details/OrganismsOfProject');
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION, 'internal_project_id' => $id)));
        $expected = array(
            3, 42
        );
        $this->assertEquals($expected, $results, 'Example project, return uniq organism ids');

        $_SESSION['user']['id'] = 'noValidUserID';
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION, 'internal_project_id' => $id)));
        $expected = array("error" => OrganismsOfProject::ERROR_PROJECT_NOT_FOUND);
        $this->assertEquals($expected, $results, 'Project does not belong to user, return error message');

    }
}