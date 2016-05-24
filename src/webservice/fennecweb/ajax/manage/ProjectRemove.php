<?php

namespace fennecweb\ajax\manage;

use \PDO as PDO;

/**
 * Web Service.
 * Remove Project with given internal_ids from the database (user has to be logged in and owner)
 */
class ProjectRemove extends \fennecweb\WebService
{
    /**
    * @param $querydata[]
    * <code>
    * array('dbversion'=>$dbversion, 'ids'=>array($id1, $id2));
    * </code>
    * @returns Array $result
    * <code>
    * array(array('project_id','import_date','OTUs','sample size'));
    * </code>
    */
    public function execute($querydata)
    {
        $db = $this->openDbConnection($querydata);
        $result = array('removedProjects' => 0);
        if (!isset($_SESSION)) {
            session_start();
        }
        if (!isset($_SESSION['user'])) {
            $result['error'] = \fennecweb\ajax\listing\Projects::ERROR_NOT_LOGGED_IN;
        } else {
            $ids = $querydata['ids'];
            $placeholders = implode(',', array_fill(0, count($ids), '?'));
            $query_get_user_projects = <<<EOF
DELETE FROM full_webuser_data WHERE provider = ? AND oauth_id = ? and webuser_data_id IN ($placeholders)
EOF;
            $stm_get_user_projects = $db->prepare($query_get_user_projects);
            $stm_get_user_projects->execute(array_merge(array($_SESSION['user']['provider'], $_SESSION['user']['id']), $ids));
        
            $result['removedProjects'] = $stm_get_user_projects->rowCount();
        }
        return $result;
    }
}