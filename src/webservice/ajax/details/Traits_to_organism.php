<?php

namespace fennecweb\ajax\details;

use \PDO as PDO;

/**
 * Web Service.
 * Returns Trait information to an organism by its id
 */
class Traits_to_organism extends \fennecweb\WebService
{

    private $db;

    /**
     * @param $querydata[]
     * @returns organism id
     */
    public function execute($querydata)
    {
        $this->db = $this->openDbConnection($querydata);
        $organism_id = $querydata['organism_id'];
        $query_get_traits_to_organism = <<<EOF
SELECT *
    FROM trait_entry WHERE organism_id = :organism_id
EOF;
        $stm_get_traits_to_organism = $this->db->prepare($query_get_traits_to_organism);
        $stm_get_traits_to_organism->bindValue('organism_id', $organism_id);
        $stm_get_traits_to_organism->execute();

        $result = array();
        while ($row = $stm_get_traits_to_organism->fetch(PDO::FETCH_ASSOC)) {
            $this_trait = [];
            $this_trait['type'] = $this->get_cvterm($row['type_cvterm_id']);
            if ($row['value'] != null) {
                $this_trait['value'] = $row['value'];
            } else {
                $this_trait['value'] = $this->get_cvterm($row['value_cvterm_id']);
            }
            array_push($result, $this_trait);
        }
        return $result;
    }
    
    /**
     * Function which returns the cvterm accoring to a trait_entry_id
     * @param $trait_entry_id
     * @return cvterm to a given trait_entry_id
     */
    private function get_cvterm($trait_entry_id)
    {
        $query_get_cvterm = <<<EOF
SELECT name, definition FROM trait_cvterm WHERE trait_cvterm_id = :trait_entry_id
EOF;
        $stm_get_cvterm = $this->db->prepare($query_get_cvterm);
        $stm_get_cvterm->bindValue('trait_entry_id', $trait_entry_id);
        $stm_get_cvterm->execute();
        $result = $stm_get_cvterm->fetch(PDO::FETCH_ASSOC);
        
        return ($result['name'] == null) ? $result['definition'] : $result['name'];
    }
}
