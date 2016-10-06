<?php

namespace fennecweb\ajax\details;

use \PDO as PDO;

/**
 * Web Service.
 * Returns all organisms ids of a project
 */
class OrganismsOfProject extends \fennecweb\WebService
{
    const ERROR_PROJECT_NOT_FOUND = 'Error: Project not found.';

    /**
     * @param $querydata[]
     * @returns Array $result
     * <code>
     * array('organism_id_1', 'organism_id_2');
     * </code>
     */
    public function execute($querydata)
    {
        $db = $this->openDbConnection($querydata);
        $result = array();
        if (!isset($_SESSION)) {
            session_start();
        }
        if (!isset($_SESSION['user'])) {
            $result['error'] = \fennecweb\WebService::ERROR_NOT_LOGGED_IN;
        } else {
            $query_get_rows= <<<EOF
SELECT
    project->'rows' AS rows
    FROM full_webuser_data 
    WHERE webuser_data_id = :internal_project_id AND provider = :provider AND oauth_id = :oauth_id
EOF;
            $stm_get_rows = $db->prepare($query_get_rows);
            $stm_get_rows->bindValue('internal_project_id', $querydata['internal_project_id']);
            $stm_get_rows->bindValue('provider', $_SESSION['user']['provider']);
            $stm_get_rows->bindValue('oauth_id', $_SESSION['user']['id']);
            $stm_get_rows->execute();

            if($stm_get_rows->rowCount() === 0){
                $result['error'] = OrganismsOfProject::ERROR_PROJECT_NOT_FOUND;
            }
        }
        return $result;
    }
}