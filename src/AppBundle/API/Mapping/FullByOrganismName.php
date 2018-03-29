<?php

namespace AppBundle\API\Mapping;

use AppBundle\API\Webservice;
use AppBundle\Service\DBVersion;

class FullByOrganismName
{
    private $dbversion;

    /**
     * FullByOrganismName constructor.
     * @param $dbversion
     */
    public function __construct(DBVersion $dbversion)
    {
        $this->dbversion = $dbversion;
    }


    /**
     * @inheritdoc
     */
    public function execute($em_version)
    {
        $this->dbversion->getDataEntityManagerForVersion($em_version);
        return $this->manager->getRepository('AppBundle:Organism')->getFullIds();
    }
}