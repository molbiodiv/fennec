<?php

namespace fennecweb\ajax\details;

use \fennecweb\WebService as WebService;

class TraitsTest extends \PHPUnit_Framework_TestCase
{

    public function testExecute()
    {
        list($service) = WebService::factory('details/Traits');
        $trait_type_id = '1';
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION, 'trait_type_id' => $trait_type_id)));
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
    }
}
