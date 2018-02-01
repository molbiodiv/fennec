<?php

namespace AppBundle\Validator\Constraints;


use Symfony\Component\Validator\Constraint;


/**
 * @Annotation
 */
class IsValidEmailForUser extends Constraint
{
    public $message = 'There exists no user for the email "{{ email }}"';
}