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
     * 'cvterm' => 'habitat',
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
        $query_get_traits_to_organisms = <<<EOF
SELECT trait_entry.*, trait_cvterm.name AS cvtermname, trait_cvterm.definition AS cvtermdefinition
    FROM trait_entry, trait_cvterm
    WHERE trait_entry.type_cvterm_id = trait_cvterm.trait_cvterm_id 
    AND organism_id IN ($placeholders)
EOF;
        $stm_get_traits_to_organisms = $this->db->prepare($query_get_traits_to_organisms);
        $stm_get_traits_to_organisms->execute($organism_ids);

        $result = array();
        while ($row = $stm_get_traits_to_organisms->fetch(PDO::FETCH_ASSOC)) {
            $type_cvterm_id = $row['type_cvterm_id'];
            $cvterm = ($row['cvtermname'] == null) ? $row['cvtermdefinition'] : $row['cvtermname'];
            $organism_id = $row['organism_id'];
            $trait_entry_id = $row['trait_entry_id'];
            if (!array_key_exists($type_cvterm_id, $result)) {
                $result[$type_cvterm_id] = [
                    'cvterm' => $cvterm,
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
