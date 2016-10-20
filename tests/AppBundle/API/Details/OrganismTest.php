<?php

namespace Tests\AppBundle\API\Details;

use Symfony\Component\HttpFoundation\ParameterBag;
use Tests\AppBundle\API\WebserviceTestCase;

class OrganismTest extends WebserviceTestCase
{

    public function testExecute()
    {
        $default_db = $this->default_db;
        $session = null;
        $organisms = $this->webservice->factory('details', 'organism');
        $parameterBag = new ParameterBag(array('dbversion' => $default_db, 'id' => 42));
        $results = $organisms->execute($parameterBag, $session);
        $expected = array(
            "organism_id" => 42,
            "scientific_name" => "Artocarpus pithecogallus",
            "rank" => "species",
            "common_name" => null,
            "eol_accession" => "",
            "ncbi_accession" => "1679377"
        );
        $this->assertEquals($expected, $results);
    }
}