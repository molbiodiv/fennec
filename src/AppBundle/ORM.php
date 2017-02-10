<?php

namespace AppBundle;

use Doctrine\Bundle\DoctrineBundle\Registry;
use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * provides access to the various databases by static functions
 */
class ORM extends Controller
{
    /**
     * @var Registry
     */
    private $orm;

    /**
     * ORM constructor.
     * @param $orm Registry
     */
    public function __construct($orm) {
        $this->orm = $orm;
    }

    /**
     * returns the manager for database using $version
     * @param String $version the database version to use (has to be defined in parameters.yml)
     * @return EntityManager
     */
    public function getManagerForVersion($version)
    {
        return $this->orm->getManager($version);
    }
}