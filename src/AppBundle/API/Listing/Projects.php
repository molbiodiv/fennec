<?php

namespace AppBundle\API\Listing;

use AppBundle\API\Webservice;
use AppBundle\Entity\WebuserData;
use AppBundle\User\FennecUser;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\HttpFoundation\ParameterBag;

/**
 * Web Service.
 * Returns information of all users projects
 */
class Projects extends Webservice
{
    /**
    * @inheritdoc
    * @returns array $result
    * <code>
    * array(array('project_id','import_date','OTUs','sample size'));
    * </code>
    */
    public function execute(ParameterBag $query, FennecUser $user = null)
    {
        $em = $this->getManagerFromQuery($query);
        $result = array('data' => array());
        if ($user == null) {
            $result['error'] = Webservice::ERROR_NOT_LOGGED_IN;
        } else {
            $webuser = $user->getWebuser($em);
            if($webuser !== null) {
                /**
                 * @var Collection
                 */
                $projects = $webuser->getData();

                foreach ($projects as $p) {
                    /** @var WebuserData $p */
                    $project = array();
                    $project['internal_project_id'] = $p->getWebuserDataId();
                    $data = $p->getProject();
                    $project['id'] = $data['id'];
                    $project['import_date'] = $p->getImportDate()->format('Y-m-d H:i:s');
                    $project['rows'] = $data['shape'][0];
                    $project['columns'] = $data['shape'][1];
                    $project['import_filename'] = $p->getImportFilename();
                    $result['data'][] = $project;
                }
            }
        }
        return $result;
    }
}
