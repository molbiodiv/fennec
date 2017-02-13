<?php

namespace AppBundle\API\Details;

use AppBundle\API\Webservice;
use AppBundle\User\FennecUser;
use \PDO as PDO;
use Symfony\Component\HttpFoundation\ParameterBag;

/**
 * Web Service.
 * Returns all fennec_ids of a project
 */
class OrganismsOfProject extends Webservice
{
    const ERROR_PROJECT_NOT_FOUND = 'Error: Project not found.';

    /**
     * @inheritdoc
     * @returns array $result
     * <code>
     * array('fennec_id_1', 'fennec_id_2');
     * </code>
     */
    public function execute(ParameterBag $query, FennecUser $user = null)
    {
        $db = $this->getManagerFromQuery($query)->getConnection();
        $dbversion = $query->get('dbversion');
        $result = array();
        if ($user === null) {
            $result['error'] = Webservice::ERROR_NOT_LOGGED_IN;
        } else {
            $query_get_rows= <<<EOF
SELECT
    project->'rows' AS rows
    FROM full_webuser_data 
    WHERE webuser_data_id = :internal_project_id AND provider = :provider AND oauth_id = :oauth_id
EOF;
            $stm_get_rows = $db->prepare($query_get_rows);
            $stm_get_rows->bindValue('internal_project_id', $query->get('internal_project_id'));
            $stm_get_rows->bindValue('provider', $user->getProvider());
            $stm_get_rows->bindValue('oauth_id', $user->getId());
            $stm_get_rows->execute();

            if($stm_get_rows->rowCount() === 0){
                $result['error'] = OrganismsOfProject::ERROR_PROJECT_NOT_FOUND;
            } else {
                $rows = $stm_get_rows->fetch(PDO::FETCH_ASSOC)['rows'];
                $rows = json_decode($rows, true);
                $fennec_ids = array();
                foreach ($rows as $row){
                    if (key_exists('metadata', $row)){
                        if (is_array($row['metadata']) and key_exists('fennec', $row['metadata'])) {
                            $fennec = json_decode($row['metadata']['fennec'], true);
                            if(is_array($fennec) and
                                key_exists($dbversion, $fennec) and
                                is_array($fennec[$dbversion]) and
                                key_exists('fennec_id', $fennec[$dbversion]) and
                                $fennec[$dbversion]['fennec_id'] !== null
                            ){
                                array_push($fennec_ids, $fennec[$dbversion]['fennec_id']);
                            }
                        }
                    }
                }
                $result = array_unique($fennec_ids);
            }
        }
        return $result;
    }
}