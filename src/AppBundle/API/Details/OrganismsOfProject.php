<?php

namespace AppBundle\API\Details;

use AppBundle\API\Webservice;
use \PDO as PDO;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Web Service.
 * Returns all organisms ids of a project
 */
class OrganismsOfProject extends Webservice
{
    const ERROR_PROJECT_NOT_FOUND = 'Error: Project not found.';

    /**
     * @inheritdoc
     * @returns Array $result
     * <code>
     * array('organism_id_1', 'organism_id_2');
     * </code>
     */
    public function execute(ParameterBag $query, SessionInterface $session = null)
    {
        $db = $this->getDbFromQuery($query);
        $result = array();
        if ($session === null || !$session->isStarted() || !$session->has('user')) {
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
            $stm_get_rows->bindValue('provider', $session->get('user')['provider']);
            $stm_get_rows->bindValue('oauth_id', $session->get('user')['id']);
            $stm_get_rows->execute();

            if($stm_get_rows->rowCount() === 0){
                $result['error'] = OrganismsOfProject::ERROR_PROJECT_NOT_FOUND;
            } else {
                $rows = $stm_get_rows->fetch(PDO::FETCH_ASSOC)['rows'];
                $rows = json_decode($rows, true);
                $organism_ids = array();
                foreach ($rows as $row){
                    if (key_exists('metadata', $row)){
                        if (key_exists('fennec_organism_id', $row['metadata']) and $row['metadata']['fennec_organism_id'] !== null){
                            array_push($organism_ids, $row['metadata']['fennec_organism_id']);
                        }
                    }
                }
                $result = array_unique($organism_ids);
            }
        }
        return $result;
    }
}