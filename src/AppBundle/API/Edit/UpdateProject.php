<?php

namespace AppBundle\API\Edit;


use AppBundle\API\Webservice;
use AppBundle\User\FennecUser;
use Symfony\Component\HttpFoundation\ParameterBag;

class UpdateProject extends Webservice
{
    /**
     * @inheritdoc
     */
    public function execute(ParameterBag $query, FennecUser $user = null)
    {
        $em = $this->getManagerFromQuery($query);
        if(!$query->has('biom') || !$query->has('project_id')){
            return array('error' => 'Missing parameter "biom" or "project_id"');
        }
        if($user == null){
            return array('error' => 'User not logged in');
        }
        $webuser = $user->getWebuser($em);
        if($webuser === null){
            return array('error' => 'Could not update project. Not found for user.');
        }
        $project = $em->getRepository('AppBundle:WebuserData')->findOneBy(array('webuser' => $webuser, 'webuserDataId' => $query->get('project_id')));
        if($project === null){
            return array('error' => 'Could not update project. Not found for user.');
        }
        $project->setProject(json_decode($query->get('biom')));
        return array('error' => null);
    }
}