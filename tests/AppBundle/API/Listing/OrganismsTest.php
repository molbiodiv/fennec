<?php

namespace Tests\AppBundle\API\Listing;

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
        $organisms = $client->getContainer()->get('app.api.webservice')->factory('listing', 'organisms');
        $parameterBag = new ParameterBag(array('dbversion' => $default_db, 'search' => 'bla', 'limit' => 5));
        $results = $organisms->execute($parameterBag, $session);
        $expected = array(
            array("organism_id" => 48, "scientific_name" => "Prototheca blaschkeae", "rank" => "species", "common_name" => null),
            array("organism_id" => 338, "scientific_name" => "Groenbladia", "rank" => "genus", "common_name" => null),
            array("organism_id" => 445, "scientific_name" => "Leucaena pueblana", "rank" => "species", "common_name" => null),
            array("organism_id" => 756, "scientific_name" => "Clusia blattophila", "rank" => "species", "common_name" => null),
            array("organism_id" => 1774, "scientific_name" => "Gloeospermum blakeanum", "rank" => "species", "common_name" => null)
        );
        $this->assertEquals($expected, $results);
    }
}