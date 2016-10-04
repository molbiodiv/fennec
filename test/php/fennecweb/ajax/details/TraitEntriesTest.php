<?php

namespace fennecweb\ajax\details;

use \fennecweb\WebService as WebService;

class TraitEntriesTest extends \PHPUnit_Framework_TestCase
{

    public function testExecute()
    {
        //Test if the details for one trait entry with categorical value is returned correctly
        list($service) = WebService::factory('details/TraitEntries');
        $trait_entry_ids = ['49484'];
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION, 'trait_entry_ids' => $trait_entry_ids, 'format' => 'categorical_free')));
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
        list($service) = WebService::factory('details/TraitEntries');
        $trait_entry_ids = ['49533'];
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION, 'trait_entry_ids' => $trait_entry_ids)));
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
        list($service) = WebService::factory('details/TraitEntries');
        $trait_entry_ids = ['1', '2'];
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION, 'trait_entry_ids' => $trait_entry_ids)));
        $expected = array('1' => $expected1['1'], '2' => $expected2['2']);
        $this->assertEquals($expected, $results);
    }
}
