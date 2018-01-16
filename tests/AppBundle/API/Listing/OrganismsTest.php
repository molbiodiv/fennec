<?php

namespace Tests\AppBundle\API\Listing;

use Tests\AppBundle\API\WebserviceTestCase;
use AppBundle\Entity\Organism;

class OrganismsTest extends WebserviceTestCase
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
        $organisms = $this->webservice->factory('listing', 'organisms');
        $parameterBag = new ParameterBag(array('dbversion' => $this->default_db, 'search' => 'bla', 'limit' => 5));
        $results = $organisms->execute($parameterBag, null);
        $expected = array(
            array("fennec_id" => 2243, "scientific_name" => "Anemone blanda"),
            array("fennec_id" => 3520, "scientific_name" => "Lablab purpureus"),
            array("fennec_id" => 4295, "scientific_name" => "Tmesipteris oblanceolata"),
            array("fennec_id" => 4357, "scientific_name" => "Silene oblanceolata"),
            array("fennec_id" => 5588, "scientific_name" => "Verbascum blattaria")
        );
        $this->assertEquals($expected, $results);
    }
}