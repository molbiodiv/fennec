<?php

namespace AppBundle\API\Details;

use AppBundle\Entity\FennecUser;
use AppBundle\Service\DBVersion;

/**
 * Web Service.
 * Returns details for Organisms with given ids
 */
class Organism
{

    private $manager;

    /**
     * Organism constructor.
     * @param $dbversion
     */
    public function __construct(DBVersion $dbversion)
    {
        $this->manager = $dbversion->getEntityManager();
    }


    /**
     * @param $fennecId
     * @param $dbversion DBVersion
     * @param $user FennecUser
     * @returns array of details
     */
    public function execute(int $fennecId, DBVersion $dbversion, FennecUser $user = null)
    {
        return $this->manager->getRepository(Organism::class)->getDetailsOfOrganism($fennecId, $dbversion, $user);
    }
}
