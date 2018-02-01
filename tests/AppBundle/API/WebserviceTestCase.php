<?php

namespace Tests\AppBundle\API;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class WebserviceTestCase extends WebTestCase
{
    protected $container;
    protected $default_db;
    protected $user;

    public function __construct()
    {
        $this->container = static::createClient()->getContainer();
        $this->default_db = $this->container->getParameter('dbal')['default_connection'];
        $this->user = null;
    }
}
