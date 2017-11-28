<?php

namespace AppBundle\API\Mapping;

use AppBundle\API\Webservice;
use AppBundle\Entity\FennecUser;
use Symfony\Component\HttpFoundation\ParameterBag;

class ByDbxrefId extends Webservice
{
    private $db;

    /**
     * @inheritdoc
     */
    public function execute(ParameterBag $query, FennecUser $user = null)
    {
        $this->db = $this->getManagerFromQuery($query)->getConnection();
        if(!$query->has('ids') || !is_array($query->get('ids')) || count($query->get('ids')) === 0 || !$query->has('db')){
            return array();
        }
        $ids = $query->get('ids');
        $result = array_fill_keys($ids, null);
        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $query_get_mapping = <<<EOF
SELECT fennec_id, identifier
    FROM fennec_dbxref
        WHERE db_id=(SELECT db_id FROM db WHERE name=?)
        AND identifier IN ({$placeholders})
EOF;
        $stm_get_mapping = $this->db->prepare($query_get_mapping);
        $stm_get_mapping->execute(array_merge([$query->get('db')], $ids));

        while($row = $stm_get_mapping->fetch(\PDO::FETCH_ASSOC)){
            $id = $row['identifier'];
            if($result[$id] === null){
                $result[$id] = $row['fennec_id'];
            } else {
                if(! is_array($result[$id]) ){
                    $result[$id] = [$result[$id]];
                }
                $result[$id][] = $row['fennec_id'];
            }
        }

        return $result;
    }
}