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
                     "liana" => "66",
                     "nonvascular" => "819",
                     "forb/herb" => "9191",
                     "suffrutescent" => "58",
                     "procumbent" => "34",
                     "trailing" => "42",
                     "decumbent" => "44",
                     "epiphyte" => "53",
                     "tree" => "2456",
                     "twining" => "20",
                     "climbing plant" => "206",
                     "arborescent" => "3",
                     "graminoid" => "1902",
                     "shrub" => "3527",
                     "large shrub" => "38",
                     "geophyte" => "41",
                     "vine" => "1056",
                     "subshrub" => "1916",
                     "woody" => "60",

                ],
                "trait_type_id" => 1,
                "name" => "Plant Habit",
                "ontology_url" => "http://eol.org/schema/terms/PlantHabit",
                "trait_format" => "categorical_free",
                "number_of_organisms" => 16417
            ];
        $results['values'] = array_map('count', $results['values']);
        $this->assertEquals($expected, $results);

        $results = $service->execute(
            new ParameterBag(array('dbversion' => $default_db, 'trait_type_id' => 2, 'fennec_ids' => [46032, 6661, 25517, 2888, 109884])),
            null
        );
        $expected = [
                "values" => [
                     "annual" => [2888, 109884],
                     "perennial" => [46032, 6661, 25517]
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
