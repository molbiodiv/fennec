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
        $parameterBag = new ParameterBag(array('dbversion' => $default_db, 'trait_entry_ids' => ['49484'], 'trait_format' => 'categorical_free'));
        $results = $service->execute($parameterBag, $session);
        $expected1 = [
            '49484' => [
                'organism_id' => 101634,
                'type' => 'PlantHabit',
                'type_definition' => 'eol.org/schema/terms/PlantHabit',
                'value' => 'tree',
                'value_definition' => 'http://eol.org/schema/terms/tree',
                'citation' => 'Smithsonian Institution, National Museum of Narutal History, Department of Botany. Data for specimen 2449953. http://collections.mnh.si.edu/search/botany/'
            ]
        ];
        $this->assertEquals($expected1, $results);

        //Test if the details for another trait entry with categorical value is returned correctly
        $parameterBag = new ParameterBag(array('dbversion' => $default_db, 'trait_entry_ids' => ['49533'], 'trait_format' => 'categorical_free'));
        $results = $service->execute($parameterBag, $session);
        $expected2 = [
            '49533' => [
                'organism_id' => 159684,
                'type' => 'PlantHabit',
                'type_definition' => 'eol.org/schema/terms/PlantHabit',
                'value' => 'subshrub',
                'value_definition' => 'http://eol.org/schema/terms/subshrub',
                'citation' => 'Paula S, Arianoutsou M, Kazanis D, Tavsanoglu Ç, Lloret F, Buhk C, Ojeda F, Luna B, Moreno JM, Rodrigo A, Espelta JM, Palacio S, Fernández-Santos B, Fernandes PM, and Pausas JG. 2009. Fire-related traits for plant species of the Mediterranean Basin. Ecology 90:1420. http://esapubs.org/archive/ecol/E090/094/default.htm'
            ]
        ];
        $this->assertEquals($expected2, $results);

        //Test if the details for two trait entries are returned correctly
        $parameterBag = new ParameterBag(array('dbversion' => $default_db, 'trait_entry_ids' => ['49484', '49533'], 'trait_format' => 'categorical_free'));
        $results = $service->execute($parameterBag, $session);
        $expected = array('49484' => $expected1['49484'], '49533' => $expected2['49533']);
        $this->assertEquals($expected, $results);
    }
}
