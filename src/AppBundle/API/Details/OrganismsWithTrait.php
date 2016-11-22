<?php

namespace AppBundle\API\Details;

use AppBundle\API\Webservice;
use \PDO as PDO;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Web Service.
 * Returns Organisms that posess a given trait
 */
class OrganismsWithTrait extends Webservice
{
    const DEFAULT_LIMIT = 100;

    /**
     * @param $query ParameterBag $query[type_cvterm_id] array of trait type_cvterm_id
     * @param $session SessionInterface|null
     * @returns array of organisms accoring to a specific trait type
     */
    public function execute(ParameterBag $query, SessionInterface $session = null)
    {
        $db = $this->getDbFromQuery($query);
        $trait_type_id = $query->get('trait_type_id');
        $limit = OrganismsWithTrait::DEFAULT_LIMIT;
        if ($query->has('limit')) {
            $limit = $query->get('limit');
        }
        
        $query_get_organism_by_trait = <<<EOF
SELECT *
    FROM organism, (SELECT DISTINCT fennec_id FROM trait_categorical_entry WHERE trait_type_id = :trait_type_id) AS ids
    WHERE organism.fennec_id = ids.fennec_id LIMIT :limit
EOF;
        $stm_get_organism_by_trait = $db->prepare($query_get_organism_by_trait);
        $stm_get_organism_by_trait->bindValue('trait_type_id', $trait_type_id);
        $stm_get_organism_by_trait->bindValue('limit', $limit);
        $stm_get_organism_by_trait->execute();
        
        $data = array();
        
        while ($row = $stm_get_organism_by_trait->fetch(PDO::FETCH_ASSOC)) {
            $result = array();
            $result['fennec_id'] = $row['fennec_id'];
            $result['scientific_name'] = $row['scientific_name'];
            $data[] = $result;
        }
        return $data;
        
    }
}
