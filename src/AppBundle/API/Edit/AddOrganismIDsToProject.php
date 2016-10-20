<?php

namespace AppBundle\API\Edit;

use AppBundle\API\Webservice;
use \PDO as PDO;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Web Service.
 * Add fennec_organism_id/fennec_assignment_method/fennec_dbversion as observation metadata
 * to provided project using the provided method (user has to be logged in and owner)
 *
 * possible methods are currently:
 *  - ncbi_taxid: It is searched for ncbi_taxid in metadata and the associated organism_id is retrieved from the db
 */
class AddOrganismIDsToProject extends Webservice
{
    const ERROR_UNKNOWN_METHOD = "Error: The provided method is unknown.";
    /**
    * @inheritdoc
    * <code>
    * array('dbversion'=>$dbversion, 'id'=>$id, 'method'=>$method);
    * </code>
    * @returns Array $result
    * <code>
    * array('success'=>$number_of_successful_mappings, 'total'=>$total_number_of_rows);
    * </code>
    */
    public function execute(ParameterBag $query, SessionInterface $session = null)
    {
        $db = $this->getDbFromQuery($query);
        $result = array('success' => 0, 'total' => 0);
        if (!$session->isStarted() || !$session->has('user')) {
            $result['error'] = Webservice::ERROR_NOT_LOGGED_IN;
        } else {
            $id = $query->get('id');
            $method = $query->get('method');
            if ($method === 'ncbi_taxid') {
                $service = $this->factory('details', 'projects');
                $details = $service->execute(new ParameterBag(array('dbversion' => $query->get('dbversion'), 'ids' => array($id))), $session);
                if (isset($details['error'])) {
                    $result['error'] = $details['error'];
                    return $result;
                }
                $biom = json_decode($details['projects'][$id]['biom'], true);
                $ncbi_ids = array();
                foreach ($biom['rows'] as $row) {
                    $result['total']++;
                    if (isset($row['metadata']['ncbi_taxid'])) {
                        $ncbi_ids[] = $row['metadata']['ncbi_taxid'];
                    }
                }
                if (count($ncbi_ids) === 0) {
                    return $result;
                }
                $placeholders = implode(',', array_fill(0, count($ncbi_ids), '?'));
                $query_get_id_mapping = <<<EOF
SELECT organism_id,accession 
    FROM organism_dbxref,dbxref
    WHERE organism_dbxref.dbxref_id=dbxref.dbxref_id 
        AND db_id=(SELECT db_id FROM db where name='DB:NCBI_taxonomy')
        AND accession IN ($placeholders)
EOF;
                $stm_get_id_mapping = $db->prepare($query_get_id_mapping);
                $stm_get_id_mapping->execute($ncbi_ids);
                $id_mapping = array();
                while ($row = $stm_get_id_mapping->fetch(PDO::FETCH_ASSOC)) {
                    $id_mapping[$row['accession']] = $row['organism_id'];
                }
                foreach ($biom['rows'] as &$row) {
                    if (isset($row['metadata']['ncbi_taxid']) && isset($id_mapping[$row['metadata']['ncbi_taxid']])) {
                        $row['metadata']['fennec_organism_id'] = $id_mapping[$row['metadata']['ncbi_taxid']];
                        $row['metadata']['fennec_assignment_method'] = 'ncbi_taxid';
                        $row['metadata']['fennec_dbversion'] = $query->get('dbversion');
                        $result['success']++;
                    }
                }
                $query_update_project = <<<EOF
UPDATE full_webuser_data SET project = ? WHERE webuser_data_id = ?
EOF;
                $stm_update_project = $db->prepare($query_update_project);
                $stm_update_project->execute(array(json_encode($biom), $id));
            } else {
                $result['error'] = AddOrganismIDsToProject::ERROR_UNKNOWN_METHOD;
                return $result;
            }
        }
        return $result;
    }
}
