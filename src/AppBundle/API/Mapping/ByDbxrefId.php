<?php

namespace AppBundle\API\Mapping;

use AppBundle\API\Webservice;
use AppBundle\Entity\FennecUser;
use AppBundle\Service\DBVersion;
use Symfony\Component\HttpFoundation\ParameterBag;

class ByDbxrefId
{
    private $manager;

    /**
     * ByDbxrefId constructor.
     * @param $dbversion
     */
    public function __construct(DBVersion $dbversion)
    {
        $this->manager = $dbversion->getEntityManager();
    }


    /**
     * @inheritdoc
     */
    public function execute($ids, $dbname)
    {
        return $this->manager->getRepository('AppBundle:FennecDbxref')->getIds($ids, $dbname);
    }
}