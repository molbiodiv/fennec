<?php

namespace AppBundle\API\Details;

use AppBundle\API\Webservice;
use \PDO as PDO;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Web Service.
 * Returns trait information to a list of organism ids
 */
class TraitsOfOrganisms extends Webservice
{
    private $db;
    /**
     * @param $query['organism_ids' => [13,7,12,5]]
     * @param $session SessionInterface
     * @returns Array $result
     * <code>
     * array(type_cvterm_id => array(
     * 'trait_type' => 'habitat',
     * 'trait_entry_ids' => array(1, 20, 36, 7),
     * 'organism_ids' => array(13, 20, 5)
     * );
     * </code>
     */
    public function execute(ParameterBag $query, SessionInterface $session = null)
    {
        $this->db = $this->getDbFromQuery($query);
        $organism_ids = $query->get('organism_ids');
        if(count($organism_ids) == 0){
            return array();
        }
        $placeholders = implode(',', array_fill(0, count($organism_ids), '?'));
        $query_get_categorical_traits = <<<EOF
SELECT trait_categorical_entry.id, trait_categorical_entry.organism_id, trait_categorical_entry.trait_type_id, trait_type.type, trait_format.format
    FROM trait_categorical_entry, trait_type, trait_format
    WHERE trait_categorical_entry.trait_type_id = trait_type.id
    AND trait_format.id = trait_type.trait_format_id
    AND organism_id IN ($placeholders)
EOF;
        $stm_get_categorical_traits = $this->db->prepare($query_get_categorical_traits);
        $stm_get_categorical_traits->execute(array_map('intval', $organism_ids));

        $result = array();
        while ($row = $stm_get_categorical_traits->fetch(PDO::FETCH_ASSOC)) {
            $trait_type = $row['type'];
            $type_cvterm_id = $row['trait_type_id'];
            $trait_format = $row['format'];
            $organism_id = $row['organism_id'];
            $trait_entry_id = $row['id'];
            if (!array_key_exists($type_cvterm_id, $result)) {
                $result[$type_cvterm_id] = [
                    'trait_type' => $trait_type,
                    'trait_format' => $trait_format,
                    'trait_entry_ids' => [$trait_entry_id],
                    'organism_ids' => [$organism_id]
                ];
            } else {
                array_push($result[$type_cvterm_id]['trait_entry_ids'], $trait_entry_id);
                if (!in_array($organism_id, $result[$type_cvterm_id]['organism_ids'])) {
                    array_push($result[$type_cvterm_id]['organism_ids'], $organism_id);
                }
            }
        }
        return $result;
    }
}
