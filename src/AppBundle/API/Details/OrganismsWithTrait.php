<?php

namespace AppBundle\API\Details;

use AppBundle\API\Webservice;
use AppBundle\Entity\User\FennecUser;
use AppBundle\Entity\Data\Organism;
use AppBundle\Service\DBVersion;
use \PDO as PDO;
use Symfony\Component\HttpFoundation\ParameterBag;

/**
 * Web Service.
 * Returns Organisms that posess a given trait
 */
class OrganismsWithTrait
{

    private $manager;

    /**
     * OrganismsWithTrait constructor.
     * @param $dbversion
     */
    public function __construct(DBVersion $dbversion)
    {
        $this->manager = $dbversion->getEntityManager();
    }


    public function execute($trait_type_id, $limit)
    {
        return $this->manager->getRepository(Organism::class)->getOrganismByTrait($trait_type_id, $limit);
    }
}
