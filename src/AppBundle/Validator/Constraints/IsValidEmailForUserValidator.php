<?php

namespace AppBundle\Validator\Constraints;

use AppBundle\Entity\FennecUser;
use AppBundle\Service\DBVersion;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

class IsValidEmailForUserValidator extends ConstraintValidator
{

    private $manager;

    /**
     * IsValidEmailForUserValidator constructor.
     * @param $dbversion
     */
    public function __construct(DBVersion $dbversion)
    {
        $this->manager = $dbversion->getEntityManager();
    }


    public function validate($value, Constraint $constraint)
    {
        $user = $this->manager->getRepository(FennecUser::class)->findOneBy(array(
            'email' => $value
        ));
        if ($user === null) {
            $this->context->buildViolation($constraint->message)
                ->setParameter('{{ email }}', $value)
                ->addViolation();
        }
    }
}