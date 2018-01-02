<?php

namespace AppBundle\API\Details;

use AppBundle\Service\DBVersion;
use \PDO as PDO;

/**
 * Web Service.
 * Returns Trait information
 * <code>
 *   array(
 *     "values" => [
 *       "annual" => [2888, 109884],
 *       "perennial" => [46032, 6661, 25517]
 *     ],
 *     "trait_type_id" => 2,
 *     "name" => "Plant Life Cycle Habit",
 *     "ontology_url" => "http://purl.obolibrary.org/obo/TO_0002725",
 *     "trait_format" => "categorical_free",
 *     "number_of_organisms" => 5
 *   );
 * </code>
 */
class Traits
{

    private $manager;

    /**
     * Traits constructor.
     * @param $dbversion
     */
    public function __construct(DBVersion $dbversion)
    {
        $this->manager = $dbversion->getEntityManager();
    }

    /**
     * @param $trait_type_id
     * @returns array of traits
     */
    public function execute($trait_type_id, $fennec_ids)
    {
        $result = $this->get_info($trait_type_id);
        $format = $result['trait_format'] === 'categorical_free' ? 'categorical' : 'numerical';
        $result['values'] = $this->get_values($trait_type_id, $fennec_ids, $format);
        $result['number_of_organisms'] = $this->get_number_of_organisms($trait_type_id, $fennec_ids, $format);
        if ($query->has('include_citations') && $query->get('include_citations')){
            $result['citations'] = $this->get_citations($trait_type_id, $fennec_ids, $format);
        }
        return $result;
    }

    /**
     * @param $trait_type_id
     * @param $fennec_ids
     * @param $trait_format string - one of categorical|numerical
     * @return array values of specific trait
     */
    private function get_values($trait_type_id, $fennec_ids, $trait_format){
        if ($fennec_ids !== null and count($fennec_ids) === 0){
            return array();
        }
        if($trait_format === 'categorical'){
            return $this->get_categorical_values($trait_type_id, $fennec_ids);
        } else {
            return $this->get_numerical_values($trait_type_id, $fennec_ids);
        }
    }

    /**
     * @param $trait_type_id
     * @param $fennec_ids
     * @return array values of specific trait
     */
    private function get_categorical_values($trait_type_id, $fennec_ids){
        $organism_constraint = $this->get_organism_constraint($fennec_ids);
        $query_get_values = <<<EOF
SELECT fennec_id, value
    FROM trait_categorical_entry, trait_categorical_value
    WHERE trait_categorical_value_id=trait_categorical_value.id
    AND trait_categorical_entry.trait_type_id = ?
    AND deletion_date IS NULL
    {$organism_constraint}
EOF;
        $stm_get_values= $this->db->prepare($query_get_values);
        if($fennec_ids !== null){
            $stm_get_values->execute(array_merge(array($trait_type_id), $fennec_ids));
        } else {
            $stm_get_values->execute(array($trait_type_id));
        }

        $values = array();
        while ($row = $stm_get_values->fetch(PDO::FETCH_ASSOC)) {
            if(!array_key_exists($row['value'], $values)){
                $values[$row['value']] = array();
            }
            $values[$row['value']][] = $row['fennec_id'];
        }

        foreach ($values as $key => $value){
            $values[$key] = array_values(array_unique($value));
        }

        return $values;
    }

    /**
     * @param $trait_type_id
     * @param $fennec_ids
     * @return array values of specific trait
     */
    private function get_numerical_values($trait_type_id, $fennec_ids){
        $organism_constraint = $this->get_organism_constraint($fennec_ids);
        $query_get_values = <<<EOF
SELECT fennec_id, value
    FROM trait_numerical_entry
    WHERE trait_type_id = ?
    AND deletion_date IS NULL
    {$organism_constraint}
EOF;
        $stm_get_values= $this->db->prepare($query_get_values);

        $values = array();
        if($fennec_ids !== null){
            $values = array_fill_keys($fennec_ids, array());
            $stm_get_values->execute(array_merge(array($trait_type_id), $fennec_ids));
        } else {
            $stm_get_values->execute(array($trait_type_id));
        }

        while ($row = $stm_get_values->fetch(PDO::FETCH_ASSOC)) {
            if(!array_key_exists($row['fennec_id'], $values)){
                $values[$row['fennec_id']] = array();
            }
            $values[$row['fennec_id']][] = $row['value'];
        }

        return $values;
    }

    /**
     * @param $trait_type_id
     * @param $fennec_ids
     * @param $trait_format string - one of categorical|numerical
     * @return integer number of organisms which have this trait
     */
    private function get_number_of_organisms($trait_type_id, $fennec_ids, $trait_format){
        if ($fennec_ids !== null and count($fennec_ids) === 0){
            return 0;
        }
        $organism_constraint = $this->get_organism_constraint($fennec_ids);
        $query_get_number_of_organisms = <<<EOF
SELECT count(DISTINCT fennec_id) FROM trait_{$trait_format}_entry WHERE trait_type_id = ? AND deletion_date IS NULL
    {$organism_constraint}
EOF;
        $stm_get_number_of_organisms= $this->db->prepare($query_get_number_of_organisms);
        if($fennec_ids !== null){
            $stm_get_number_of_organisms->execute(array_merge(array($trait_type_id), $fennec_ids));
        } else {
            $stm_get_number_of_organisms->execute(array($trait_type_id));
        }

        $row = $stm_get_number_of_organisms->fetch(PDO::FETCH_ASSOC);
        $number_of_organisms = $row['count'];

        return $number_of_organisms;
    }

    /**
     * @param $trait_type_id
     * @param $fennec_ids
     * @param $trait_format string - one of categorical|numerical
     * @return array citations by fennec_id
     */
    private function get_citations($trait_type_id, $fennec_ids, $trait_format){
        if ($fennec_ids !== null and count($fennec_ids) === 0){
            return [];
        }
        $organism_constraint = $this->get_organism_constraint($fennec_ids);
        $query_get_citations = $this->get_citation_query_for_format($trait_format, $organism_constraint);
        $stm_get_citations= $this->db->prepare($query_get_citations);
        if($fennec_ids !== null){
            $stm_get_citations->execute(array_merge(array($trait_type_id), $fennec_ids));
        } else {
            $stm_get_citations->execute(array($trait_type_id));
        }

        $citations = [];
        while ($row = $stm_get_citations->fetch(PDO::FETCH_ASSOC)) {
            if(!array_key_exists($row['fennec_id'], $citations)){
                $citations[$row['fennec_id']] = array();
            }
            $citations[$row['fennec_id']][] = [
                "citation" => $row['citation'],
                "value" => $row['value']
            ];
        }

        return $citations;
    }

    private function get_organism_constraint($fennec_ids){
        $organism_constraint = '';
        if($fennec_ids !== null){
            $placeholders = implode(',', array_fill(0, count($fennec_ids), '?'));
            $organism_constraint = "AND fennec_id IN (".$placeholders.") ";
        }
        return $organism_constraint;
    }

    /**
     * @param $trait_format
     * @param $organism_constraint
     * @return string
     */
    private function get_citation_query_for_format($trait_format, $organism_constraint)
    {
        $query_get_citations = "";
        if($trait_format === 'categorical'){
            $query_get_citations = <<<EOF
    SELECT fennec_id, value, citation
    FROM trait_categorical_entry, trait_citation, trait_categorical_value
    WHERE trait_categorical_entry.trait_type_id = ?
    AND trait_citation_id = trait_citation.id
    AND trait_categorical_value.id = trait_categorical_value_id
    AND deletion_date IS NULL
        {$organism_constraint}
EOF;
        } elseif($trait_format === 'numerical'){
            $query_get_citations = <<<EOF
    SELECT fennec_id, citation, value
    FROM trait_numerical_entry, trait_citation 
    WHERE trait_type_id = ?
    AND trait_citation_id = trait_citation.id
    AND deletion_date IS NULL
        {$organism_constraint}
EOF;
        }
        return $query_get_citations;
    }
}