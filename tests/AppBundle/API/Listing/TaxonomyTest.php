<?php

namespace Tests\AppBundle\API\Listing;

use Symfony\Component\HttpFoundation\ParameterBag;
use Tests\AppBundle\API\WebserviceTestCase;

class TaxonomyTest extends WebserviceTestCase
{

    public function testExecute()
    {
        $default_db = $this->default_db;
        $session = null;
        $organisms = $this->webservice->factory('listing', 'taxonomy');
        $parameterBag = new ParameterBag(array('dbversion' => $default_db, 'id' => '1234'));
        $results = $organisms->execute($parameterBag, $session);
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
                "Ceratophyllum",
                "Ceratophyllum demersum"
            )
        );
        $parameterBag = new ParameterBag(array('dbversion' => $default_db, 'id' => '3720'));
        $results = $organisms->execute($parameterBag, $session);
        $expected = array(
            "ncbi_taxonomy" => array(
                "Viridiplantae",
                "Streptophyta",
                "Streptophytina",
                "Embryophyta",
                "Marchantiophyta",
                "Marchantiopsida",
                "Marchantiidae",
                "Sphaerocarpales"
            ),
            "iucn_redlist" => array(
                "Plantae",
                "Marchantiophyta",
                "Marchantiopsida",
                "Sphaerocarpales"
            )
        );
        $this->assertEquals($expected, $results);
    }
}