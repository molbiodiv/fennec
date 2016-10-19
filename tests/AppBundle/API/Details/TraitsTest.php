<?php

namespace Test\AppBundle\API\Details;

use Symfony\Component\HttpFoundation\ParameterBag;
use Tests\AppBundle\API\WebserviceTestCase;

class TraitsTest extends WebserviceTestCase
{

    public function testExecute()
    {
        $default_db = $this->default_db;
        $service = $this->webservice->factory('details', 'traits');
        $trait_type_id = '1';
        $results = $service->execute(
            new ParameterBag(array('dbversion' => $default_db, 'trait_type_id' => $trait_type_id)),
            null
        );
        $expected = [
                "values" => [
                     "liana" => "136",
                     "nonvascular" => "832",
                     "forb/herb" => "15090",
                     "suffrutescent" => "90",
                     "procumbent" => "50",
                     "trailing" => "53",
                     "decumbent" => "50",
                     "epiphyte" => "118",
                     "tree" => "11199",
                     "twining" => "23",
                     "climbing plant" => "415",
                     "arborescent" => "3",
                     "graminoid" => "2648",
                     "shrub" => "10038",
                     "large shrub" => "38",
                     "geophyte" => "41",
                     "vine" => "5560",
                     "subshrub" => "2442",
                     "woody" => "90",

                ],
                "trait_type_id" => 1,
                "name" => "PlantHabit",
                "ontology_url" => "eol.org/schema/terms/PlantHabit",
                "trait_format" => "categorical_free",
                "number_of_organisms" => 16425
            ];
        $this->assertEquals($expected, $results);

        $results = $service->execute(
            new ParameterBag(array('dbversion' => $default_db, 'trait_type_id' => $trait_type_id, 'organism_ids' => [134097, 163840, 24718, 73023, 23057])),
            null
        );
        $expected = [
                "values" => [
                     "forb/herb" => "4",
                     "shrub" => "2",
                     "subshrub" => "2"
                ],
                "trait_type_id" => 1,
                "name" => "PlantHabit",
                "ontology_url" => "eol.org/schema/terms/PlantHabit",
                "trait_format" => "categorical_free",
                "number_of_organisms" => 5
            ];
        $this->assertEquals($expected, $results, 'Organism ids provided, should return trait details for only those organisms');

        $results = $service->execute(
            new ParameterBag(array('dbversion' => $default_db, 'trait_type_id' => $trait_type_id, 'organism_ids' => [])),
            null
        );
        $expected = [
            "values" => [],
            "trait_type_id" => 1,
            "name" => "PlantHabit",
            "ontology_url" => "eol.org/schema/terms/PlantHabit",
            "trait_format" => "categorical_free",
            "number_of_organisms" => 0
        ];
        $this->assertEquals($expected, $results, 'Array of organism ids is empty, should return empty values array and 0 as number_of_organisms');
    }
}
