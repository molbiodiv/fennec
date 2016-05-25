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
        $result = array();
        $project_id = $querydata['id'];
        if (!isset($_SESSION)) {
            session_start();
        }
        $query_get_project_details = <<<EOF
SELECT project FROM full_webuser_data 
    WHERE webuser_data_id = :project_id AND provider = :provider AND oauth_id = :oauth_id
EOF;
        $stm_get_project_details = $db->prepare($query_get_project_details);
        $stm_get_project_details->bindValue('project_id', $project_id);
        $stm_get_project_details->bindValue('provider', $_SESSION['user']['provider']);
        $stm_get_project_details->bindValue('oauth_id', $_SESSION['user']['id']);
        $stm_get_project_details->execute();

        while ($row = $stm_get_project_details->fetch(PDO::FETCH_ASSOC)) {
            $result[$project_id] = $row['project'];
        }
        return $result;
    }
}
