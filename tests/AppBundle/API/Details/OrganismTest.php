<?php

namespace Tests\AppBundle\API\Details;

use Symfony\Component\HttpFoundation\ParameterBag;
use Tests\AppBundle\API\WebserviceTestCase;
use AppBundle\Entity;

class OrganismTest extends WebserviceTestCase
{
    private $em;

    public function setUp()
    {
        $kernel = self::bootKernel();

        $this->em = $kernel->getContainer()
            ->get('doctrine')
            ->getManager('test');

    }

    public function tearDown()
    {
        parent::tearDown();

        $this->em->close();
        $this->em = null; // avoid memory leaks
    }

    public function testExecute()
    {
        $default_db = $this->default_db;
        $user = null;
        $organisms = $this->webservice->factory('details', 'organism');
        $parameterBag = new ParameterBag(array('dbversion' => $default_db, 'id' => 42));
        $results = $organisms->execute($parameterBag, $user);
        $expected = array(
            "fennec_id" => 42,
            "scientific_name" => "Trebouxiophyceae sp. TP-2016a",
            "eol_identifier" => "909148",
            "ncbi_identifier" => "3083"
        );
        $this->assertEquals($expected, $results);
    }
}