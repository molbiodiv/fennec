<?php

namespace AppBundle\API\Mapping;

use AppBundle\Service\DBVersion;

class ByOrganismName
{
    private $manager;

    /**
     * ByOrganismName constructor.
     * @param $dbversion
     */
    public function __construct(DBVersion $dbversion)
    {
        $this->manager = $dbversion->getDataEntityManager();
    }


    /**
     * @inheritdoc
     */
    public function execute($ids)
    {
        return $this->manager->getRepository('AppBundle:Organism')->getFennecIdsToScientificNames($ids);
    }
}