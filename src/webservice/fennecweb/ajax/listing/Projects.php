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
        if (!isset($_SESSION)) {
            session_start();
        }
        if (!isset($_SESSION['user'])) {
            $result = array("error" => Projects::ERROR_NOT_LOGGED_IN);
        } else {
            $query_get_user_projects = <<<EOF
SELECT webuser_data_id,import_date,project->>'id' AS id,project->'shape'->>0 AS rows,project->'shape'->>1 AS columns 
    FROM full_webuser_data WHERE provider = :provider AND oauth_id = :oauth_id
EOF;
            $stm_get_user_projects = $db->prepare($query_get_user_projects);
            $stm_get_user_projects->bindValue('provider', $_SESSION['user']['provider']);
            $stm_get_user_projects->bindValue('oauth_id', $_SESSION['user']['id']);
            $stm_get_user_projects->execute();
        
            while ($row = $stm_get_user_projects->fetch(PDO::FETCH_ASSOC)) {
                $project = array();
                $project['internal_project_id'] = $row['webuser_data_id'];
                $project['id'] = $row['id'];
                $project['import_date'] = $row['import_date'];
                $project['rows'] = $row['rows'];
                $project['columns'] = $row['columns'];
                $result[] = $project;
            }
        }
        return $result;
    }
}
