<?php

namespace Test\AppBundle\API\Details;

use AppBundle\API\Details;
use Tests\AppBundle\API\WebserviceTestCase;

class TraitsTest extends WebserviceTestCase
{
    private $em;
    private $traitDetails;

    public function setUp()
    {
        $kernel = self::bootKernel();

        $this->em = $kernel->getContainer()
            ->get('doctrine')
            ->getManager('test_data');
        $this->traitDetails = $kernel->getContainer()->get(Details\Traits::class);

    }

    public function tearDown()
    {
        parent::tearDown();

        $this->em->close();
        $this->em = null; // avoid memory leaks
    }

    public function testTraitsWithNotDefinedFennecIds()
    {
        $traitTypeId = '1';
        $fennecIds = null;
        $includeCitations = false;
        $results = $this->traitDetails->execute($traitTypeId, $fennecIds, $includeCitations);
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
            "traitTypeId" => 1,
            "type" => "Plant Habit",
            "ontologyUrl" => "http://eol.org/schema/terms/PlantHabit",
            "format" => "categorical_free",
            "numberOfOrganisms" => 16417,
            "description" => "general growth form, including size and branching. Some organisms have different growth habits depending on environment or location",
            "unit" => null,
            "trait_format_id" => 1
        ];
        $results['values'] = array_map('count', $results['values']);
        $this->assertEquals($expected, $results);
    }

    public function testWithSimpleDeletedTraits()
    {
        $iucn_trait_type = 3;
        $fennecIds = null;
        $includeCitations = false;
        $results = $this->traitDetails->execute($iucn_trait_type, $fennecIds, $includeCitations);
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
            "traitTypeId" => 3,
            "type" => "IUCN Threat Status",
            "ontologyUrl" => "",
            "format" => "categorical_free",
            "numberOfOrganisms" => 23194,
            "description" => "",
            "unit" => null,
            "trait_format_id" => 1
        ];
        $results['values'] = array_map('count', $results['values']);
        $this->assertEquals($expected, $results);
    }

    public function testWithAdvancedDeletedTraits()
    {
        $traitTypeId = 2;
        $fennecIds = [46032, 6661, 25517, 2888, 109884];
        $includeCitations = false;
        $results = $this->traitDetails->execute($traitTypeId, $fennecIds, $includeCitations);
        $expected = [
            "values" => [
                "annual" => [2888, 109884],
                "perennial" => [46032, 6661, 25517]
            ],
            "traitTypeId" => 2,
            "type" => "Plant Life Cycle Habit",
            "ontologyUrl" => "http://purl.obolibrary.org/obo/TO_0002725",
            "format" => "categorical_free",
            "numberOfOrganisms" => 5,
            "description" => "Determined for type of life cycle being annual, biannual, perennial etc. [database_cross_reference: GR:pj]",
            "unit" => null,
            "trait_format_id" => 1
        ];
        $this->assertEquals($expected, $results, 'Organism ids provided, should return trait details for only those organisms');
    }

    public function testWithNoFennecIds()
    {
        $traitTypeId = 1;
        $fennecIds = [];
        $includeCitations = false;
        $results = $this->traitDetails->execute($traitTypeId, $fennecIds, $includeCitations);
        $expected = [
            "values" => [],
            "traitTypeId" => 1,
            "type" => "Plant Habit",
            "ontologyUrl" => "http://eol.org/schema/terms/PlantHabit",
            "format" => "categorical_free",
            "numberOfOrganisms" => 0,
            "description" => "general growth form, including size and branching. Some organisms have different growth habits depending on environment or location",
            "unit" => null,
            "trait_format_id" => 1
        ];
        $this->assertEquals($expected, $results, 'Array of organism ids is empty, should return empty values array and 0 as number_of_organisms');
    }

    public function testNumericalTraits(){
        $traitTypeId = '7';
        $fennecIds = [5514,10979,878,879,1];
        $includeCitations = false;
        $results = $this->traitDetails->execute($traitTypeId, $fennecIds, $includeCitations);
        $expected = [
            "values" => [
                '5514' => [41.2500000000],
                '10979' => [5570.0000000000, 3913.0000000000],
                '878' => [8756.5000000000, 6824.8000000000, 0.0000000000],
                '879' => [7967.2000000000, 5435.1000000000, 11726.4000000000, 8332.0000000000]
            ],
            "traitTypeId" => 7,
            "type" => "Leaf size",
            "ontologyUrl" => null,
            "format" => "numerical",
            "numberOfOrganisms" => 4,
            "description" => "Leaf size is the one-sided projected surface area of an individual leaf or lamina expressed in mm^2",
            "unit" => "mm^2",
            "trait_format_id" => 2
        ];
        $this->assertEquals($expected, $results, 'Array of organism ids is empty, should return empty values array and 0 as number_of_organisms');
    }

    public function testCategoricalTraitsWithCitations()
    {
        $traitTypeId = 2;
        $fennecIds = [46032, 6661, 25517, 2888, 109884];
        $includeCitations = true;
        $results = $this->traitDetails->execute($traitTypeId, $fennecIds, $includeCitations);
        $expected = [
            "values" => [
                "annual" => [2888, 109884],
                "perennial" => [46032, 6661, 25517]
            ],
            "citations" => [
                "2888" => [
                    ["citation" => "Paula S, Arianoutsou M, Kazanis D, Tavsanoglu Ç, Lloret F, Buhk C, Ojeda F, Luna B, Moreno JM, Rodrigo A, Espelta JM, Palacio S, Fernández-Santos B, Fernandes PM, and Pausas JG. 2009. Fire-related traits for plant species of the Mediterranean Basin. Ecology 90:1420. http://esapubs.org/archive/ecol/E090/094/default.htm", "value" => "annual"],
                    ["citation" => "The PLANTS Database, United States Department of Agriculture, National Resources Conservation Service. http://plants.usda.gov/", "value" => "annual"],
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
            "traitTypeId" => 2,
            "type" => "Plant Life Cycle Habit",
            "ontologyUrl" => "http://purl.obolibrary.org/obo/TO_0002725",
            "format" => "categorical_free",
            "numberOfOrganisms" => 5,
            "description" => "Determined for type of life cycle being annual, biannual, perennial etc. [database_cross_reference: GR:pj]",
            "unit" => null,
            "trait_format_id" => 1
        ];
        $this->assertEquals($expected, $results, 'Organism ids provided, should return trait details for only those organisms, incl. citations');
    }

    public function testNumericalTraitsWithCitations(){
        $traitTypeId = '7';
        $fennecIds = [5514,10979,878,879,1];
        $includeCitations = true;
        $results = $this->traitDetails->execute($traitTypeId, $fennecIds, $includeCitations);
        $expected = [
            "values" => [
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
            "traitTypeId" => 7,
            "type" => "Leaf size",
            "ontologyUrl" => null,
            "format" => "numerical",
            "numberOfOrganisms" => 4,
            "description" => "Leaf size is the one-sided projected surface area of an individual leaf or lamina expressed in mm^2",
            "unit" => "mm^2",
            "trait_format_id" => 2
        ];
        $this->assertEquals($expected, $results, 'Array of organism ids is empty, should return empty values array and 0 as number_of_organisms');
    }

}
