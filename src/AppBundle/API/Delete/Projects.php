<?php

namespace AppBundle\API\Delete;

use AppBundle\API\Webservice;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Web Service.
 * Delete Project with given internal_ids from the database (user has to be logged in and owner)
 */
class Projects extends Webservice
{
    /**
    * @inheritdoc
    * <code>
    * array('dbversion'=>$dbversion, 'ids'=>array($id1, $id2));
    * </code>
    * @returns Array $result
    * <code>
    * array(array('project_id','import_date','OTUs','sample size'));
    * </code>
    */
    public function execute(ParameterBag $query, SessionInterface $session = null)
    {
        $db = $this->getDbFromQuery($query);
        $result = array('deletedProjects' => 0);
        if (!$session->isStarted() || !$session->has('user')) {
            $result['error'] = Webservice::ERROR_NOT_LOGGED_IN;
        } else {
            $ids = $query->get('ids');
            $placeholders = implode(',', array_fill(0, count($ids), '?'));
            $query_get_user_projects = <<<EOF
DELETE FROM full_webuser_data WHERE provider = ? AND oauth_id = ? and webuser_data_id IN ($placeholders)
EOF;
            $stm_get_user_projects = $db->prepare($query_get_user_projects);
            $stm_get_user_projects->execute(
                array_merge(array($session->get('user')['provider'], $session->get('user')['id']), $ids)
            );
        
            $result['deletedProjects'] = $stm_get_user_projects->rowCount();
        }
        return $result;
    }
}
