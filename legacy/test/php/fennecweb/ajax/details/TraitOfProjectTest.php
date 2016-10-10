<?php

namespace fennecweb\ajax\details;

use \fennecweb\WebService as WebService;

class TraitOfProjectTest extends \PHPUnit_Framework_TestCase
{
    const NICKNAME = 'detailsTraitOfProjectTestUser';
    const USERID = 'detailsTraitOfProjectTestUser';
    const PROVIDER = 'detailsTraitOfProjectTestUser';

    public function testExecute()
    {
        list($service) = WebService::factory('details/TraitOfProject');
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION, 'trait_type_id' => 1, 'internal_project_id' => 3)));
        $expected = array("error" => WebService::ERROR_NOT_LOGGED_IN);
        $this->assertEquals($expected, $results, 'User is not loggend in, return error message');

        $_SESSION['user'] = array(
            'nickname' => TraitOfProjectTest::NICKNAME,
            'id' => TraitOfProjectTest::USERID,
            'provider' => TraitOfProjectTest::PROVIDER,
            'token' => 'detailsTraitOfProjectTestToken'
        );

        list($service) = WebService::factory('listing/Projects');
        $entries = ($service->execute(array('dbversion' => DEFAULT_DBVERSION)));
        $id = $entries['data'][0]['internal_project_id'];

        list($service) = WebService::factory('details/TraitOfProject');
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION, 'trait_type_id' => 1, 'internal_project_id' => $id)));
        $expected = [
            "values" => [
                "forb/herb" => "4",
                "shrub" => "2",
                "subshrub" => "2"
            ],
            "trait_type_id" => 1,
            "name" => "PlantHabit",
            "ontology_url" => "eol.org/schema/terms/PlantHabit",
            "trait_format" => "categorical_free",
            "number_of_organisms" => 5
        ];
        $this->assertEquals($results, $expected, 'Example project, return trait details');

        $_SESSION['user']['id'] = 'noValidUserID';
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION, 'trait_type_id' => 1, 'internal_project_id' => $id)));
        $expected = array("error" => OrganismsOfProject::ERROR_PROJECT_NOT_FOUND);
        $this->assertEquals($expected, $results, 'Project does not belong to user, return error message');

    }
}