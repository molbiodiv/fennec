<?php

namespace fennecweb\ajax\details;

use \PDO as PDO;

/**
 * Web Service.
 * Returns Trait Entry information
 */
class TraitEntries extends \fennecweb\WebService
{
    private $db;
    private $known_trait_formats = array('categorical_free');
    const ERROR_UNKNOWN_TRAIT_FORMAT = "Error. Unknown trait_format.";

    /**
     * @param $querydata[]
     * @returns array with details of the requested trait entries
     */
    public function execute($querydata)
    {
        $this->db = $this->openDbConnection($querydata);
        $trait_entry_ids = $querydata['trait_entry_ids'];
        $placeholders = implode(',', array_fill(0, count($trait_entry_ids), '?'));
        $query_get_trait_entries = <<<EOF
SELECT 
    trait_entry.trait_entry_id,
    trait_entry.organism_id,
    trait_entry.value,
    type_cvterm.name AS type_name,
    type_cvterm.definition AS type_definition,
    value_cvterm.name AS value_name,
    value_cvterm.definition AS value_definition
FROM trait_entry
    JOIN trait_cvterm AS type_cvterm
        ON type_cvterm.trait_cvterm_id = trait_entry.type_cvterm_id
    LEFT JOIN trait_cvterm AS value_cvterm
        ON trait_entry.value_cvterm_id = value_cvterm.trait_cvterm_id
WHERE trait_entry_id IN ($placeholders)
EOF;
        $stm_get_trait_entries= $this->db->prepare($query_get_trait_entries);
        $stm_get_trait_entries->execute($trait_entry_ids);

        $result = array();
        while ($row = $stm_get_trait_entries->fetch(PDO::FETCH_ASSOC)) {
            $trait_entry_id = $row['trait_entry_id'];
            $result[$trait_entry_id] = array(
                'organism_id' => $row['organism_id'],
                'type' => $row['type_name'],
                'type_definition' => $row['type_definition'],
                'metadata' => array()
            );
            if($row['value'] !== null){
                $result[$trait_entry_id]['value'] = $row['value'];
                $result[$trait_entry_id]['value_definition'] = 'numeric';
            } else {
                $result[$trait_entry_id]['value'] = $row['value_name'];
                $result[$trait_entry_id]['value_definition'] = $row['value_definition'];
            }
        }
        
        $query_get_trait_metadata = <<<EOF
SELECT 
    trait_metadata.trait_entry_id,
    subject.name AS subject_name,
    subject.definition AS subject_definition,
    value.name AS value_name,
    value.definition AS value_definition
FROM trait_metadata
    JOIN trait_cvterm AS subject
        ON trait_metadata.subject_cvterm_id = subject.trait_cvterm_id
    JOIN trait_cvterm AS value
        ON trait_metadata.value_cvterm_id = value.trait_cvterm_id
WHERE trait_entry_id IN ($placeholders)
EOF;
        $stm_get_trait_metadata = $this->db->prepare($query_get_trait_metadata);
        $stm_get_trait_metadata->execute($trait_entry_ids);
        while ($row = $stm_get_trait_metadata->fetch(PDO::FETCH_ASSOC)) {
            $value = $row['value_name'];
            if(empty($value)){
                $value = $row['value_definition'];
            }
            $result[$row['trait_entry_id']]['metadata'][$row['subject_name']] = $value;
        }
        return $result;
    }
}
