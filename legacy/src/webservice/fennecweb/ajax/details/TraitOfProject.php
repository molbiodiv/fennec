<?php

namespace fennecweb\ajax\details;

use \PDO as PDO;
use \fennecweb\WebService as WebService;

/**
 * Web Service.
 * Return trait details of project
 */
class TraitOfProject extends WebService
{

    /**
     * @param $querydata[]
     * @returns Array $result
     * see output of details/Traits.php
     */
    public function execute($querydata)
    {
        $db = $this->openDbConnection($querydata);
        list($service) = WebService::factory('details/OrganismsOfProject');
        $results = ($service->execute(array('dbversion' => $querydata['dbversion'], 'internal_project_id' => $querydata['internal_project_id'])));
        if (key_exists('error', $results)){
            return $results;
        }
        list($service) = WebService::factory('details/Traits');
        $results = ($service->execute(array('dbversion' => $querydata['dbversion'], 'trait_type_id' => $querydata['trait_type_id'], 'organism_ids' => $results)));

        return $results;
    }
}