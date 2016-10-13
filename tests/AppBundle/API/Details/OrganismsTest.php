<?php

namespace Tests\AppBundle\API\Details;

use AppBundle\AppBundle;
use AppBundle\DB;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\MockArraySessionStorage;

class OrganismsTest extends WebTestCase
{

    public function testExecute()
    {
        $client = static::createClient();
        $default_db = $client->getContainer()->getParameter('default_db');
        $session = null;
        $organisms = $client->getContainer()->get('app.api.webservice')->factory('details', 'organisms');
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