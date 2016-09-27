<?php

namespace fennecweb\ajax\details;

use \fennecweb\WebService as WebService;

class TraitEntriesTest extends \PHPUnit_Framework_TestCase
{

    public function testExecute()
    {
        //Test if the details for one trait entry with categorical value is returned correctly
        list($service) = WebService::factory('details/TraitEntries');
        $trait_entry_ids = ['1'];
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION, 'trait_entry_ids' => $trait_entry_ids)));
        $expected1 = [
            '1' => [
                'organism_id' => 120941,
                'type' => 'geographic distribution',
                'type_definition' => 'http://rs.tdwg.org/ontology/voc/SPMInfoItems#Distribution',
                'value' => '',
                'value_definition' => 'Africa & Madagascar - South Africa',
                'metadata' => [
                    'source' => 'http://www.tropicos.org/Name/18402708?tab=distribution'
                ]
            ]
        ];
        $this->assertEquals($expected1, $results);

        //Test if the details for one trait entry with numerical value is returned correctly
        list($service) = WebService::factory('details/TraitEntries');
        $trait_entry_ids = ['2'];
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION, 'trait_entry_ids' => $trait_entry_ids)));
        $expected2 = [
            '2' => [
                'organism_id' => 9598,
                'type' => 'longitude',
                'type_definition' => 'http://rs.tdwg.org/dwc/terms/decimalLongitude',
                'value' => '-154.129',
                'value_definition' => 'numeric',
                'metadata' => [
                    'dwc:measurementUnit' => 'degrees',
                    'eolterms:statisticalMethod' => 'min'
                ]
            ]
        ];
        $this->assertEquals($expected2, $results);

        //Test if the details for two trait entries with numerical and categorical values are returned correctly
        list($service) = WebService::factory('details/TraitEntries');
        $trait_entry_ids = ['1', '2'];
        $results = ($service->execute(array('dbversion' => DEFAULT_DBVERSION, 'trait_entry_ids' => $trait_entry_ids)));
        $expected = array('1' => $expected1['1'], '2' => $expected2['2']);
        $this->assertEquals($expected, $results);
    }
}
