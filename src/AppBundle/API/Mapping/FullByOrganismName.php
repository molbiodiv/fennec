<?php

namespace AppBundle\API\Mapping;

use AppBundle\API\Webservice;
use AppBundle\Entity\FennecUser;
use Symfony\Component\HttpFoundation\ParameterBag;

class FullByOrganismName extends Webservice
{
    private $db;

    /**
     * @inheritdoc
     */
    public function execute(ParameterBag $query, FennecUser $user = null)
    {
        $this->db = $this->getManagerFromQuery($query)->getConnection();
        $query_get_mapping = <<<EOF
SELECT fennec_id, scientific_name
    FROM organism
EOF;
        $stm_get_mapping = $this->db->prepare($query_get_mapping);
        $stm_get_mapping->execute();

        $result = array();
        while($row = $stm_get_mapping->fetch(\PDO::FETCH_ASSOC)){
            $name = $row['scientific_name'];
            if(!array_key_exists($name, $result)){
                $result[$row['scientific_name']] = $row['fennec_id'];
            } else {
                if(! is_array($result[$name]) ){
                    $result[$name] = [$result[$name]];
                }
                $result[$name][] = $row['fennec_id'];
            }
        }

        return $result;
    }
}