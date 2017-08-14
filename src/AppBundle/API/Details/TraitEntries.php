<?php

namespace AppBundle\API\Details;

use AppBundle\API\Webservice;
use AppBundle\User\FennecUser;
use \PDO as PDO;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Web Service.
 * Returns Trait Entry information
 */
class TraitEntries extends Webservice
{
    private $db;
    private $known_trait_formats = array('categorical_free', 'numerical');
    const ERROR_UNKNOWN_TRAIT_FORMAT = "Error. Unknown trait_format.";

    /**
     * @param $query ParameterBag
     * @param $user FennecUser|null
     * @returns array with details of the requested trait entries
     */
    public function execute(ParameterBag $query, FennecUser $user = null)
    {
        if(!in_array($query->get('trait_format'), $this->known_trait_formats)){
            return(array('error' => TraitEntries::ERROR_UNKNOWN_TRAIT_FORMAT));
        }
        $this->db = $this->getManagerFromQuery($query)->getConnection();
        $trait_entry_ids = $query->get('trait_entry_ids');
        $placeholders = implode(',', array_fill(0, count($trait_entry_ids), '?'));
        $query_get_trait_entries = $this->get_query_for_trait_format($query->get('trait_format'), $placeholders);
        $stm_get_trait_entries= $this->db->prepare($query_get_trait_entries);
        $stm_get_trait_entries->execute($trait_entry_ids);

        $result = array();
        while ($row = $stm_get_trait_entries->fetch(PDO::FETCH_ASSOC)) {
            $trait_entry_id = $row['id'];
            $result[$trait_entry_id] = array(
                'fennec_id' => $row['fennec_id'],
                'type' => $row['type_name'],
                'type_definition' => $row['type_definition'],
                'citation' => $row['citation'],
                'value' => $row['value_name'],
                'value_definition' => $row['value_definition'],
                'unit' => $row['unit'],
                'origin_url' => $row['origin_url']
            );
        }
        return $result;
    }

    /**
     * @param $format
     * @param $placeholder
     * @return string
     */
    private function get_query_for_trait_format($format, $placeholder){
        $query = "";
        if($format === 'categorical_free'){
            $query = <<<EOF
SELECT 
    trait_categorical_entry.id,
    trait_categorical_entry.fennec_id,
    trait_categorical_entry.origin_url AS origin_url,
    trait_categorical_value.value AS value_name,
    trait_categorical_value.ontology_url AS value_definition,
    trait_citation.citation,
    trait_type.type AS type_name,
    trait_type.unit AS unit,
    trait_type.ontology_url AS type_definition
FROM trait_categorical_entry
    JOIN trait_categorical_value
        ON trait_categorical_value.id = trait_categorical_entry.trait_categorical_value_id
    JOIN trait_type
        ON trait_type.id = trait_categorical_entry.trait_type_id
    LEFT JOIN trait_citation
        ON trait_citation.id = trait_categorical_entry.trait_citation_id
WHERE trait_categorical_entry.id IN ($placeholder)
EOF;
        } elseif ($format === 'numerical'){
            $query = <<<EOF
SELECT 
    trait_numerical_entry.id,
    trait_numerical_entry.fennec_id,
    trait_numerical_entry.value AS value_name,
    trait_numerical_entry.origin_url AS origin_url,
    trait_citation.citation,
    trait_type.type AS type_name,
    trait_type.ontology_url AS type_definition,
    trait_type.unit AS unit,
    NULL AS value_definition
FROM trait_numerical_entry
    JOIN trait_type
        ON trait_type.id = trait_numerical_entry.trait_type_id
    LEFT JOIN trait_citation
        ON trait_citation.id = trait_numerical_entry.trait_citation_id
WHERE trait_numerical_entry.id IN ($placeholder)
EOF;
        }
        return $query;
    }
}
