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
        
        $organism_ids = $querydata['ids'];

        $place_holders = implode(',', array_fill(0, count($organism_ids), '?'));
        
        $query_get_organisms = <<<EOF
SELECT *
    FROM organism
    WHERE organism_id IN ($place_holders)
EOF;
        
        $stm_get_organisms = $db->prepare($query_get_organisms);

        $data = array();

        $stm_get_organisms->execute($organism_ids);
        
        while ($row = $stm_get_organisms->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }
        
        return $data;
    }

}

?>
