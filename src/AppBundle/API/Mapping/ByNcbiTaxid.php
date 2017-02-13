<?php

namespace AppBundle\API\Mapping;

use AppBundle\API\Webservice;
use AppBundle\User\FennecUser;
use Symfony\Component\HttpFoundation\ParameterBag;

class ByNcbiTaxid extends Webservice
{
    private $db;

    /**
     * @inheritdoc
     */
    public function execute(ParameterBag $query, FennecUser $user = null)
    {
        $this->db = $this->getManagerFromQuery($query)->getConnection();
        if(!$query->has('ids') || !is_array($query->get('ids')) || count($query->get('ids')) === 0){
            return array();
        }
        $ids = $query->get('ids');
        $result = array_fill_keys($ids, null);
        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $query_get_mapping = <<<EOF
SELECT fennec_id, identifier AS ncbi_taxid
    FROM fennec_dbxref
        WHERE db_id=(SELECT db_id FROM db WHERE name='ncbi_taxonomy')
        AND identifier IN ({$placeholders})
EOF;
        $stm_get_mapping = $this->db->prepare($query_get_mapping);
        $stm_get_mapping->execute($ids);

        while($row = $stm_get_mapping->fetch(\PDO::FETCH_ASSOC)){
            $result[$row['ncbi_taxid']] = $row['fennec_id'];
        }

        return $result;
    }
}