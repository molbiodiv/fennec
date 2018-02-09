<?php

namespace AppBundle\API\Listing;

use AppBundle\API\Webservice;
use AppBundle\Entity\User\FennecUser;
use AppBundle\Entity\Data\TraitCategoricalEntry;
use AppBundle\Entity\Data\TraitNumericalEntry;
use AppBundle\Service\DBVersion;
use \PDO as PDO;
use phpDocumentor\Reflection\Types\Integer;
use phpDocumentor\Reflection\Types\String_;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Web Service.
 * Returns Trait information
 */
class Traits
{
    private $manager;

    /**
     * Traits constructor.
     * @param $dbversion
     */
    public function __construct(DBVersion $dbversion)
    {
        $this->manager = $dbversion->getEntityManager();
    }


    /**
     * @param $limit
     * @param $search
     * @returns array of traits
     */
    public function execute($limit, $search)
    {
        $categoricalTraits = $this->manager->getRepository(TraitCategoricalEntry::class)->getTraits($search, $limit);
        $numericalTraits = $this->manager->getRepository(TraitNumericalEntry::class)->getTraits($search, $limit);
        $data = array_merge($numericalTraits, $categoricalTraits);
        //if performance-tuning is required:
        //Merge-Step of MergeSort would be sufficient but not natively available in PHP
        usort($data, function($a,$b){return $b['frequency'] - $a['frequency'];});
        return $data;
    }
}
