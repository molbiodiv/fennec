<?php

namespace Tests\AppBundle\API\Details;

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
        $organismId = 42;
        $results = $this->em->getRepository(Entity\Data\Organism::class)->getDetailsOforganism($organismId);
        $expected = array(
            "fennec_id" => 42,
            "scientific_name" => "Trebouxiophyceae sp. TP-2016a",
            "eol_identifier" => "909148",
            "ncbi_identifier" => "3083"
        );
        $this->assertEquals($expected, $results);
    }
}