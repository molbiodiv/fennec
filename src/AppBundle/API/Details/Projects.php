<?php

namespace AppBundle\API\Details;

use AppBundle\Entity\User\FennecUser;
use AppBundle\Entity\User\Project;
use AppBundle\Service\DBVersion;

/**
 * Web Service.
 * Returns a project according to the project ID.
 */
class Projects
{
    const PROJECT_NOT_FOUND_FOR_USER = "Error: At least one project could not be found for the current user.";
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
    * array('project_id': {biomFile});
    * </code>
    */
    public function execute($project_id, FennecUser $user = null)
    {
        $result = array('projects' => array());
        if ($user === null) {
            $result['error'] = Projects::ERROR_NOT_LOGGED_IN;
        } else {
            $user = $this->manager->find('AppBundle:FennecUser', $user->getId());
            if($user === null){
                $result['error'] = Projects::PROJECT_NOT_FOUND_FOR_USER;
            }
            $userId = $user->getId();
            $userData = $this->manager->getRepository(Project::class)->getDataByProjectId($project_id);
            if (count($userData) < 1) {
                $result['error'] = Projects::PROJECT_NOT_FOUND_FOR_USER;
            }
            foreach ($userData as $project) {
                /** @var Projects $project */
                $result['projects'][$project['webuserDataId']] = array(
                    'biom' => json_encode($project['project']),
                    'import_date' => $project['importDate'],
                    'import_filename' => $project['importFilename']
                );
            }
        }
        return $result;
    }
}
