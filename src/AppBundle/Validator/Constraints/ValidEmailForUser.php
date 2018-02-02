<?php
/**
 * Created by PhpStorm.
 * User: sonja
 * Date: 2/2/18
 * Time: 10:22 AM
 */

namespace AppBundle\Validator\Constraints;


use AppBundle\Entity\FennecUser;
use AppBundle\Service\DBVersion;

class ValidEmailForUser
{
    private $manager;

    /**
     * ValidEmailForUser constructor.
     * @param $dbversion
     */
    public function __construct(DBVersion $dbversion)
    {
        $this->manager = $dbversion->getEntityManager();
    }

    public function execute($email){
        $user = $this->manager->getRepository(FennecUser::class)->findOneBy(array(
            'email' => $email
        ));
        $errorMessage = null;
        if ($user === null){
            $errorMessage = 'There exists no user for the email: '.$email;
        }
        return $errorMessage;
    }
}