<?php

namespace AppBundle\API\Details;

use AppBundle\API\Webservice;
use AppBundle\Entity\FennecUser;
use \PDO as PDO;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Web Service.
 * Returns details for Organisms with given ids
 */
class Organism extends Webservice
{

    private $db;
    /**
     * @param $query ParameterBag
     * @param $user FennecUser
     * @returns array of details
     */
    public function execute(ParameterBag $query, FennecUser $user = null)
    {
        $this->db = $this->getManagerFromQuery($query)->getConnection();
        $id = $query->get('id');
        $placeholders = implode(',', array_fill(0, count($id), '?'));
        $query_get_organisms = <<<EOF
SELECT *
    FROM organism WHERE fennec_id IN ($placeholders)
EOF;
        $stm_get_organisms = $this->db->prepare($query_get_organisms);
        $stm_get_organisms->execute(array($id));

        $result = array();
        while ($row = $stm_get_organisms->fetch(PDO::FETCH_ASSOC)) {
            $result['fennec_id'] = $row['fennec_id'];
            $result['scientific_name'] = $row['scientific_name'];
            $result['eol_identifier'] = $this->getIdentifierDbxref($result['fennec_id'], 'EOL');
            $result['ncbi_identifier'] = $this->getIdentifierDbxref($result['fennec_id'], 'ncbi_taxonomy');
        }
        return $result;
    }
    
    /**
     * @param int $fennec_id
     * @param string $db_name
     * @return string $identifier identifier of the current organism in the defined database
     */
    private function getIdentifierDbxref($fennec_id, $db_name)
    {
        $query_get_DB_Id = <<<EOF
SELECT db_id
    FROM db WHERE name = ?
EOF;
            $stm_get_DB_Id = $this->db->prepare($query_get_DB_Id);
            $stm_get_DB_Id->execute(array($db_name));
        while ($row = $stm_get_DB_Id->fetch(PDO::FETCH_ASSOC)) {
            $db_id = $row['db_id'];
        }
        if (!isset($db_id)) {
            return "";
        }
            
            $query_get_identifier = <<<EOF
SELECT identifier
    FROM fennec_dbxref
    WHERE db_id = :db_id AND fennec_id = :fennec_id;
EOF;
            $stm_get_identifier = $this->db->prepare($query_get_identifier);
            $stm_get_identifier->bindValue('db_id', $db_id);
            $stm_get_identifier->bindValue('fennec_id', $fennec_id);
            $stm_get_identifier->execute();
        while ($row = $stm_get_identifier->fetch(PDO::FETCH_ASSOC)) {
            $identifier = $row['identifier'];
        }
        if (!isset($identifier)) {
            $identifier = "";
        }
            return $identifier;
    }
}
