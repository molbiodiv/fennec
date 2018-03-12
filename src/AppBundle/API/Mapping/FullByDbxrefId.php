<?php

namespace AppBundle\API\Mapping;

use AppBundle\API\Webservice;
use AppBundle\Service\DBVersion;

class FullByDbxrefId
{
    private $manager;

    /**
     * FullByDbxrefId constructor.
     * @param $dbversion
     */
    public function __construct(DBVersion $dbversion)
    {
        $this->manager = $dbversion->getDataEntityManager();
    }


    /**
     * @inheritdoc
     */
    public function execute($dbname)
    {
        return $this->manager->getRepository('AppBundle:FennecDbxref')->getFullIds($dbname);
    }
}