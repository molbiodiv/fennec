<?php

namespace Tests\AppBundle\API\Listing;

use Symfony\Component\HttpFoundation\ParameterBag;
use Tests\AppBundle\API\WebserviceTestCase;

class OrganismsTest extends WebserviceTestCase
{
    public function testExecute()
    {
        $organisms = $this->webservice->factory('listing', 'organisms');
        $parameterBag = new ParameterBag(array('dbversion' => $this->default_db, 'search' => 'bla', 'limit' => 5));
        $results = $organisms->execute($parameterBag, null);
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