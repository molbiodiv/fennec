<?php

namespace Tests\AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class StartpageControllerTest extends WebTestCase
{
    public function testIndex()
    {
        $client = static::createClient();

        $crawler = $client->request('GET', '/');

        $this->assertTrue(
            $client->getResponse()->isRedirect('/test/startpage'),
            'response is a redirect to /test/startpage'
        );

        $crawler = $client->followRedirect();

        $this->assertEquals(200, $client->getResponse()->getStatusCode());
        $this->assertContains('Projects', $crawler->filter('div')->text());
        $this->assertContains('Organisms', $crawler->filter('div')->text());
        $this->assertContains('Traits', $crawler->filter('div')->text());
    }
}
