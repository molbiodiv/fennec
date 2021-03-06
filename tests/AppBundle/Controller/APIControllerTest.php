<?php

namespace Tests\AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class APIControllerTest extends WebTestCase
{
    private $client;

    public function __construct($name = null, array $data = [], $dataName = '')
    {
        parent::__construct($name, $data, $dataName);
        $this->client = static::createClient();
    }

    public function testListingOrganisms()
    {
        $this->client->request('GET', '/test_data/api/listing/organisms', array(
            'limit' => 5
        ));
        $response = $this->client->getResponse();
        $this->assertEquals(200, $response->getStatusCode());
        $responseData = json_decode($response->getContent(), true);
        $this->assertEquals(5, count($responseData), 'the correct number of organisms are returned');
        $this->assertArrayHasKey('fennecId', $responseData[1], 'the second organism has a fennec_id');
        $this->assertArrayHasKey('scientificName', $responseData[3], 'the fourth organism has a scientific_name');
    }

    public function testListingOrganismsAlternativeDB()
    {
        $this->client->request('GET', '/test_data2/api/listing/organisms', array(
            'limit' => 5,
            'search' => 'rainbow'
        ));
        $response = $this->client->getResponse();
        $this->assertEquals(200, $response->getStatusCode());
        $responseData = json_decode($response->getContent(), true);
        $this->assertEquals(5, count($responseData), 'the correct number of organisms are returned');
        $this->assertArrayHasKey('fennecId', $responseData[1], 'the second organism has a fennec_id');
        $this->assertArrayHasKey('scientificName', $responseData[3], 'the fourth organism has a scientific_name');
    }

    public function testMappingByDbxrefId()
    {
        $this->client->request('POST', '/test_data/api/mapping/byDbxrefId', array(
            'ids' => array(1174942, 471708, 1097649, 1331079, -99, 'non_existing'),
            'db' => 'ncbi_taxonomy'
        ));

        $response = $this->client->getResponse();
        $this->assertEquals(200, $response->getStatusCode());
        $responseData = json_decode($response->getContent(), true);
        $this->assertEquals(6, count($responseData), 'the correct number of mappings is returned');
        $this->assertArrayHasKey('1174942', $responseData, 'there is a mapping for the first id');
        $this->assertEquals($responseData[471708], 88648, 'the mapping for the second id is correct');

    }

    public function testMappingByEOLId(){
        $this->client->request('POST', '/test_data/api/mapping/byDbxrefId', array(
            'ids' => array(1116106, 38161, 2872684, 39873511),
            'db' => 'EOL'
        ));
        $expected = [
            1116106 => 99273,
            38161 => 23857,
            2872684 => 121992,
            39873511 => 16033
        ];
        $response = $this->client->getResponse();
        $responseData = json_decode($response->getContent(), true);
        $this->assertEquals($expected, $responseData);
    }
}
