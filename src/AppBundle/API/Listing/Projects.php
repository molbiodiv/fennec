<?php

namespace AppBundle\API\Listing;

use AppBundle\Entity\User\WebuserData;
use AppBundle\Entity\User\FennecUser;
use AppBundle\Service\DBVersion;

/**
 * Web Service.
 * Returns information of all users projects
 */
class Projects
{
    const ERROR_NOT_LOGGED_IN = "Error: You are not logged in.";

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
    * @returns array $result
    * <code>
    * array(array('project_id','import_date','OTUs','sample size'));
    * </code>
    */
    public function execute(FennecUser $user = null)
    {
        $result = array('data' => array());
        if ($user == null) {
            $result['error'] = Projects::ERROR_NOT_LOGGED_IN;
        } else {
            $projects = $this->manager->getRepository(WebuserData::class)->getDataForUser($user);
            foreach ($projects as $p) {
                $project = array();
                $project['internal_project_id'] = $p['webuserDataId'];
                $data = $p['project'];
                $project['id'] = $data['id'];
                $project['import_date'] = $p['importDate']->format('Y-m-d H:i:s');
                $project['rows'] = $data['shape'][0];
                $project['columns'] = $data['shape'][1];
                $project['import_filename'] = $p['importFilename'];
                $project['permissionStatus'] = $p['permission'];
                $result['data'][] = $project;
            }
        }
        return $result;
    }
}
