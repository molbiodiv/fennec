<?php

namespace ajax\listing;

use \PDO as PDO;

/**
 * Web Service.
 * Returns Taxonomy information for a given organism_id
 */
class Taxonomy extends \WebService {

    /**
     * @param $querydata[ids] array of organism ids
     * @returns array of taxonomy information for a given organism id
     * array('lineage' => [grandgrandparent, grandparent, parent])
     */
    public function execute($querydata) {
        
    }
}

?>

