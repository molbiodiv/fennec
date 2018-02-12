<?php

namespace Tests\AppBundle\API\Listing;

use Tests\AppBundle\API\WebserviceTestCase;
use AppBundle\Entity\Data\Organism;

class OrganismsTest extends WebserviceTestCase
{
    private $em;

    public function setUp()
    {
        $kernel = self::bootKernel();

        $this->em = $kernel->getContainer()
            ->get('doctrine')
            ->getManager('test_data');

    }

    public function tearDown()
    {
        parent::tearDown();

        $this->em->close();
        $this->em = null; // avoid memory leaks
    }

    public function testExecute()
    {
        $search = '%bla%';
        $limit = 5;
        $results = $this->em->getRepository(Organism::class)->getListOfOrganisms($limit, $search);
        $expected = array(
            array("fennecId" => 2243, "scientificName" => "Anemone blanda"),
            array("fennecId" => 3520, "scientificName" => "Lablab purpureus"),
            array("fennecId" => 4295, "scientificName" => "Tmesipteris oblanceolata"),
            array("fennecId" => 4357, "scientificName" => "Silene oblanceolata"),
            array("fennecId" => 5588, "scientificName" => "Verbascum blattaria")
        );
        $this->assertEquals($expected, $results);
    }
}