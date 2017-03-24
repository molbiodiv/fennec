<?php

namespace AppBundle\API\Listing;

use AppBundle\API\Webservice;
use AppBundle\User\FennecUser;
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
     * @param $user FennecUser
     * @returns array of traits
     */
    public function execute(ParameterBag $query, FennecUser $user = null)
    {
        $db = $this->getManagerFromQuery($query)->getConnection();
        $limit = 1000;
        if ($query->has('limit')) {
            $limit = $query->get('limit');
        }
        $search = "%%";
        if ($query->has('search')) {
            $search = "%".$query->get('search')."%";
        }
        $data = $this->get_traits($db, $search, $limit, "categorical");
        $data = array_merge($data,$this->get_traits($db, $search, $limit, "numerical"));
        //if performance-tuning is required:
        //Merge-Step of MergeSort would be sufficient but not natively available in PHP
        usort($data, function($a,$b){return $b['frequency'] - $a['frequency'];});
        return $data;
    }

    /**
     * @param $db
     * @param $search
     * @param $limit
     * @param $trait_format
     * @return array
     */
    private function get_traits($db, $search, $limit, $trait_format)
    {
        $query_get_traits = <<<EOF
SELECT trait_type.type AS name, trait_type_id, count
    FROM 
        (
            SELECT trait_type_id, count(trait_type_id) AS count
EOF;
        $query_get_traits .= " FROM trait_".$trait_format."_entry WHERE deletion_date IS NULL GROUP BY trait_type_id";

        $query_get_traits .= <<<EOF
        ) AS trait_entry, trait_type
            WHERE trait_type.id=trait_type_id AND trait_type.type ILIKE :search ORDER BY count DESC LIMIT :limit
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
