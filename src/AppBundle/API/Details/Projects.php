<?php

namespace AppBundle\API\Details;

use AppBundle\API\Webservice;
use AppBundle\Entity\WebuserData;
use AppBundle\Entity\FennecUser;
use AppBundle\Service\DBVersion;
use Symfony\Component\HttpFoundation\ParameterBag;

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
        $this->manager = $dbversion->getEntityManager();
    }


    /**
    * @inheritdoc
    * @returns array $result
    * <code>
    * array('project_id': {biomFile});
    * </code>
    */
    public function execute(ParameterBag $query, FennecUser $user = null)
    {
        $result = array('projects' => array());
        $ids = $query->get('ids');
        $em = $this->getManagerFromQuery($query);
        if ($user === null) {
            $result['error'] = Webservice::ERROR_NOT_LOGGED_IN;
        } else {
            $webuser = $em->find('AppBundle:FennecUser', $user->getId());
            if($webuser === null){
                $result['error'] = Projects::PROJECT_NOT_FOUND_FOR_USER;
            }
            $webuserData = $webuser->getData()->filter(function($data) use($ids){
                /** @var WebuserData $data */
                return in_array($data->getWebuserDataId(), $ids);
            });
            if (count($webuserData) < 1) {
                $result['error'] = Projects::PROJECT_NOT_FOUND_FOR_USER;
            }
            foreach ($webuserData as $project) {
                /** @var WebuserData $project */
                $result['projects'][$project->getWebuserDataId()] = array(
                    'biom' => json_encode($project->getProject()),
                    'import_date' => $project->getImportDate(),
                    'import_filename' => $project->getImportFilename()
                );
            }
        }
        return $result;
    }
}
