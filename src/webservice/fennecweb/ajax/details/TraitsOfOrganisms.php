<?php

namespace fennecweb\ajax\details;

use \PDO as PDO;

/**
 * Web Service.
 * Returns Trait information of a list of organism ids
 */
class TraitsOfOrganisms extends \fennecweb\WebService
{
    /**
     * @param $querydata[]
     * @returns organism id
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
