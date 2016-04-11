<?php

namespace fennecweb\ajax\details;

use \PDO as PDO;

/**
 * Web Service.
 * Returns Trait informatio
 */
class Traits extends \WebService
{

    var $db;

    /**
     * @param $querydata[]
     * @returns array of traits
     */
    public function execute($querydata)
    {
        $this->db = $this->open_db_connection($querydata);
        $type_cvterm_id = $querydata['type_cvterm_id'];
        $group = "%%";
        if (in_array('group', array_keys($querydata))) {
            $group = "%".$querydata['group']."%";
        }
        $placeholders = implode(',', array_fill(0, count($type_cvterm_id), '?'));
        $query_get_trait = <<<EOF
SELECT * FROM trait_cvterm, (SELECT * FROM trait_entry, (SELECT organism_id FROM organism WHERE species LIKE :group) AS names 
    WHERE names.organism_id = trait_entry.organism_id) AS names2 
        WHERE names2.type_cvterm_id=trait_cvterm.trait_cvterm_id AND trait_cvterm.trait_cvterm_id = :type_cvterm_id;
EOF;
        $stm_get_trait= $this->db->prepare($query_get_trait);
        $stm_get_trait->bindValue('group', $group);
        $stm_get_trait->bindValue('type_cvterm_id', $type_cvterm_id);
        $stm_get_trait->execute();

        $result = array();
        while ($row = $stm_get_trait->fetch(PDO::FETCH_ASSOC)) {
            $result = $row;
        }
        
        $query_count_organisms_by_trait = <<<EOF
SELECT count(DISTINCT organism_id) 
    FROM trait_entry WHERE type_cvterm_id = :type_cvterm_id
EOF;
        $stm_count_organisms_by_trait = $this->db->prepare($query_count_organisms_by_trait);
        $stm_count_organisms_by_trait->bindValue('type_cvterm_id', $type_cvterm_id);
        $stm_count_organisms_by_trait->execute();
        while ($row = $stm_count_organisms_by_trait->fetch(PDO::FETCH_ASSOC)) {
            $result['all_organisms'] = $row['count'];
        }
        
        $query_get_value_range = <<<EOF
SELECT value, value_cvterm_id
    FROM trait_entry WHERE type_cvterm_id = :type_cvterm_id LIMIT 1
EOF;
        $stm_get_value_range = $this->db->prepare($query_get_value_range);
        $stm_get_value_range->bindValue('type_cvterm_id', $type_cvterm_id);
        $stm_get_value_range->execute();
        
        while ($row = $stm_get_value_range->fetch(PDO::FETCH_ASSOC)) {
            if ($row['value'] == null) {
                $result['value_type'] = 'cvterm';
                $query_get_cvterm_ids = <<<EOF
SELECT value_cvterm_id, COUNT(value_cvterm_id) AS count FROM trait_entry WHERE type_cvterm_id = :type_cvterm_id GROUP BY value_cvterm_id;
EOF;
                $stm_get_cvterm_ids = $this->db->prepare($query_get_cvterm_ids);
                $stm_get_cvterm_ids->bindValue('type_cvterm_id', $type_cvterm_id);
                $stm_get_cvterm_ids->execute();
                $labels = array();
                $frequency = array();
                
                while ($row = $stm_get_cvterm_ids->fetch(PDO::FETCH_ASSOC)) {
                    array_push($frequency, $row['count']);
                    array_push($labels, $this->get_value_by_id($row['value_cvterm_id']));
                }
                $result['value']['labels'] = $labels;
                $result['value']['frequency'] = $frequency;
            } else {
                $result['value_type'] = 'value';
                $query_get_values = <<<EOF
SELECT name AS measurement_unit, tmp2.value 
    FROM trait_cvterm, (SELECT value_cvterm_id, tmp.value FROM trait_metadata, 
        (SELECT trait_entry_id, value FROM trait_entry WHERE type_cvterm_id=:type_cvterm_id) AS tmp 
            WHERE trait_metadata.trait_entry_id=tmp.trait_entry_id AND subject_cvterm_id=5) AS tmp2 
                WHERE tmp2.value_cvterm_id=trait_cvterm.trait_cvterm_id;
EOF;
                        
                $stm_get_values = $this->db->prepare($query_get_values);
                $stm_get_values->bindValue('type_cvterm_id', $type_cvterm_id);
                $stm_get_values->execute();
                
                $row = $stm_get_values->fetch(PDO::FETCH_ASSOC);
                $tmp_result[$row['measurement_unit']] = array();
                array_push($tmp_result[$row['measurement_unit']], $row['value']);
                while ($row = $stm_get_values->fetch(PDO::FETCH_ASSOC)) {
                    if (array_key_exists($row['measurement_unit'], $tmp_result)) {
                        array_push($tmp_result[$row['measurement_unit']], $row['value']);
                    } else {
                        $tmp_result[$row['measurement_unit']] = array();
                        array_push($tmp_result[$row['measurement_unit']], $row['value']);
                    }
                }
                $result['value'] = $tmp_result;
            }
        }
        return $result;
    }
    
    private function get_value_by_id($value_cvterm_id)
    {
        $value = $value_cvterm_id;
        
        $query_get_value = <<<EOF
SELECT * 
    FROM trait_cvterm WHERE trait_cvterm_id = :value_cvterm_id
EOF;
        $stm_get_value = $this->db->prepare($query_get_value);
        $stm_get_value->bindValue('value_cvterm_id', $value_cvterm_id);
        $stm_get_value->execute();
        while ($row = $stm_get_value->fetch(PDO::FETCH_ASSOC)) {
            if ($row['name']) {
                $value = $row['name'];
            } else {
                $value = $row['definition'];
            }
        }
        return $value;
    }
}
