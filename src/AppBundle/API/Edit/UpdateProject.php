<?php

namespace AppBundle\API\Edit;


use AppBundle\API\Webservice;
use AppBundle\AppBundle;
use AppBundle\Entity\FennecUser;
use AppBundle\Entity\WebuserData;
use AppBundle\Service\DBVersion;
use Symfony\Component\HttpFoundation\ParameterBag;

class UpdateProject
{
    private $manager;

    /**
     * UpdateProject constructor.
     * @param $dbversion
     */
    public function __construct(DBVersion $dbversion)
    {
        $this->manager = $dbversion->getEntityManager();
    }


    /**
     * @inheritdoc
     */
    public function execute(FennecUser $user = null)
    {
        $project_id = $_REQUEST['project_id'];
        $biom = $_REQUEST['biom'];
        if($biom === null || $project_id === null){
            return array('error' => 'Missing parameter "biom" or "project_id"');
        }
        if($user == null){
            return array('error' => 'User not logged in');
        }
        if($user === null){
            return array('error' => 'Could not update project. Not found for user.');
        }
        $project = $this->manager->getRepository(WebuserData::class)->findOneBy(array('webuser' => $user, 'webuserDataId' => $project_id));
        if($project === null){
            return array('error' => 'Could not update project. Not found for user.');
        }
        $project->setProject(json_decode($biom, true));
        $this->manager->persist($project);
        $this->manager->flush();
        return array('error' => null);
    }
}