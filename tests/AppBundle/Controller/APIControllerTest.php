<?php

namespace Tests\AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class APIControllerTest extends WebTestCase
{
    public function testListingOrganisms()
    {
        $client = static::createClient();

        $client->request('GET', '/api/listing/organisms', array(
            'dbversion' => 'test',
            'limit' => 5
        ));

        $response = $client->getResponse();

        // Assert that the "Content-Type" header is "application/json"
        $this->assertTrue(
            $response->headers->contains(
                'Content-Type',
                'application/json'
            ),
            'the "Content-Type" header is "application/json"' // optional message shown on failure
        );

        $this->assertEquals(200, $response->getStatusCode());
        $responseData = json_decode($response->getContent(), true);
        $this->assertEquals(5, count($responseData), 'the correct number of organisms are returned');
        $this->assertArrayHasKey('fennec_id', $responseData[1], 'the second organism has a fennec_id');
        $this->assertArrayHasKey('scientific_name', $responseData[3], 'the fourth organism has a scientific_name');
    }
}
