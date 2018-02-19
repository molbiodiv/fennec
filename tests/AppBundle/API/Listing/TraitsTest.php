<?php

namespace Tests\AppBundle\API\Listing;

use Tests\AppBundle\API\WebserviceTestCase;
use AppBundle\API\Listing;

class TraitsTest extends WebserviceTestCase
{
    private $em;
    private $listingTraits;

    public function setUp()
    {
        $kernel = self::bootKernel();

        $this->em = $kernel->getContainer()
            ->get('doctrine')
            ->getManager('test');
        $this->listingTraits = $kernel->getContainer()->get(Listing\Traits::class);

    }

    public function tearDown()
    {
        parent::tearDown();

        $this->em->close();
        $this->em = null; // avoid memory leaks
    }

    public function testListAllTraits()
    {
        $search = "%%";
        $limit = null;
        $results = $this->listingTraits->execute($limit, $search);
        $expected = array(
            array(
                "type" => "Plant Habit",
                "traitTypeId" => 1,
                "frequency" => 48842
            ),
            array(
                "type" => "IUCN Threat Status",
                "traitTypeId" => 3,
                "frequency" => 46379
            ),
            array(
                "type" => "Plant Life Cycle Habit",
                "traitTypeId" => 2,
                "frequency" => 16819
            ),
            array(
                "type" => "Leaf mass",
                "traitTypeId" => 8,
                "frequency" => 7334
            ),
            array(
                "type" => "Leaf size",
                "traitTypeId" => 7,
                "frequency" => 6814
            ),
            array(
                "type" => "Flower Color",
                "traitTypeId" => 4,
                "frequency" => 2556
            ),
            array(
                "type" => "EPPO Lists",
                "traitTypeId" => 6,
                "frequency" => 92
            )
        );
        $this->assertEquals($expected, $results, 'Search without term and limit, result should be a list of all traits');
    }

    public function testTraitWhichDoesNotExist(){
        $search = "SomethingThatWillNeverBeATraitType";
        $limit = null;
        $results = $this->listingTraits->execute($limit, $search);
        $expected = array();
        $this->assertEquals($expected, $results, 'Search term does not hit, result should be an empty array');
    }
}
