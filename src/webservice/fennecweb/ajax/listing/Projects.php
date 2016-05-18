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
    
    public function execute($querydata)
    {
        $result = array();
        return $result;
    }
}
