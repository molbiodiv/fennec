<?php

namespace AppBundle\API\Listing;

use AppBundle\API\Webservice;
use \PDO as PDO;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Web Service.
 * Returns Trait information
 */
class Traits extends Webservice
{

    /**
     * @param $query ParameterBag
     * @param $session SessionInterface
     * @returns array of traits
     */
    public function execute(ParameterBag $query, SessionInterface $session = null)
    {
        $db = $this->getDbFromQuery($query);
        $limit = 1000;
        if ($query->has('limit')) {
            $limit = $query->get('limit');
        }
        $search = "%%";
        if ($query->has('search')) {
            $search = "%".$query->get('search')."%";
        }
        $query_get_traits = <<<EOF
SELECT trait_type.type AS name, trait_type_id, count
    FROM 
        (
            SELECT trait_type_id, count(trait_type_id) AS count
                FROM trait_categorical_entry GROUP BY trait_type_id ORDER BY count DESC LIMIT :limit
        ) AS trait_entry, trait_type
            WHERE trait_type.id=trait_type_id AND trait_type.type ILIKE :search
EOF;
        $stm_get_traits = $db->prepare($query_get_traits);
        $stm_get_traits->bindValue('search', $search);
        $stm_get_traits->bindValue('limit', $limit);
        $stm_get_traits->execute();
        
        $data = array();
        while ($row = $stm_get_traits->fetch(PDO::FETCH_ASSOC)) {
            $result = array();
            $result['name'] = $row['name'];
            $result['trait_type_id'] = $row['trait_type_id'];
            $result['frequency'] = $row['count'];
            $data[] = $result;
        }
        return $data;
    }
}
