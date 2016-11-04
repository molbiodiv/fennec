<?php

namespace AppBundle\API\Mapping;

use AppBundle\API\Webservice;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class ByOrganismName extends Webservice
{
    private $db;

    /**
     * @inheritdoc
     */
    public function execute(ParameterBag $query, SessionInterface $session = null)
    {
        $this->db = $this->getDbFromQuery($query);
        if(!$query->has('ids') || !is_array($query->get('ids')) || count($query->get('ids')) === 0){
            return array();
        }
        $ids = $query->get('ids');
        $result = array_fill_keys($ids, null);
        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $query_get_mapping = <<<EOF
SELECT organism.organism_id AS organism_id, species
    FROM organism
        WHERE species IN ({$placeholders})
EOF;
        $stm_get_mapping = $this->db->prepare($query_get_mapping);
        $stm_get_mapping->execute($ids);

        while($row = $stm_get_mapping->fetch(\PDO::FETCH_ASSOC)){
            $result[$row['species']] = $row['organism_id'];
        }

        return $result;
    }
}