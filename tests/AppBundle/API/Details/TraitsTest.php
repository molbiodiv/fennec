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
                     "forb/herb" => "15086",
                     "suffrutescent" => "90",
                     "procumbent" => "50",
                     "trailing" => "53",
                     "decumbent" => "50",
                     "epiphyte" => "118",
                     "tree" => "11170",
                     "twining" => "23",
                     "climbing plant" => "415",
                     "arborescent" => "3",
                     "graminoid" => "2645",
                     "shrub" => "10002",
                     "large shrub" => "38",
                     "geophyte" => "41",
                     "vine" => "5560",
                     "subshrub" => "2440",
                     "woody" => "90",

                ],
                "trait_type_id" => 1,
                "name" => "Plant Habit",
                "ontology_url" => "http://eol.org/schema/terms/PlantHabit",
                "trait_format" => "categorical_free",
                "number_of_organisms" => 16417
            ];
        $this->assertEquals($expected, $results);

        $results = $service->execute(
            new ParameterBag(array('dbversion' => $default_db, 'trait_type_id' => 2, 'fennec_ids' => [46032, 6661, 25517, 2888, 109884])),
            null
        );
        $expected = [
                "values" => [
                     "annual" => "3",
                     "perennial" => "3"
                ],
                "trait_type_id" => 2,
                "name" => "Plant Life Cycle Habit",
                "ontology_url" => "http://purl.obolibrary.org/obo/TO_0002725",
                "trait_format" => "categorical_free",
                "number_of_organisms" => 5
            ];
        $this->assertEquals($expected, $results, 'Organism ids provided, should return trait details for only those organisms');

        $results = $service->execute(
            new ParameterBag(array('dbversion' => $default_db, 'trait_type_id' => $trait_type_id, 'fennec_ids' => [])),
            null
        );
        $expected = [
            "values" => [],
            "trait_type_id" => 1,
            "name" => "Plant Habit",
            "ontology_url" => "http://eol.org/schema/terms/PlantHabit",
            "trait_format" => "categorical_free",
            "number_of_organisms" => 0
        ];
        $this->assertEquals($expected, $results, 'Array of organism ids is empty, should return empty values array and 0 as number_of_organisms');
    }
}
