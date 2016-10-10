<?php

namespace fennecweb\ajax\details;

use \PDO as PDO;

/**
 * Web Service.
 * Returns Organisms with given ids
 */
class OrganismsWithTrait extends \fennecweb\WebService
{
    const DEFAULT_LIMIT = 5;

    /**
     * @param $querydata[type_cvterm_id] array of trait type_cvterm_id
     * @returns array of organisms accoring to a specific trait type
     */
    public function execute($querydata)
    {
        $db = $this->openDbConnection($querydata);
        $trait_type_id = $querydata['trait_type_id'];
        $limit = OrganismsWithTrait::DEFAULT_LIMIT;
        if (in_array('limit', array_keys($querydata))) {
            $limit = $querydata['limit'];
        }
        
        $query_get_organism_by_trait = <<<EOF
SELECT *
    FROM organism, (SELECT DISTINCT organism_id FROM trait_categorical_entry WHERE trait_type_id = :trait_type_id) AS ids
    WHERE organism.organism_id = ids.organism_id LIMIT :limit
EOF;
        $stm_get_organism_by_trait = $db->prepare($query_get_organism_by_trait);
        $stm_get_organism_by_trait->bindValue('trait_type_id', $trait_type_id);
        $stm_get_organism_by_trait->bindValue('limit', $limit);
        $stm_get_organism_by_trait->execute();
        
        $data = array();
        
        while ($row = $stm_get_organism_by_trait->fetch(PDO::FETCH_ASSOC)) {
            $result = array();
            $result['organism_id'] = $row['organism_id'];
            $result['scientific_name'] = $row['species'];
            $result['rank'] = $row['genus'];
            $result['common_name'] = $row['common_name'];
            if ($row["abbreviation"]!=null) {
                $result['rank']='species';
            }
            $data[] = $result;
        }
        return $data;
        
    }
}
