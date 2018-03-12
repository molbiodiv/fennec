<?php

namespace AppBundle\API\Listing;

use AppBundle\Service\DBVersion;
use AppBundle\Entity\Data\Organism;

/**
 * Web Service.
 * Returns Organisms up to a limit in the given db version (matching a search criterion if supplied)
 */
class Organisms
{
    private $em;

    /**
     * Organisms constructor.
     * @param $dbversion
     */
    public function __construct(DBVersion $dbversion)
    {
        $this->em = $dbversion->getDataEntityManager();
    }


    /**
     * @inheritdoc
     * <code>
     * $query = array(
     *   'dbversion' => '1.0', // the version of the database (required)
     *   'limit'     => 5,     // the maximum number of organisms to return (default: 5)
     *   'search'    => 'test' // a search term which is used to filter species names (optional)
     * );
     * </code>
     * @return array
     * <code>
     * $result = array(
     *   array(
     *     'fennec_id'     => 1,                   // internal db organism id
     *     'scientific_name' => 'Dionaea muscipula'
     * );
     * </code>
     */
    public function execute($limit, $search)
    {
        return $this->em->getRepository(Organism::class)->getListOfOrganisms($limit, $search);
    }
}
