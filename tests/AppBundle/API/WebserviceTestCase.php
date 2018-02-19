<?php

namespace Tests\AppBundle\API;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class WebserviceTestCase extends WebTestCase
{
    protected $container;
    protected $default_data_db;
    protected $user_db;
    protected $user;

    public function __construct()
    {
        $this->container = static::createClient()->getContainer();
        $this->default_data_db = $this->container->getParameter('default_data_connection');
        $this->user_db = $this->container->getParameter('user_connection');
        $this->user = null;
    }
}
