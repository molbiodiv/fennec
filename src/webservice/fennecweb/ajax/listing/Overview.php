<?php

namespace fennecweb\ajax\listing;

use \PDO as PDO;

/**
 * Web Service.
 * Returns information of all users projects
 */
class Overview extends \fennecweb\WebService
{
    /**
    * @param $querydata[]
    * @returns Array $result
    * <code>
    * array(
    *   "projects" => 5,
    *   "organisms" => 100000,
    *   "trait_entries" => 50000,
    *   "trait_types" => 20
    * );
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
            $result['projects'] = 0;
        } else {
            $query_get_user_projects = <<<EOF
SELECT
    COUNT(*)
    FROM full_webuser_data WHERE provider = :provider AND oauth_id = :oauth_id
EOF;
            $stm_get_user_projects = $db->prepare($query_get_user_projects);
            $stm_get_user_projects->bindValue('provider', $_SESSION['user']['provider']);
            $stm_get_user_projects->bindValue('oauth_id', $_SESSION['user']['id']);
            $stm_get_user_projects->execute();
        
            $row = $stm_get_user_projects->fetch(PDO::FETCH_ASSOC);
            $result['projects'] = $row['count'];
        }
        return $result;
    }
}