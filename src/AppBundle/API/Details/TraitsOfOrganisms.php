<?php

namespace AppBundle\API\Details;

use AppBundle\API\Webservice;
use AppBundle\User\FennecUser;
use \PDO as PDO;
use Symfony\Component\HttpFoundation\ParameterBag;

/**
 * Web Service.
 * Returns trait information to a list of organism ids
 */
class TraitsOfOrganisms extends Webservice
{
    private $db;
    /**
     * @param $query['fennec_ids' => [13,7,12,5]]
     * @param $user FennecUser
     * @returns array $result
     * <code>
     * array(type_cvterm_id => array(
     * 'trait_type' => 'habitat',
     * 'trait_entry_ids' => array(1, 20, 36, 7),
     * 'fennec_ids' => array(13, 20, 5)
     * );
     * </code>
     */
    public function execute(ParameterBag $query, FennecUser $user = null)
    {
        $this->db = $this->getManagerFromQuery($query)->getConnection();
        $fennec_ids = $query->get('fennec_ids');
        if(count($fennec_ids) == 0){
            return array();
        }
        $placeholders = implode(',', array_fill(0, count($fennec_ids), '?'));
        $query_get_categorical_traits = <<<EOF
(SELECT trait_categorical_entry.id, trait_categorical_entry.fennec_id, trait_categorical_entry.trait_type_id, trait_type.type, trait_format.format, trait_type.unit
    FROM trait_categorical_entry, trait_type, trait_format
    WHERE trait_categorical_entry.trait_type_id = trait_type.id
    AND trait_format.id = trait_type.trait_format_id
    AND deletion_date IS NULL
    AND fennec_id IN ($placeholders))
UNION
(SELECT
    trait_numerical_entry.id, trait_numerical_entry.fennec_id, trait_numerical_entry.trait_type_id, trait_type.type, trait_format.format, trait_type.unit
    FROM trait_numerical_entry, trait_type, trait_format
    WHERE trait_numerical_entry.trait_type_id = trait_type.id
    AND trait_format.id = trait_type.trait_format_id
    AND deletion_date IS NULL
    AND fennec_id IN ($placeholders)
)
EOF;
        $stm_get_categorical_traits = $this->db->prepare($query_get_categorical_traits);
        $stm_get_categorical_traits->execute(array_map('intval', array_merge($fennec_ids, $fennec_ids)));

        $result = array();
        while ($row = $stm_get_categorical_traits->fetch(PDO::FETCH_ASSOC)) {
            $trait_type = $row['type'];
            $type_cvterm_id = $row['trait_type_id'];
            $trait_format = $row['format'];
            $fennec_id = $row['fennec_id'];
            $trait_entry_id = $row['id'];
            $unit = $row['unit'];
            if (!array_key_exists($type_cvterm_id, $result)) {
                $result[$type_cvterm_id] = [
                    'trait_type' => $trait_type,
                    'trait_format' => $trait_format,
                    'trait_entry_ids' => [$trait_entry_id],
                    'fennec_ids' => [$fennec_id],
                    'unit' => $unit
                ];
            } else {
                array_push($result[$type_cvterm_id]['trait_entry_ids'], $trait_entry_id);
                if (!in_array($fennec_id, $result[$type_cvterm_id]['fennec_ids'])) {
                    array_push($result[$type_cvterm_id]['fennec_ids'], $fennec_id);
                }
            }
        }
        return $result;
    }
}
