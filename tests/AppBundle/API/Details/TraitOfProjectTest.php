<?php

namespace Test\AppBundle\API\Details;

use AppBundle\API\Details\OrganismsOfProject;
use AppBundle\API\Webservice;
use Symfony\Component\HttpFoundation\ParameterBag;
use Tests\AppBundle\API\WebserviceTestCase;

class TraitOfProjectTest extends WebserviceTestCase
{
    const NICKNAME = 'detailsTraitOfProjectTestUser';
    const USERID = 'detailsTraitOfProjectTestUser';
    const PROVIDER = 'detailsTraitOfProjectTestUser';

    public function testExecute()
    {
        $default_db = $this->default_db;
        $projectListing = $this->webservice->factory('listing', 'projects');
        $service = $this->webservice->factory('details', 'traitOfProject');
        $session = $this->session;
        $session->set('user',
            array(
                'nickname' => TraitOfProjectTest::NICKNAME,
                'id' => TraitOfProjectTest::USERID,
                'provider' => TraitOfProjectTest::PROVIDER,
                'token' => 'detailsTraitOfProjectTestToken'
            )
        );

        $results = $service->execute(new ParameterBag(array('dbversion' => $default_db, 'trait_type_id' => 1, 'internal_project_id' => 3)), null);
        $expected = array("error" => Webservice::ERROR_NOT_LOGGED_IN);
        $this->assertEquals($expected, $results, 'User is not loggend in, return error message');

        $entries = $projectListing->execute(new ParameterBag(array('dbversion' => $default_db)), $session);
        $id = $entries['data'][0]['internal_project_id'];

        $results = $service->execute(new ParameterBag(array('dbversion' => $default_db, 'trait_type_id' => 1, 'internal_project_id' => $id)), $session);
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

        $session->set('user', array('id' => 'noValidUserID', 'provider' => TraitOfProjectTest::PROVIDER));
        $results = $service->execute(new ParameterBag(array('dbversion' => $default_db, 'trait_type_id' => 1, 'internal_project_id' => $id)), $session);
        $expected = array("error" => OrganismsOfProject::ERROR_PROJECT_NOT_FOUND);
        $this->assertEquals($expected, $results, 'Project does not belong to user, return error message');

    }
}