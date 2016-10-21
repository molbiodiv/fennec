<?php

namespace AppBundle\API\Edit;


use AppBundle\API\Webservice;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class UpdateProject extends Webservice
{
    /**
     * @inheritdoc
     */
    public function execute(ParameterBag $query, SessionInterface $session = null)
    {
        $db = $this->getDbFromQuery($query);
        if(!$query->has('biom') || !$query->has('project_id')){
            return array('error' => 'Missing parameter "biom" or "project_id"');
        }
        if($session == null || !$session->has('user')){
            return array('error' => 'User not logged in');
        }
        $query_update_project = <<<EOF
UPDATE full_webuser_data SET project = ? WHERE webuser_data_id = ? AND oauth_id = ? AND provider = ?
EOF;
        $stm_update_project = $db->prepare($query_update_project);
        $stm_update_project->execute(array(
            $query->get('biom'),
            $query->get('project_id'),
            $session->get('user')['id'],
            $session->get('user')['provider']
        ));
        $updates = $stm_update_project->rowCount();
        if($updates != 1){
            return array('error' => 'Could not update project. Not found for user.');
        }
        return array('error' => null);
    }
}