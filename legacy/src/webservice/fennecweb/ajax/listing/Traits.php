<?php

namespace fennecweb\ajax\listing;

use \PDO as PDO;

/**
 * Web Service.
 * Returns Trait information
 */
class Traits extends \fennecweb\WebService
{

    /**
     * @param $querydata[]
     * @returns array of traits
     */
    public function execute($querydata)
    {
        $db = $this->openDbConnection($querydata);
        $limit = 1000;
        if (in_array('limit', array_keys($querydata))) {
            $limit = $querydata['limit'];
        }
        $search = "%%";
        if (in_array('search', array_keys($querydata))) {
            $search = "%".$querydata['search']."%";
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
