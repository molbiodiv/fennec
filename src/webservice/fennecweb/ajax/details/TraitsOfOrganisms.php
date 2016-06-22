<?php

namespace fennecweb\ajax\details;

use \PDO as PDO;

/**
 * Web Service.
 * Returns trait information to a list of organism ids
 */
class TraitsOfOrganisms extends \fennecweb\WebService
{
    /**
     * @param $querydata['organism_ids' => [13,7,12,5]]
     * @returns Array $result
     * <code>
     * array(trait_entry_id => cvterm);
     * </code>
     */
    public function execute($querydata)
    {
        $db = $this->openDbConnection($querydata);
        $organism_ids = $querydata['organism_ids'];
        var_dump($organism_ids);
        $result = array();
        return $result;
    }
}
