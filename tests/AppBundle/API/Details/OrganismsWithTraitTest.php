<?php

namespace Test\AppBundle\API\Details;

use AppBundle\Entity;
use Tests\AppBundle\API\WebserviceTestCase;

class OrganismsWithTraitTest extends WebserviceTestCase
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

    public function testCategoricalTraitsWithDefaultLimit()
    {
        $traitTypeId = 1;
        $limit = 100;
        $results = $this->em->getRepository(Entity\Data\Organism::class)->getOrganismByTrait($traitTypeId, $limit);
        $this->assertEquals(100, count($results));
    }

    public function testCategoricalTraitsWithHighLimit()
    {
        $traitTypeId = 3;
        $limit = 30000;
        $results = $this->em->getRepository(Entity\Data\Organism::class)->getOrganismByTrait($traitTypeId, $limit);
        $this->assertEquals(23194, count($results));
    }

    public function testCategoricalTraitsWithLowLimit()
    {
        $traitTypeId = 1;
        $limit = 10;
        $results = $this->em->getRepository(Entity\Data\Organism::class)->getOrganismByTrait($traitTypeId, $limit);
        $this->assertEquals(10, count($results));
        $this->assertTrue(array_key_exists('fennecId', $results[0]));
        $this->assertTrue(array_key_exists('scientificName', $results[0]));
    }

    public function testNumericalTrait(){
        $traitTypeId = 7;
        $limit = 12;
        $results = $this->em->getRepository(Entity\Data\Organism::class)->getOrganismByTrait($traitTypeId, $limit);
        $this->assertEquals(12, count($results));
        $this->assertTrue(array_key_exists('fennecId',$results[0]));
        $this->assertTrue(array_key_exists('scientificName',$results[0]));
    }
}