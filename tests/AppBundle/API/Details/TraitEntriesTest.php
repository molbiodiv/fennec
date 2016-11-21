<?php

namespace Test\AppBundle\API\Details;

use AppBundle\API\Details\TraitEntries;
use Symfony\Component\HttpFoundation\ParameterBag;
use Tests\AppBundle\API\WebserviceTestCase;

class TraitEntriesTest extends WebserviceTestCase
{

    public function testExecute()
    {
        $default_db = $this->default_db;
        $session = null;
        $service = $this->webservice->factory('details', 'traitEntries');
        //Test for error on unknown trait_format
        $parameterBag = new ParameterBag(array('dbversion' => $default_db, 'trait_entry_ids' => ['1'], 'trait_format' => 'non_existing_format'));
        $results = $service->execute($parameterBag, $session);
        $expected = [
            'error' => TraitEntries::ERROR_UNKNOWN_TRAIT_FORMAT
        ];
        $this->assertEquals($expected, $results);

        //Test if the details for one trait entry with categorical value is returned correctly
        $parameterBag = new ParameterBag(array('dbversion' => $default_db, 'trait_entry_ids' => ['47484'], 'trait_format' => 'categorical_free'));
        $results = $service->execute($parameterBag, $session);
        $expected1 = [
            '47484' => [
                'fennec_id' => 97935,
                'type' => 'Plant Habit',
                'type_definition' => 'http://eol.org/schema/terms/PlantHabit',
                'value' => 'vine',
                'value_definition' => 'http://eol.org/schema/terms/vine',
                'citation' => 'Smithsonian Institution, National Museum of Narutal History, Department of Botany. http://collections.mnh.si.edu/search/botany/'
            ]
        ];
        $this->assertEquals($expected1, $results);

        //Test if the details for another trait entry with categorical value is returned correctly
        $parameterBag = new ParameterBag(array('dbversion' => $default_db, 'trait_entry_ids' => ['35123'], 'trait_format' => 'categorical_free'));
        $results = $service->execute($parameterBag, $session);
        $expected2 = [
            '35123' => [
                'fennec_id' => 55850,
                'type' => 'Plant Habit',
                'type_definition' => 'http://eol.org/schema/terms/PlantHabit',
                'value' => 'subshrub',
                'value_definition' => 'http://eol.org/schema/terms/subshrub',
                'citation' => 'The PLANTS Database, United States Department of Agriculture, National Resources Conservation Service. http://plants.usda.gov/'
            ]
        ];
        $this->assertEquals($expected2, $results);

        //Test if the details for two trait entries are returned correctly
        $parameterBag = new ParameterBag(array('dbversion' => $default_db, 'trait_entry_ids' => ['47484', '35123'], 'trait_format' => 'categorical_free'));
        $results = $service->execute($parameterBag, $session);
        $expected = array('47484' => $expected1['47484'], '35123' => $expected2['35123']);
        $this->assertEquals($expected, $results);
    }
}
