<?php

namespace Tests\AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class StartpageControllerTest extends WebTestCase
{
    public function testIndex()
    {
        $client = static::createClient();

        $client->request('GET', '/');

        $this->assertTrue(
            $client->getResponse()->isRedirect('/test_data/startpage'),
            'response is a redirect to /test_data/startpage'
        );

        $crawler = $client->followRedirect();

        $this->assertEquals(200, $client->getResponse()->getStatusCode());
        $this->assertContains('Projects', $crawler->filter('#wrapper')->text());
        $this->assertContains('Organisms', $crawler->filter('#wrapper')->text());
        $this->assertContains('Traits', $crawler->filter('#wrapper')->text());
    }
}
