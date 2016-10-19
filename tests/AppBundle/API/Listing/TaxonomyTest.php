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