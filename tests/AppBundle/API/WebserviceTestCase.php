<?php

namespace Tests\AppBundle\API;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class WebserviceTestCase extends WebTestCase
{
    protected $container;
    protected $default_db;
    protected $webservice;
    protected $user;

    public function __construct()
    {
        $this->container = static::createClient()->getContainer();
        $this->default_db = $this->container->getParameter('default_db');
        $this->webservice = $this->container->get('app.api.ormwebservice');
        $this->user = null;
    }
}
