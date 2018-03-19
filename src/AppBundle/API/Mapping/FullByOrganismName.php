<?php

namespace AppBundle\API\Mapping;

use AppBundle\API\Webservice;
use AppBundle\Service\DBVersion;

class FullByOrganismName
{
    private $manager;

    /**
     * FullByOrganismName constructor.
     * @param $dbversion
     */
    public function __construct(DBVersion $dbversion)
    {
        $this->manager = $dbversion->getDataEntityManager();
    }


    /**
     * @inheritdoc
     */
    public function execute()
    {
        return $this->manager->getRepository('AppBundle:Organism')->getFullIds();
    }
}