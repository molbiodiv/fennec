<?php

namespace AppBundle\API\Mapping;

use AppBundle\API\Webservice;
use AppBundle\Entity\FennecUser;
use AppBundle\Service\DBVersion;
use Symfony\Component\HttpFoundation\ParameterBag;

class FullByDbxrefId
{
    private $manager;

    /**
     * FullByDbxrefId constructor.
     * @param $dbversion
     */
    public function __construct(DBVersion $dbversion)
    {
        $this->manager = $dbversion->getEntityManager();
    }


    /**
     * @inheritdoc
     */
    public function execute($dbname)
    {
        return $this->manager->getRepository('AppBundle:FennecDbxref')->getFullIds($dbname);
    }
}