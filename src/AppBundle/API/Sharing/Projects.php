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
        $permission = new Permissions();
        $permission->setWebuser($user);
        $permission->setWebuserData($projectId);
        $permission->setPermission($action);
        $this->manager->persist($permission);
        $this->manager->flush();
        $message = "The permission was setted successfully";
        return $message;
    }
}