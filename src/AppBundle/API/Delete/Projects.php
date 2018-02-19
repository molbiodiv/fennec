<?php

namespace AppBundle\API\Delete;

use AppBundle\Entity\User\WebuserData;
use AppBundle\Entity\User\FennecUser;
use AppBundle\Service\DBVersion;
use AppBundle\Entity\User\Permissions;

/**
 * Web Service.
 * Delete Project with given internal_ids from the database (user has to be logged in and owner)
 */
class Projects
{
    const ERROR_NOT_LOGGED_IN = "Error. You are not logged in.";

    private $manager;

    /**
     * Projects constructor.
     * @param $dbversion
     */
    public function __construct(DBVersion $dbversion)
    {
        $this->manager = $dbversion->getUserEntityManager();
    }


    /**
    * @inheritdoc
    * <code>
    * array('dbversion'=>$dbversion, 'ids'=>array($id1, $id2));
    * </code>
    * @returns array $result
    * <code>
    * array(array('project_id','import_date','OTUs','sample size'));
    * </code>
    */
    public function execute(FennecUser $user = null, $projectId, $attribute)
    {
        $result = array('deletedProjects' => 0);
        if ($user === null) {
            $result['error'] = Projects::ERROR_NOT_LOGGED_IN;
        } else {
            if($attribute === 'owner'){
                $permission = $this->manager->getRepository(Permissions::class)->findBy(array(
                    'webuserData' => $projectId
                ));
                foreach ($permission as $p){
                    $this->manager->remove($p);
                }
                $projects = $this->manager->getRepository(WebuserData::class)->findOneBy(array('webuser' => $user, 'webuserDataId' => $projectId));
                $this->manager->remove($projects);
            } else {
                $permission = $this->manager->getRepository(Permissions::class)->findOneBy(array(
                    'webuser' => $user,
                    'webuserData' => $projectId,
                    'permission' => $attribute
                ));
                $this->manager->remove($permission);
            }
            $this->manager->flush();
            $result['deletedProjects'] = 1;
        }
        return $result;
    }
}
