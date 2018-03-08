<?php

namespace AppBundle\API\Mapping;

use AppBundle\API\Webservice;
use AppBundle\Entity\User\FennecUser;
use AppBundle\Service\DBVersion;
use Symfony\Component\HttpFoundation\ParameterBag;

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