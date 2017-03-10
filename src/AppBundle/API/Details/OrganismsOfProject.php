<?php

namespace AppBundle\API\Details;

use AppBundle\API\Webservice;
use AppBundle\User\FennecUser;
use \PDO as PDO;
use Symfony\Component\HttpFoundation\ParameterBag;

/**
 * Web Service.
 * Returns all fennec_ids of a project
 */
class OrganismsOfProject extends Webservice
{
    const ERROR_PROJECT_NOT_FOUND = 'Error: Project not found.';

    /**
     * @inheritdoc
     * @returns array $result
     * <code>
     * array('fennec_id_1', 'fennec_id_2');
     * </code>
     */
    public function execute(ParameterBag $query, FennecUser $user = null)
    {
        $manager = $this->getManagerFromQuery($query);
        $dbversion = $query->get('dbversion');
        $result = array();
        if ($user === null) {
            $result['error'] = Webservice::ERROR_NOT_LOGGED_IN;
        } else {
            $provider = $manager->getRepository('AppBundle:OauthProvider')->findOneBy(array(
                'provider' => $user->getProvider()
            ));
            $user = $manager->getRepository('AppBundle:Webuser')->findOneBy(array(
                'oauthId' => $user->getId(),
                'oauthProvider' => $provider
            ));
            $project = $manager->getRepository('AppBundle:WebuserData')->findOneBy(array(
                'webuser' => $user,
                'webuserDataId' => $query->get('internal_project_id')
            ));

            if($project === null){
                $result['error'] = OrganismsOfProject::ERROR_PROJECT_NOT_FOUND;
            } else {
                $rows = $project->getProject()['rows'];
                $fennec_ids = array();
                foreach ($rows as $row){
                    if (key_exists('metadata', $row)){
                        if (is_array($row['metadata']) and key_exists('fennec', $row['metadata'])) {
                            $fennec = json_decode($row['metadata']['fennec'], true);
                            if(is_array($fennec) and
                                key_exists($dbversion, $fennec) and
                                is_array($fennec[$dbversion]) and
                                key_exists('fennec_id', $fennec[$dbversion]) and
                                $fennec[$dbversion]['fennec_id'] !== null
                            ){
                                array_push($fennec_ids, $fennec[$dbversion]['fennec_id']);
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