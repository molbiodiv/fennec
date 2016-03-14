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
        $search = "%%";
        if(in_array('search', array_keys($querydata))){
            $search = "%".$querydata['search']."%";
        }
        $query_get_traits = <<<EOF
SELECT name, tci.type_cvterm_id FROM (SELECT DISTINCT type_cvterm_id FROM trait_entry) AS tci, trait_cvterm WHERE tci.type_cvterm_id=trait_cvterm.trait_cvterm_id AND name LIKE :search;
EOF;
        $stm_get_traits = $db->prepare($query_get_traits);
        $stm_get_traits->bindValue('search', $search);
        $stm_get_traits->execute();
        
        $data = array();
        while ($row = $stm_get_traits->fetch(PDO::FETCH_ASSOC)) {   
            $result = array();
            $result['name'] = $row['name'];
            $result['type_id'] = $row['type_cvterm_id'];
            $data[] = $result;
        }
        return $data;
    }
}

?>

