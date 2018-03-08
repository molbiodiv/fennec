<?php

namespace AppBundle\API\Details;

use AppBundle\API\Details;
use AppBundle\Service\DBVersion;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Web Service.
 * Return trait details of project
 */
class TraitOfProject
{
    private $manager;
    private $container;

    /**
     * TraitOfProject constructor.
     * @param $dbversion
     * @param $container
     */
    public function __construct(DBVersion $dbversion, ContainerInterface $container)
    {
        $this->manager = $dbversion->getDataEntityManager();
        $this->container = $container;
    }


    /**
     * @inheritdoc
     * @returns array $result
     * see output of details/Traits.php
     */
    public function execute($traitTypeId, $projectId, $dimension, $user, $includeCitations)
    {
        $organismsOfProject = $this->container->get(Details\OrganismsOfProject::class);
        $fennecIds = $organismsOfProject->execute($projectId, $dimension, $user);
        if (key_exists('error', $fennecIds)){
            return $fennecIds;
        }
        $traitsOfProject = $this->container->get(Details\Traits::class);
        $results = $traitsOfProject->execute($traitTypeId, $fennecIds, $includeCitations);
        return $results;
    }
}