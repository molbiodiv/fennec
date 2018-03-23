<?php

namespace AppBundle\API\Details;

use AppBundle\Entity\User\FennecUser;
use AppBundle\Entity\User\Project;
use AppBundle\Service\DBVersion;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\Criteria;

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
    public function execute($projectId, FennecUser $user = null)
    {
        $result = array('projects' => array());
        if ($user === null) {
            $result['error'] = Projects::ERROR_NOT_LOGGED_IN;
        } else {
            /**
             * @var $project Project
             */
            $project = $this->manager->getRepository('AppBundle:Project')->find($projectId);
            $criteria = Criteria::create()->where(Criteria::expr()->eq("project", $project));
            /**
             * @var $projectPermission Collection
             */
            $projectPermission = $user->getPermissions()->matching($criteria);
            if($projectPermission->isEmpty()){
                $result['error'] = Projects::PROJECT_NOT_FOUND_FOR_USER;
            } else {
                $result['projects'][$project->getId()] = array(
                    'biom' => json_encode($project->getProject()),
                    'import_date' => $project->getImportDate(),
                    'import_filename' => $project->getImportFilename()
                );
            }
        }
        return $result;
    }
}
