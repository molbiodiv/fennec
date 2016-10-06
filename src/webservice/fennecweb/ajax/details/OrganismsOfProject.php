<?php

namespace fennecweb\ajax\details;

use \PDO as PDO;

/**
 * Web Service.
 * Returns all organisms ids of a project
 */
class OrganismsOfProject extends \fennecweb\WebService
{
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
            $query_get_organisms_of_project = <<<EOF
SELECT
    webuser_data_id,
    import_date,project->>'id' AS id,
    project->'shape'->>0 AS rows,
    project->'shape'->>1 AS columns,
    import_filename
    FROM full_webuser_data WHERE provider = :provider AND oauth_id = :oauth_id
EOF;
        }
        return $result;
    }
}