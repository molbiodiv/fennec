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
     * array(trait_entry_id => cvterm);
     * </code>
     */
    public function execute($querydata)
    {
        $this->db = $this->openDbConnection($querydata);
        $organism_ids = $querydata['organism_ids'];
        $placeholders = implode(',', array_fill(0, count($organism_ids), '?'));
        var_dump($placeholders);
        $query_get_traits_to_organisms = <<<EOF
SELECT *
    FROM trait_entry WHERE organism_id IN ($placeholders)
EOF;
        $stm_get_traits_to_organisms = $this->db->prepare($query_get_traits_to_organisms);
        $stm_get_traits_to_organisms->execute($organism_ids);

        $result = array();
        return $result;
    }
}
