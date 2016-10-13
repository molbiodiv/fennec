<?php

namespace Test\AppBundle\API\Details;

class TraitEntriesTest extends \PHPUnit_Framework_TestCase
{

    public function testExecute()
    {
        $client = static::createClient();
        $default_db = $client->getContainer()->getParameter('default_db');
        $session = null;
        $service = $client->getContainer()->get('app.api.webservice')->factory('details', 'organism');
        //Test for error on unknown trait_format
        $parameterBag = new ParameterBag(array('dbversion' => $default_db, 'trait_entry_ids' => [1], 'trait_format' => 'non_existing_format'));
        $results = $service->execute($parameterBag);
        $expected = [
            'error' => TraitEntries::ERROR_UNKNOWN_TRAIT_FORMAT
        ];
        $this->assertEquals($expected, $results);

        //Test if the details for one trait entry with categorical value is returned correctly
        $parameterBag = new ParameterBag(array('dbversion' => $default_db, 'trait_entry_ids' => ['49484'], 'trait_format' => 'categorical_free'));
        $results = $service->execute($parameterBag);
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
        $results = $service->execute($parameterBag);
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
        $results = $service->execute($parameterBag);
        $expected = array('49484' => $expected1['49484'], '49533' => $expected2['49533']);
        $this->assertEquals($expected, $results);
    }
}
