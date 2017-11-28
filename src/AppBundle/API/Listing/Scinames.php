<?php

namespace AppBundle\API\Listing;

use AppBundle\API\Webservice;
use AppBundle\Entity\FennecUser;
use \PDO as PDO;
use Symfony\Component\HttpFoundation\ParameterBag;

/**
 * Web Service.
 * Returns scientific names for the supplied fennec ids
 */
class Scinames extends Webservice
{
    private $database;

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
    public function execute(ParameterBag $query, FennecUser $user = null)
    {
        $this->database = $this->getManagerFromQuery($query)->getConnection();
        if (!$query->has('ids') or !is_array($query->get('ids'))) {
            return [];
        }
        $placeholders = implode(',', array_fill(0, count($query->get('ids')), '?'));
        $query_get_organisms = <<<EOF
SELECT fennec_id, scientific_name
    FROM organism WHERE organism.fennec_id IN ({$placeholders})
EOF;
        $stm_get_organisms = $this->database->prepare($query_get_organisms);
        $stm_get_organisms->execute($query->get('ids'));

        $result = array();

        while ($row = $stm_get_organisms->fetch(PDO::FETCH_ASSOC)) {
            $result[$row['fennec_id']] = $row['scientific_name'];
        }
        return $result;
    }
}
