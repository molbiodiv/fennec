<?php
/**
 * Created by PhpStorm.
 * User: sonja
 * Date: 1/26/18
 * Time: 10:30 AM
 */

namespace AppBundle\API\Sharing;


use AppBundle\Entity\FennecUser;
use AppBundle\Entity\Permissions;
use AppBundle\Entity\WebuserData;
use AppBundle\Service\DBVersion;

class Projects
{
    private $manager;

    const ERROR_NOT_LOGGED_IN = "Error. You are not logged in.";

    /**
     * Projects constructor.
     * @param $dbversion
     */
    public function __construct(DBVersion $dbversion)
    {
        $this->manager = $dbversion->getEntityManager();
    }

    public function execute($email, $projectId, $action){
        $user = $this->manager->getRepository(FennecUser::class)->findOneBy(array(
            'email' => $email
        ));
        $project = $this->manager->getRepository(WebuserData::class)->findOneBy(array(
            'webuserDataId' => $projectId
        ));
        $permission = new Permissions();
        $permission->setWebuser($user);
        $permission->setWebuserData($project);
        $permission->setPermission($action);
        $this->manager->persist($permission);
        $this->manager->flush();
        $message = "The permission '".$action."' of project ".$projectId." was granted to ".$user->getUsername()." successfully.";
        return $message;
    }
}