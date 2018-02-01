<?php
/**
 * Created by PhpStorm.
 * User: sonja
 * Date: 01.02.18
 * Time: 15:05
 */

namespace AppBundle\Validator\Constraints;


use Symfony\Component\Validator\Constraint;


/**
 * @Annotation
 */
class IsValidEmailForUser extends Constraint
{
    public $message = 'There exists no user for the email "{{ email }}"';
}