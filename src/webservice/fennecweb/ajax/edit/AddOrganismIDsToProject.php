<?php

namespace fennecweb\ajax\edit;

use \PDO as PDO;

/**
 * Web Service.
 * Add fennec_organism_id/fennec_assignment_method/fennec_dbversion as observation metadata 
 * to provided project using the provided method (user has to be logged in and owner)
 * 
 * possible methods are currently:
 *  - ncbi_taxid: It is searched for ncbi_taxid in metadata and the associated organism_id is retrieved from the db
 */
class AddOrganismIDsToProject extends \fennecweb\WebService
{
    const ERROR_UNKNOWN_METHOD = "Error: The provided method is unknown.";
    /**
    * @param $querydata[]
    * <code>
    * array('dbversion'=>$dbversion, 'id'=>$id, 'method'=>$method);
    * </code>
    * @returns Array $result
    * <code>
    * array('success'=>$number_of_successful_mappings, 'total'=>$total_number_of_rows);
    * </code>
    */
    public function execute($querydata)
    {
        $db = $this->openDbConnection($querydata);
        $result = array('success' => 0, 'total' => 0);
        if (!isset($_SESSION)) {
            session_start();
        }
        if (!isset($_SESSION['user'])) {
            $result['error'] = \fennecweb\WebService::ERROR_NOT_LOGGED_IN;
        } else {
            $id = $querydata['id'];
            $method = $querydata['method'];
            if($method === 'ncbi_taxid') {
                
            } else {
                $result['error'] = AddOrganismIDsToProject::ERROR_UNKNOWN_METHOD;
            }
        }
        return $result;
    }
}
