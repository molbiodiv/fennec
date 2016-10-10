<?php

namespace fennecweb\ajax\details;

use \PDO as PDO;

/**
 * Web Service.
 * Returns a project according to the project ID.
 */
class Projects extends \fennecweb\WebService
{
    const PROJECT_NOT_FOUND_FOR_USER = "Error: At least one project could not be found for the current user.";
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
        $result = array('projects' => array());
        $ids = $querydata['ids'];
        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        if (!isset($_SESSION)) {
            session_start();
        }
        if (!isset($_SESSION['user'])) {
            $result['error'] = \fennecweb\Webservice::ERROR_NOT_LOGGED_IN;
        } else {
            $query_get_project_details = <<<EOF
SELECT webuser_data_id, project FROM full_webuser_data 
    WHERE provider = ? AND oauth_id = ? AND webuser_data_id IN ($placeholders)
EOF;
            $stm_get_project_details = $db->prepare($query_get_project_details);
            $stm_get_project_details->execute(
                array_merge(array($_SESSION['user']['provider'], $_SESSION['user']['id']), $ids)
            );
            if ($stm_get_project_details->rowCount() < 1) {
                $result['error'] = Projects::PROJECT_NOT_FOUND_FOR_USER;
            }
            while ($row = $stm_get_project_details->fetch(PDO::FETCH_ASSOC)) {
                $result['projects'][$row['webuser_data_id']] = $row['project'];
            }
        }
        return $result;
    }
}
