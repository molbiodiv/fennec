<?php

namespace AppBundle\API\Details;

use AppBundle\API\Webservice;
use AppBundle\User\FennecUser;
use \PDO as PDO;
use Symfony\Component\HttpFoundation\ParameterBag;

/**
 * Web Service.
 * Returns a project according to the project ID.
 */
class Projects extends Webservice
{
    const PROJECT_NOT_FOUND_FOR_USER = "Error: At least one project could not be found for the current user.";
    /**
    * @inheritdoc
    * @returns array $result
    * <code>
    * array('project_id': {biomFile});
    * </code>
    */
    public function execute(ParameterBag $query, FennecUser $user = null)
    {
        $db = $this->getDbFromQuery($query);
        $result = array('projects' => array());
        $ids = $query->get('ids');
        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        if ($user === null) {
            $result['error'] = Webservice::ERROR_NOT_LOGGED_IN;
        } else {
            $query_get_project_details = <<<EOF
SELECT webuser_data_id, project, import_date, import_filename FROM full_webuser_data 
    WHERE provider = ? AND oauth_id = ? AND webuser_data_id IN ($placeholders)
EOF;
            $stm_get_project_details = $db->prepare($query_get_project_details);
            $stm_get_project_details->execute(
                array_merge(array($user->getProvider(), $user->getId()), $ids)
            );
            if ($stm_get_project_details->rowCount() < 1) {
                $result['error'] = Projects::PROJECT_NOT_FOUND_FOR_USER;
            }
            while ($row = $stm_get_project_details->fetch(PDO::FETCH_ASSOC)) {
                $result['projects'][$row['webuser_data_id']] = array(
                    'biom' => $row['project'],
                    'import_date' => $row['import_date'],
                    'import_filename' => $row['import_filename']
                );
            }
        }
        return $result;
    }
}
