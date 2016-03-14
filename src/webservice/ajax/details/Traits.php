<?php

namespace ajax\details;

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
        $type_cvterm_id = $querydata['type_cvterm_id'];
        $placeholders = implode(',', array_fill(0, count($type_cvterm_id), '?'));
        $query_get_trait = <<<EOF
SELECT *
    FROM trait_cvterm WHERE trait_cvterm_id IN ($placeholders)
EOF;
        $stm_get_trait= $db->prepare($query_get_trait);
        $stm_get_trait->execute(array($type_cvterm_id));

        $result = array();
        while ($row = $stm_get_trait->fetch(PDO::FETCH_ASSOC)) {
            $result = $row;
            
        }
        
        $query_count_organisms_by_trait = <<<EOF
SELECT count(DISTINCT organism_id) 
    FROM trait_entry WHERE type_cvterm_id = :type_cvterm_id
EOF;
        $stm_count_organisms_by_trait = $db->prepare($query_count_organisms_by_trait);
        $stm_count_organisms_by_trait->bindValue('type_cvterm_id', $type_cvterm_id);
        $stm_count_organisms_by_trait->execute();
        while($row = $stm_count_organisms_by_trait->fetch(PDO::FETCH_ASSOC)){
            $result['all_organisms'] = $row['count'];
        }
        
        $query_get_value_range = <<<EOF
SELECT DISTINCT value, value_cvterm_id 
    FROM trait_entry WHERE type_cvterm_id = :type_cvterm_id
EOF;
        $stm_get_value_range = $db->prepare($query_get_value_range);
        $stm_get_value_range->bindValue('type_cvterm_id', $type_cvterm_id);
        $stm_get_value_range->execute();
        $result['value_range'] = array();
        while($row = $stm_get_value_range->fetch(PDO::FETCH_ASSOC)){
            if($row['value']!=NULL){
                array_push($result['value_range'], $row['value']);
            } else {
                array_push($result['value_range'], $this->get_value_by_id($row['value_cvterm_id']));
            }
        }
        return $result;
    }
}

?>
