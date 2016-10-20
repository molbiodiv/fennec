<?php

namespace Tests\AppBundle\API;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\MockArraySessionStorage;

class WebserviceTestCase extends WebTestCase
{
    protected $container;
    protected $default_db;
    protected $webservice;
    protected $session;

    public function __construct()
    {
        $this->container = static::createClient()->getContainer();
        $this->default_db = $this->container->getParameter('default_db');
        $this->webservice = $this->container->get('app.api.webservice');
        $this->session = new Session(new MockArraySessionStorage());
    }
}
