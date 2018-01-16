<?php

namespace Tests\AppBundle\API\Listing;

use Symfony\Component\HttpFoundation\ParameterBag;
use Tests\AppBundle\API\WebserviceTestCase;
use AppBundle\API\Listing;

class TaxonomyTest extends WebserviceTestCase
{
    private $em;
    private $listingTaxonomy;

    public function setUp()
    {
        $kernel = self::bootKernel();

        $this->em = $kernel->getContainer()
            ->get('doctrine')
            ->getManager('test');
        $this->listingTaxonomy = $kernel->getContainer()->get(Listing\Taxonomy::class);

    }

    public function tearDown()
    {
        parent::tearDown();

        $this->em->close();
        $this->em = null; // avoid memory leaks
    }

    public function testNCBITaxonomy()
    {
        $fennecId = '1234';
        $results = $this->listingTaxonomy->execute($fennecId);
        $expected = array(
            "ncbi_taxonomy" => array(
                "Viridiplantae",
                "Streptophyta",
                "Streptophytina",
                "Embryophyta",
                "Tracheophyta",
                "Euphyllophyta",
                "Spermatophyta",
                "Magnoliophyta",
                "Mesangiospermae",
                "Ceratophyllales",
                "Ceratophyllaceae",
                "Ceratophyllum"
            ),
            "iucn_redlist" => array(
                "Plantae",
                "Tracheophyta",
                "Magnoliidae",
                "Nymphaeales",
                "Ceratophyllaceae",
                "Ceratophyllum"
            )
        );
        $this->assertEquals($expected, $results);
    }

    public function testNCBIAndEOLTaxonomay(){
        $fennecId = '3720';
        $results = $this->listingTaxonomy->execute($fennecId);
        $expected = array(
            "ncbi_taxonomy" => array(
                "Viridiplantae",
                "Streptophyta",
                "Streptophytina",
                "Embryophyta",
                "Marchantiophyta",
                "Marchantiopsida",
                "Marchantiidae"
            ),
            "iucn_redlist" => array(
                "Plantae",
                "Marchantiophyta",
                "Marchantiopsida"
            )
        );
        $this->assertEquals($expected, $results);
    }
}