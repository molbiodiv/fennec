<?php

namespace AppBundle\API\Details;

use AppBundle\API\Webservice;
use AppBundle\Entity\User\FennecUser;
use AppBundle\Service\DBVersion;
use Doctrine\Common\Collections\Criteria;

/**
 * Web Service.
 * Returns all fennec_ids of a project
 */
class OrganismsOfProject
{
    const ERROR_PROJECT_NOT_FOUND = 'Error: Project not found.';
    const ERROR_NOT_LOGGED_IN = 'Error: User not logged in.';

    private $manager;
    private $dbversion;

    /**
     * OrganismsOfProject constructor.
     * @param $dbversion
     */
    public function __construct(DBVersion $dbversion)
    {
        $this->manager = $dbversion->getUserEntityManager();
        $this->dbversion = $dbversion->getConnectionName();
    }


    /**
     * @inheritdoc
     * @param FennecUser $user
     * @returns array $result
     * <code>
     * array('fennec_id_1', 'fennec_id_2');
     * </code>
     */
    public function execute($projectId, $dimension, $user)
    {
        $result = array();
        if ($user === null) {
            $result['error'] = OrganismsOfProject::ERROR_NOT_LOGGED_IN;
        } else {
            $permissionCollection = $user->getPermissions();
            $project = $this->manager->getRepository('AppBundle:Project')->find($projectId);
            $criteria = Criteria::create()->where(Criteria::expr()->eq("project", $project));
            $projectPermission = $permissionCollection->matching($criteria);

            if($projectPermission->isEmpty()){
                $result['error'] = OrganismsOfProject::ERROR_PROJECT_NOT_FOUND;
            } else {
                $entries = $project->getProject()[$dimension];
                $fennec_ids = array();
                foreach ($entries as $entry){
                    if (key_exists('metadata', $entry)){
                        if (is_array($entry['metadata']) and key_exists('fennec', $entry['metadata'])) {
                            $fennec = json_decode($entry['metadata']['fennec'], true);
                            if(is_array($fennec) and
                                key_exists($this->dbversion, $fennec) and
                                is_array($fennec[$this->dbversion]) and
                                key_exists('fennec_id', $fennec[$this->dbversion]) and
                                $fennec[$this->dbversion]['fennec_id'] !== null
                            ){
                                array_push($fennec_ids, $fennec[$this->dbversion]['fennec_id']);
                            }
                        }
                    }
                }
                $result = array_unique($fennec_ids);
            }
        }
        return $result;
    }
}