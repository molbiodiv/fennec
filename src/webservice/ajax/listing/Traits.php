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
            $result['type_cvterm_id'] = $row['type_cvterm_id'];
            $result['frequency'] = $this->count_frequency_of_trait($row['type_cvterm_id']);
            $data[] = $result;
        }
        usort($data, array($this, 'cmp'));
        return $data;
    }
    
    /**
     * This function counts the frequency of apperance of a specifi trait
     * @param $type_cvterm_id Id of trait
     * @returns the count of its appearance in the databse
     */
    private function count_frequency_of_trait($type_cvterm_id){
        global $db;
        $query_count_frequency = <<<EOF
SELECT count(type_cvterm_id) FROM trait_entry WHERE type_cvterm_id = :type_cvterm_id
EOF;
        $stm_count_frequency = $db->prepare($query_count_frequency);
        $stm_count_frequency->bindValue('type_cvterm_id', $type_cvterm_id);
        $stm_count_frequency->execute();
        
        $result = $stm_count_frequency->fetch(PDO::FETCH_ASSOC);
        return $result['count'];
    }
    
    /**
     * Functions which sorts the php result by its frequency
     * @param type $a, $b Values of frequency
     * @return int
     */
    public static function cmp($a, $b){
        if($a['frequency'] == $b['frequency']){
            return 0;
        }
        return ($a['frequency'] > $b['frequency']) ? -1 : 1;
    }
}

?>

