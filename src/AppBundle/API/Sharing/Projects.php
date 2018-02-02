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
use Symfony\Component\Validator\Validation;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Email;

class Projects
{
    private $manager;

    const ERROR_NOT_LOGGED_IN = "Error. You are not logged in.";
    const ERROR_PERMISSION_EXISTS = "Error. The permission for the user and the project exists.";

    /**
     * Projects constructor.
     * @param $dbversion
     */
    public function __construct(DBVersion $dbversion)
    {
        $this->manager = $dbversion->getEntityManager();
    }

    public function execute($email, $projectId, $action){
        $validator = Validation::createValidator();
        $violations = $validator->validate($email, array(
            new Email(),
            new NotBlank()
        ));
        if(count($violations) > 0){
            $errorMessage = (string) $violations;
            return $response = [
                'error' => true,
                'message' => $errorMessage
            ];
        }
        $user = $this->manager->getRepository(FennecUser::class)->findOneBy(array(
            'email' => $email
        ));
        if($user === null){
            return $response = [
                'error' => true,
                'message'=> 'There exists no user for the email: '.$email
            ];
        }
        $project = $this->manager->getRepository(WebuserData::class)->findOneBy(array(
            'webuserDataId' => $projectId
        ));
        $permission = $this->manager->getRepository(Permissions::class)->findOneBy(array(
            'webuser' => $user->getId(),
            'webuserData' => $projectId,
            'permission' => $action
        ));
        if($permission !== null){
            return $response = [
                'error' => true,
                'message'=> Projects::ERROR_PERMISSION_EXISTS
            ];
        }
        $permission = new Permissions();
        $permission->setWebuser($user);
        $permission->setWebuserData($project);
        $permission->setPermission($action);
        $this->manager->persist($permission);
        $this->manager->flush();
        return $response = [
            'error' => false,
            'message' => "The permission '".$action."' of project ".$projectId." was granted to ".$user->getUsername()." successfully."
        ];
    }
}