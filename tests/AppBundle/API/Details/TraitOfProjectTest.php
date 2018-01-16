<?php

namespace Test\AppBundle\API\Details;

use AppBundle\API\Details;
use Symfony\Component\HttpFoundation\ParameterBag;
use Tests\AppBundle\API\WebserviceTestCase;

class TraitOfProjectTest extends WebserviceTestCase
{
    const NICKNAME = 'detailsTraitOfProjectTestUser';
    const USERID = 'detailsTraitOfProjectTestUser';
    const PROVIDER = 'detailsTraitOfProjectTestUser';

    private $em;
    private $traitOfProject;

    public function setUp()
    {
        $kernel = self::bootKernel();

        $this->em = $kernel->getContainer()
            ->get('doctrine')
            ->getManager('test');

        $this->traitOfProject = $kernel->getContainer()->get(Details\TraitOfProject::class);
    }

    public function tearDown()
    {
        parent::tearDown();

        $this->em->close();
        $this->em = null; // avoid memory leaks
    }

    public function testUserNotLoggedIn()
    {
        $traitTypeId = 1;
        $projectId = 3;
        $user = null;
        $dimension = null;
        $dbversion = $this->default_db;
        $results = $this->traitOfProject->execute($traitTypeId, $projectId, $dimension, $user, $dbversion);
        $expected = array("error" => 'Error: User not logged in.');
        $this->assertEquals($expected, $results, 'User is not loggend in, return error message');
    }

    public function testOneTraitOfProject()
    {
        $traitTypeId = 2;
        $dimension = 'rows';
        $dbversion = $this->default_db;
        $user = $this->em->getRepository('AppBundle:FennecUser')->findOneBy(array(
            'username' => TraitOfProjectTest::NICKNAME
        ));
        $projectId = $this->em->getRepository('AppBundle:WebuserData')->findOneBy(array(
            'webuser' => $user
        ))->getWebuserDataId();

        $results = $this->traitOfProject->execute($traitTypeId, $projectId, $dimension, $user, $dbversion);
        $expected = [
            "values" => [
                "perennial" => ["1630"],
                "annual" => ["1340"]
            ],
            "traitTypeId" => 2,
            "type" => "Plant Life Cycle Habit",
            "ontologyUrl" => "http://purl.obolibrary.org/obo/TO_0002725",
            "format" => "categorical_free",
            "trait_format_id" => 1,
            "numberOfOrganisms" => 2,
            "description" => "Determined for type of life cycle being annual, biannual, perennial etc. [database_cross_reference: GR:pj]",
            "unit" => null
        ];
        $this->assertEquals($results, $expected, 'Example project, return trait details for rows');
    }

    public function testGetAnotherTraitOfProject(){
        $traitTypeId = 4;
        $dimension = 'columns';
        $dbversion = $this->default_db;
        $user = $this->em->getRepository('AppBundle:FennecUser')->findOneBy(array(
            'username' => TraitOfProjectTest::NICKNAME
        ));
        $projectId = $this->em->getRepository('AppBundle:WebuserData')->findOneBy(array(
            'webuser' => $user
        ))->getWebuserDataId();
        $results = $this->traitOfProject->execute($traitTypeId, $projectId, $dimension, $user, $dbversion);
        $expected = [
            "values" => [
                "yellow" => ["1340", "1630"]
            ],
            "traitTypeId" => 4,
            "type" => "Flower Color",
            "ontologyUrl" => "http://purl.obolibrary.org/obo/TO_0000537",
            "format" => "categorical_free",
            "trait_format_id" => 1,
            "numberOfOrganisms" => 2,
            "description" => "A flower morphology trait (TO:0000499) which is the color of the flower (PO:0009046)",
            "unit" => null
        ];
        $this->assertEquals($results, $expected, 'Example project, return trait details for columns');
    }

    public function testNoValidUserForProject(){
        $traitTypeId = 1;
        $noValidProjectId = 20;
        $dimension = "row";
        $dbversion = $this->default_db;
        $user = $this->em->getRepository('AppBundle:FennecUser')->findOneBy(array(
            'username' => TraitOfProjectTest::NICKNAME
        ));
        $results = $this->traitOfProject->execute($traitTypeId, $noValidProjectId, $dimension, $user, $dbversion);
        $expected = array("error" => Details\OrganismsOfProject::ERROR_PROJECT_NOT_FOUND);
        $this->assertEquals($expected, $results, 'Project does not belong to user, return error message');

    }
}
