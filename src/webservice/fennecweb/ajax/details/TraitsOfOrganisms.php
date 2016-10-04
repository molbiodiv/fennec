<?php

namespace fennecweb\ajax\details;

use \PDO as PDO;

/**
 * Web Service.
 * Returns trait information to a list of organism ids
 */
class TraitsOfOrganisms extends \fennecweb\WebService
{
    private $db;
    /**
     * @param $querydata['organism_ids' => [13,7,12,5]]
     * @returns Array $result
     * <code>
     * array(type_cvterm_id => array(
     * 'trait_type' => 'habitat',
     * 'trait_entry_ids' => array(1, 20, 36, 7),
     * 'organism_ids' => array(13, 20, 5)
     * );
     * </code>
     */
    public function execute($querydata)
    {
        $this->db = $this->openDbConnection($querydata);
        $organism_ids = $querydata['organism_ids'];
        $placeholders = implode(',', array_fill(0, count($organism_ids), '?'));
        $query_get_categorical_traits = <<<EOF
SELECT trait_categorical_entry.id, trait_categorical_entry.organism_id, trait_categorical_entry.trait_type_id, trait_type.type
    FROM trait_categorical_entry, trait_type
    WHERE trait_categorical_entry.trait_type_id = trait_type.id
    AND organism_id IN ($placeholders)
EOF;
        $stm_get_categorical_traits = $this->db->prepare($query_get_categorical_traits);
        $stm_get_categorical_traits->execute($organism_ids);

        $result = array();
        while ($row = $stm_get_categorical_traits->fetch(PDO::FETCH_ASSOC)) {
            $trait_type = $row['type'];
            $type_cvterm_id = $row['trait_type_id'];
            $organism_id = $row['organism_id'];
            $trait_entry_id = $row['id'];
            if (!array_key_exists($type_cvterm_id, $result)) {
                $result[$type_cvterm_id] = [
                    'trait_type' => $trait_type,
                    'trait_entry_ids' => [$trait_entry_id],
                    'organism_ids' => [$organism_id]
                ];
            } else {
                array_push($result[$type_cvterm_id]['trait_entry_ids'], $trait_entry_id);
                if (!in_array($organism_id, $result[$type_cvterm_id]['organism_ids'])) {
                    array_push($result[$type_cvterm_id]['organism_ids'], $organism_id);
                }
            }
        }
        return $result;
    }
}
