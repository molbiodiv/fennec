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
        $result = $this->get_info($trait_type_id);
        $result['values'] = $this->get_values($trait_type_id);

        return $result;
    }

    private function get_values($trait_type_id){
        $query_get_values = <<<EOF
SELECT value, count(value)
    FROM trait_categorical_entry, trait_categorical_value
    WHERE trait_categorical_value_id=trait_categorical_value.id
    AND trait_categorical_entry.trait_type_id = :trait_type_id
    GROUP BY value;
EOF;
        $stm_get_values= $this->db->prepare($query_get_values);
        $stm_get_values->bindValue('trait_type_id', $trait_type_id);
        $stm_get_values->execute();

        $values = array();
        while ($row = $stm_get_values->fetch(PDO::FETCH_ASSOC)) {
            $values[$row['value']] = $row['count'];
        }

        return $values;
    }

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
}