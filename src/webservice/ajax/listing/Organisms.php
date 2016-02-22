<?php

namespace ajax\listing;

use \PDO as PDO;

/**
 * Web Service.
 * Returns Organisms with given ids
 */
class Organisms extends \WebService {

    /**
     * @param $querydata[ids] array of organism ids
     * @returns array of organisms
     */
    public function execute($querydata) {
        global $db;
        
        $limit = 5;
        if(in_array('limit', array_keys($querydata))){
            $limit = $querydata['limit'];
        }
        $query_get_organisms = <<<EOF
SELECT *
    FROM organism LIMIT ?
EOF;
        
        $stm_get_organisms = $db->prepare($query_get_organisms);

        $data = array();

        $stm_get_organisms->execute(array($limit));
        
        while ($row = $stm_get_organisms->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }
        
        return $data;
    }

}

?>
