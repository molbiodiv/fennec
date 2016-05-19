<?php

namespace fennecweb\ajax\listing;

use \PDO as PDO;

/**
 * Web Service.
 * Returns information of all users projects
 */
class Projects extends \fennecweb\WebService
{
    const ERROR_NOT_LOGGED_IN = "Error. Not logged in.";
    
    private $db;
    /**
    * @param $querydata[]
    * @returns Array $result
    * <code>
    * array(array('project_id','import_date','OTUs','sample size'));
    * </code>
    */
    public function execute($querydata)
    {
        $db = $this->openDbConnection($querydata);
        $result = array();
        if (!isset($_SESSION['user'])) {
            $result = array("error" => Projects::ERROR_NOT_LOGGED_IN);
        }
        return $result;
    }
}
