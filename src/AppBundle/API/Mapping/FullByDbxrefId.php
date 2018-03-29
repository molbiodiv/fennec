<?php

namespace AppBundle\API\Mapping;

use AppBundle\API\Webservice;
use AppBundle\Service\DBVersion;

class FullByDbxrefId
{
    private $dbversion;

    /**
     * FullByDbxrefId constructor.
     * @param $dbversion
     */
    public function __construct(DBVersion $dbversion)
    {
        $this->dbversion = $dbversion;
    }


    /**
     * @inheritdoc
     */
    public function execute($em_version, $dbname)
    {
        return $this->dbversion->getDataEntityManagerForVersion($em_version)->getRepository('AppBundle:FennecDbxref')->getFullIds($dbname);
    }
}