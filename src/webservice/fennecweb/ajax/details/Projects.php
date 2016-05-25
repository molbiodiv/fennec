<?php

namespace fennecweb\ajax\details;

use \PDO as PDO;

/**
 * Web Service.
 * Returns a project according to the project ID.
 */
class Projects extends \fennecweb\WebService
{
    /**
    * @param $querydata[]
    * @returns Array $result
    * <code>
    * array('project_id': {biomfile});
    * </code>
    */
    public function execute($querydata)
    {
        $db = $this->openDbConnection($querydata);
        $result = array('data' => array());
        return $result;
    }
}
