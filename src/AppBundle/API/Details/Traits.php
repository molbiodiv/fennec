<?php

namespace AppBundle\API\Details;

use AppBundle\API\Webservice;
use AppBundle\User\FennecUser;
use \PDO as PDO;
use Symfony\Component\HttpFoundation\ParameterBag;

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
class Traits extends Webservice
{

    private $db;

    /**
     * @param $query ParameterBag
     * @param $user FennecUser
     * @returns array of traits
     */
    public function execute(ParameterBag $query, FennecUser $user = null)
    {
        $this->db = $this->getManagerFromQuery($query)->getConnection();
        $trait_type_id = $query->get('trait_type_id');
        $fennec_ids = null;
        if ($query->has('fennec_ids') and is_array($query->get('fennec_ids'))){
            $fennec_ids = $query->get('fennec_ids');
        }
        $result = $this->get_info($trait_type_id);
        $result['values'] = $this->get_values($trait_type_id, $fennec_ids);
        $result['number_of_organisms'] = $this->get_number_of_organisms($trait_type_id, $fennec_ids);

        return $result;
    }

    /**
     * @param $trait_type_id
     * @param $fennec_ids
     * @return array values of specific trait
     */
    private function get_values($trait_type_id, $fennec_ids){
        if ($fennec_ids !== null and count($fennec_ids) === 0){
            return array();
        }
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
     * @return array type, format, trait_type_id and ontology_url of specific trait
     */
    private function get_info($trait_type_id){
        $query_get_info = <<<EOF
SELECT trait_type.id AS trait_type_id, type AS name, ontology_url, format AS trait_format, trait_type.description AS description
    FROM trait_type, trait_format
    WHERE trait_type.id = :trait_type_id
    AND trait_format_id = trait_format.id;
EOF;
        $stm_get_info= $this->db->prepare($query_get_info);
        $stm_get_info->bindValue('trait_type_id', $trait_type_id);
        $stm_get_info->execute();

        $info = $stm_get_info->fetch(PDO::FETCH_ASSOC);

        return $info;
    }

    /**
     * @param $trait_type_id
     * @param $fennec_ids
     * @return integer number of organisms which have this trait
     */
    private function get_number_of_organisms($trait_type_id, $fennec_ids){
        if ($fennec_ids !== null and count($fennec_ids) === 0){
            return 0;
        }
        $organism_constraint = $this->get_organism_constraint($fennec_ids);
        $query_get_number_of_organisms = <<<EOF
SELECT count(DISTINCT fennec_id) FROM trait_categorical_entry WHERE trait_type_id = ? AND deletion_date IS NULL
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

    private function get_organism_constraint($fennec_ids){
        $organism_constraint = '';
        if($fennec_ids !== null){
            $placeholders = implode(',', array_fill(0, count($fennec_ids), '?'));
            $organism_constraint = "AND fennec_id IN (".$placeholders.") ";
        }
        return $organism_constraint;
    }
}