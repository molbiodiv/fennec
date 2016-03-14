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
        $trait_cvterm_id = $querydata['trait_cvterm_id'];
        $placeholders = implode(',', array_fill(0, count($trait_cvterm_id), '?'));
        $query_get_trait = <<<EOF
SELECT *
    FROM trait_cvterm WHERE trait_cvterm_id IN ($placeholders)
EOF;
        $stm_get_trait= $db->prepare($query_get_trait);
        $stm_get_trait->execute(array($trait_cvterm_id));

        $result = array();
        while ($row = $stm_get_trait->fetch(PDO::FETCH_ASSOC)) {
            $result = $row;
            
        }
        return $result;
    }
}

?>
