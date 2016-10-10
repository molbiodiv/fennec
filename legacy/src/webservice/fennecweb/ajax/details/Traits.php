<?php

namespace fennecweb\ajax\details;

use \PDO as PDO;

/**
 * Web Service.
 * Returns Trait information
 */
class Traits extends \fennecweb\WebService
{

    private $db;

    /**
     * @param $querydata[]
     * @returns array of traits
     */
    public function execute($querydata)
    {
        $this->db = $this->openDbConnection($querydata);
        $trait_type_id = $querydata['trait_type_id'];
        $organism_ids = null;
        if (isset($querydata['organism_ids']) and is_array($querydata['organism_ids'])){
            $organism_ids = $querydata['organism_ids'];
        }
        $result = $this->get_info($trait_type_id);
        $result['values'] = $this->get_values($trait_type_id, $organism_ids);
        $result['number_of_organisms'] = $this->get_number_of_organisms($trait_type_id, $organism_ids);

        return $result;
    }

    /**
     * @param $trait_type_id
     * @param $organism_ids
     * @return array values of specific trait
     */
    private function get_values($trait_type_id, $organism_ids){
        if ($organism_ids !== null and count($organism_ids) === 0){
            return array();
        }
        $organism_constraint = $this->get_organism_constraint($organism_ids);
        $query_get_values = <<<EOF
SELECT value, count(value)
    FROM trait_categorical_entry, trait_categorical_value
    WHERE trait_categorical_value_id=trait_categorical_value.id
    AND trait_categorical_entry.trait_type_id = ?
    {$organism_constraint}
    GROUP BY value;
EOF;
        $stm_get_values= $this->db->prepare($query_get_values);
        if($organism_ids !== null){
            $stm_get_values->execute(array_merge(array($trait_type_id), $organism_ids));
        } else {
            $stm_get_values->execute(array($trait_type_id));
        }

        $values = array();
        while ($row = $stm_get_values->fetch(PDO::FETCH_ASSOC)) {
            $values[$row['value']] = $row['count'];
        }

        return $values;
    }

    /**
     * @param $trait_type_id
     * @return array type, format, trait_type_id and ontology_url of specific trait
     */
    private function get_info($trait_type_id){
        $query_get_info = <<<EOF
SELECT trait_type.id AS trait_type_id, type AS name, ontology_url, format AS trait_format
    FROM trait_type, trait_format
    WHERE trait_type.id = :trait_type_id
    AND trait_format_id = trait_format.id;
EOF;
        $stm_get_info= $this->db->prepare($query_get_info);
        $stm_get_info->bindValue('trait_type_id', $trait_type_id);
        $stm_get_info->execute();

        $info = $stm_get_info->fetch(PDO::FETCH_ASSOC);

        return $info;
    }

    /**
     * @param $trait_type_id
     * @param $organism_ids
     * @return integer number of organisms which have this trait
     */
    private function get_number_of_organisms($trait_type_id, $organism_ids){
        if ($organism_ids !== null and count($organism_ids) === 0){
            return 0;
        }
        $organism_constraint = $this->get_organism_constraint($organism_ids);
        $query_get_number_of_organisms = <<<EOF
SELECT count(DISTINCT organism_id) FROM trait_categorical_entry WHERE trait_type_id = ?
    {$organism_constraint}
EOF;
        $stm_get_number_of_organisms= $this->db->prepare($query_get_number_of_organisms);
        if($organism_ids !== null){
            $stm_get_number_of_organisms->execute(array_merge(array($trait_type_id), $organism_ids));
        } else {
            $stm_get_number_of_organisms->execute(array($trait_type_id));
        }

        $row = $stm_get_number_of_organisms->fetch(PDO::FETCH_ASSOC);
        $number_of_organisms = $row['count'];

        return $number_of_organisms;
    }

    private function get_organism_constraint($organism_ids){
        $organism_constraint = '';
        if($organism_ids !== null){
            $placeholders = implode(',', array_fill(0, count($organism_ids), '?'));
            $organism_constraint = "AND organism_id IN (".$placeholders.") ";
        }
        return $organism_constraint;
    }
}