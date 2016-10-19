<?php

namespace Tests\AppBundle\API\Listing;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\ParameterBag;

class TaxonomyTest extends WebTestCase
{

    public function testExecute()
    {
        $client = static::createClient();
        $default_db = $client->getContainer()->getParameter('default_db');
        $session = null;
        $organisms = $client->getContainer()->get('app.api.webservice')->factory('listing', 'taxonomy');
        $parameterBag = new ParameterBag(array('dbversion' => $default_db, 'id' => '1234'));
        $results = $organisms->execute($parameterBag, $session);
        $expected = array(
            "lineage" => array(
                "Viridiplantae",
                "Streptophyta",
                "Streptophytina",
                "Embryophyta",
                "Tracheophyta",
                "Euphyllophyta",
                "Spermatophyta",
                "Magnoliophyta",
                "Mesangiospermae",
                "eudicotyledons",
                "Gunneridae",
                "Pentapetalae",
                "rosids",
                "malvids",
                "Sapindales",
                "Aceraceae",
                "Acer",
                "Acer macrophyllum"
            )
        );
        $this->assertEquals($expected, $results);
    }
}