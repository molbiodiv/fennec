<?php

namespace ajax\listing;

use \PDO as PDO;

/**
 * Web Service.
 * Returns Trait informatio
 */
class Traits extends \WebService {

    /**
     * @param $querydata[]
     * @returns array of traits
     */
    public function execute($querydata) {
        global $db;
        $data = array();
        $search = "%%";
        if(in_array('search', array_keys($querydata))){
            $search = "%".$querydata['search']."%";
        }
        $query_get_traits = <<<EOF
SELECT *
    FROM trait_entry LIMIT 10;
EOF;
        $stm_get_traits = $db->prepare($query_get_traits);
        $stm_get_traits->execute();
        
        while ($row = $stm_get_traits->fetch(PDO::FETCH_ASSOC)) {   
            var_dump($row);
        }
        
        return data;
    }
}

?>

