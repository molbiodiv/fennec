<?php
/**
 * Created by PhpStorm.
 * User: sonja
 * Date: 1/26/18
 * Time: 10:30 AM
 */

namespace AppBundle\API\Sharing;


use AppBundle\Service\DBVersion;

class Projects
{
    private $manager;

    /**
     * Projects constructor.
     * @param $dbversion
     */
    public function __construct(DBVersion $dbversion)
    {
        $this->manager = $dbversion->getEntityManager();
    }


}