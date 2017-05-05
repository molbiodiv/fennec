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
                "number_of_organisms" => 16417,
                "description" => "general growth form, including size and branching. Some organisms have different growth habits depending on environment or location",
                "unit" => null
            ];
        $results['values'] = array_map('count', $results['values']);
        $this->assertEquals($expected, $results);

        # Test with type that has deleted traits
        $iucn_trait_type = 3;
        $results = $service->execute(
            new ParameterBag(array('dbversion' => $default_db, 'trait_type_id' => $iucn_trait_type)),
            null
        );
        $expected = [
            "values" => [
                "LR/cd" => "221",
                "EW" => "36",
                "LR/lc" => "656",
                "LR/nt" => "666",
                "EN" => "3862",
                "DD" => "1749",
                "NT" => "1083",
                "EX" => "125",
                "CR" => "2643",
                "LC" => "6246",
                "VU" => "5898",
            ],
            "trait_type_id" => 3,
            "name" => "IUCN Threat Status",
            "ontology_url" => "",
            "trait_format" => "categorical_free",
            "number_of_organisms" => 23185,
            "description" => "",
            "unit" => null
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
                "number_of_organisms" => 5,
                "description" => "Determined for type of life cycle being annual, biannual, perennial etc. [database_cross_reference: GR:pj]",
                "unit" => null
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
            "number_of_organisms" => 0,
            "description" => "general growth form, including size and branching. Some organisms have different growth habits depending on environment or location",
            "unit" => null
        ];
        $this->assertEquals($expected, $results, 'Array of organism ids is empty, should return empty values array and 0 as number_of_organisms');

        $leaf_size = '7';
        $results = $service->execute(
            new ParameterBag(array('dbversion' => $default_db, 'trait_type_id' => $leaf_size, 'fennec_ids' => [5514,10979,878,879,1])),
            null
        );
        $expected = [
            "values" => [
                '1' => [],
                '5514' => [41.2500000000],
                '10979' => [5570.0000000000, 3913.0000000000],
                '878' => [8756.5000000000, 6824.8000000000, 0.0000000000],
                '879' => [7967.2000000000, 5435.1000000000, 11726.4000000000, 8332.0000000000]
            ],
            "trait_type_id" => 7,
            "name" => "Leaf size",
            "ontology_url" => null,
            "trait_format" => "numerical",
            "number_of_organisms" => 4,
            "description" => "Leaf size is the one-sided projected surface area of an individual leaf or lamina expressed in mm^2",
            "unit" => "mm^2"
        ];
        $this->assertEquals($expected, $results, 'Array of organism ids is empty, should return empty values array and 0 as number_of_organisms');
    }

    public function testWithCitations(){
        $default_db = $this->default_db;
        $service = $this->webservice->factory('details', 'traits');
        $results = $service->execute(
            new ParameterBag(array('dbversion' => $default_db, 'trait_type_id' =>  2, 'fennec_ids' => [46032, 6661, 25517, 2888, 109884], 'include_citations' => 'TRUE')),
            null
        );
        $expected = [
                "values" => [
                     "annual" => [2888, 109884],
                     "perennial" => [46032, 6661, 25517]
                ],
                "citations" => [
                    "2888" => [
                        ["citation" => "Paula S, Arianoutsou M, Kazanis D, Tavsanoglu Ç, Lloret F, Buhk C, Ojeda F, Luna B, Moreno JM, Rodrigo A, Espelta JM, Palacio S, Fernández-Santos B, Fernandes PM, and Pausas JG. 2009. Fire-related traits for plant species of the Mediterranean Basin. Ecology 90:1420. http://esapubs.org/archive/ecol/E090/094/default.htm", "value" => "annual"],
                        ["citation" => "The PLANTS Database, United States Department of Agriculture, National Resources Conservation Service. http://plants.usda.gov/", "value" => "annual"]
                    ],
                    "109884" => [
                        ["citation" => "The PLANTS Database, United States Department of Agriculture, National Resources Conservation Service. http://plants.usda.gov/", "value" => "annual"]
                    ],
                    "46032" => [
                        ["citation" => "The PLANTS Database, United States Department of Agriculture, National Resources Conservation Service. http://plants.usda.gov/", "value" => "perennial"]
                    ],
                    "6661" => [
                        ["citation" => "The PLANTS Database, United States Department of Agriculture, National Resources Conservation Service. http://plants.usda.gov/", "value" => "perennial"]
                    ],
                    "25517" => [
                        ["citation" => "The PLANTS Database, United States Department of Agriculture, National Resources Conservation Service. http://plants.usda.gov/", "value" => "perennial"]
                    ]
                ],
                "trait_type_id" => 2,
                "name" => "Plant Life Cycle Habit",
                "ontology_url" => "http://purl.obolibrary.org/obo/TO_0002725",
                "trait_format" => "categorical_free",
                "number_of_organisms" => 5,
                "description" => "Determined for type of life cycle being annual, biannual, perennial etc. [database_cross_reference: GR:pj]",
                "unit" => null
            ];
        $this->assertEquals($expected, $results, 'Organism ids provided, should return trait details for only those organisms, incl. citations');

        $leaf_size = '7';
        $results = $service->execute(
            new ParameterBag(array('dbversion' => $default_db, 'trait_type_id' => $leaf_size, 'fennec_ids' => [5514,10979,878,879,1], 'include_citations' => 'TRUE')),
            null
        );
        $expected = [
            "values" => [
                '1' => [],
                '5514' => [41.2500000000],
                '10979' => [5570.0000000000, 3913.0000000000],
                '878' => [8756.5000000000, 6824.8000000000, 0.0000000000],
                '879' => [7967.2000000000, 5435.1000000000, 11726.4000000000, 8332.0000000000]
            ],
            "citations" => [
                "5514" => [
                    ["citation" => "Source data from Carl von Ossietzky university of Oldenburg, Landscape Ecology Group, DE (Kunzmann), E-Mail: dkunzmann@gmx.de", "value" => "41.2500000000"]
                ],
                "10979" => [
                    ["citation" => "Source data from University of Sheffield, Dept. of Animal and Plant Sciences, UK (Thompson), E-Mail: ken.thompson@sheffield.ac.uk", "value" => "5570.0000000000"],
                    ["citation" => "Source data from University of Sheffield, Dept. of Animal and Plant Sciences, UK (Thompson), E-Mail: ken.thompson@sheffield.ac.uk", "value" => "3913.0000000000"]
                ],
                "878" => [
                    ["citation" => "Source data from University of Sheffield, Dept. of Animal and Plant Sciences, UK (Thompson), E-Mail: ken.thompson@sheffield.ac.uk", "value" => "8756.5000000000"],
                    ["citation" => "Source data from University of Sheffield, Dept. of Animal and Plant Sciences, UK (Thompson), E-Mail: ken.thompson@sheffield.ac.uk", "value" => "6824.8000000000"],
                    ["citation" => "Niinemets, Ülo(2003): Leaf structure vs. nutrient relationship vary with soil onditions in temperate shrubs and trees", "value" => "0.0000000000"]
                ],
                "879" => [
                    ["citation" => "Source data from University of Sheffield, Dept. of Animal and Plant Sciences, UK (Thompson), E-Mail: ken.thompson@sheffield.ac.uk", "value" => "7967.2000000000"],
                    ["citation" => "Source data from University of Sheffield, Dept. of Animal and Plant Sciences, UK (Thompson), E-Mail: ken.thompson@sheffield.ac.uk", "value" => "5435.1000000000"],
                    ["citation" => "Source data from University of Sheffield, Dept. of Animal and Plant Sciences, UK (Thompson), E-Mail: ken.thompson@sheffield.ac.uk", "value" => "11726.4000000000"],
                    ["citation" => "Source data from University of Sheffield, Dept. of Animal and Plant Sciences, UK (Thompson), E-Mail: ken.thompson@sheffield.ac.uk", "value" => "8332.0000000000"]
                ]
            ],
            "trait_type_id" => 7,
            "name" => "Leaf size",
            "ontology_url" => null,
            "trait_format" => "numerical",
            "number_of_organisms" => 4,
            "description" => "Leaf size is the one-sided projected surface area of an individual leaf or lamina expressed in mm^2",
            "unit" => "mm^2"
        ];
        $this->assertEquals($expected, $results, 'Array of organism ids is empty, should return empty values array and 0 as number_of_organisms');
    }

}
