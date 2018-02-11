<?php

namespace AppBundle\API\Listing;

use AppBundle\API\Webservice;
use AppBundle\Entity\User\FennecUser;
use AppBundle\Service\DBVersion;
use \PDO as PDO;
use Symfony\Component\HttpFoundation\ParameterBag;

/**
 * Web Service.
 * Returns scientific names for the supplied fennec ids
 */
class Scinames
{
    private $manager;

    /**
     * Scinames constructor.
     * @param $dbversion
     */
    public function __construct(DBVersion $dbversion)
    {
        $this->manager = $dbversion->getEntityManager();
    }


    /**
     * @inheritdoc
     * <code>
     * $query = array(
     *   'dbversion' => '1.0', // the version of the database (required)
     *   'ids'       => []     // the fennec_ids for which scinames are requested (default: empty array)
     * );
     * </code>
     * @return array
     * <code>
     * $result = array(
     *   array(
     *     'fennec_id1' => 'scientific_name1',
     *     'fennec_id2' => 'scientific_name2',
     * );
     * </code>
     */
    public function execute($ids)
    {
        return $this->manager->getRepository('AppBundle:Organism')->getScientificNamesToFennecIds($ids);
    }
}
