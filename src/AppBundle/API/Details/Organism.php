<?php

namespace AppBundle\API\Details;

use AppBundle\API\Webservice;
use \PDO as PDO;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\HttpFoundation\Session\Session;

/**
 * Web Service.
 * Returns details for Organisms with given ids
 */
class Organism extends Webservice
{

    private $db;
    /**
     * @param $query ParameterBag
     * @param $session Session
     * @returns array of details
     */
    public function execute(ParameterBag $query, Session $session = null)
    {
        $this->db = $this->getDbFromQuery($query);
        $id = $query->get('id');
        $placeholders = implode(',', array_fill(0, count($id), '?'));
        $query_get_organisms = <<<EOF
SELECT *
    FROM organism WHERE organism_id IN ($placeholders)
EOF;
        $stm_get_organisms = $this->db->prepare($query_get_organisms);
        $stm_get_organisms->execute(array($id));

        $result = array();
        while ($row = $stm_get_organisms->fetch(PDO::FETCH_ASSOC)) {
            $result['organism_id'] = $row['organism_id'];
            $result['scientific_name'] = $row['species'];
            $result['rank'] = $row['genus'];
            $result['common_name'] = $row['common_name'];
            if ($row["abbreviation"]!=null) {
                $result['rank']='species';
            }
            
            $result['eol_accession'] = $this->getEolAccession($result['organism_id']);
            $result['ncbi_accession'] = $this->getNcbiAccession($result['organism_id']);
        }
        return $result;
    }
    
    /**
     * @param type $organism_id id of the organism
     * @return $eol_accession eol accession of the current organism
     */
    private function getEolAccession($organism_id)
    {
        $query_get_EOL_DB_Id = <<<EOF
SELECT db_id
    FROM db WHERE name = 'EOL'  
EOF;
            $stm_get_EOL_DB_Id = $this->db->prepare($query_get_EOL_DB_Id);
            $stm_get_EOL_DB_Id->execute();
        while ($row = $stm_get_EOL_DB_Id->fetch(PDO::FETCH_ASSOC)) {
            $eol_id = $row['db_id'];
        }
            
            $query_get_EOL_Accession = <<<EOF
SELECT accession 
    FROM dbxref, organism_dbxref
    WHERE db_id = :eol_id AND organism_dbxref.dbxref_id = dbxref.dbxref_id AND organism_id = :organism_id;
EOF;
            $stm_get_EOL_accession = $this->db->prepare($query_get_EOL_Accession);
            $stm_get_EOL_accession->bindValue('eol_id', $eol_id);
            $stm_get_EOL_accession->bindValue('organism_id', $organism_id);
            $stm_get_EOL_accession->execute();
        while ($row = $stm_get_EOL_accession->fetch(PDO::FETCH_ASSOC)) {
            $eol_accession = $row['accession'];
        }
        if (!isset($eol_accession)) {
            $eol_accession = "";
        }
            return $eol_accession;
    }
    
    /**
     *
     * @param $organsim_id id of the organism
     * @return $ncbi_accession ncbi accession of the current organism
     */
    private function getNcbiAccession($organsim_id)
    {
        $query_get_NCBI_DB_Id = <<<EOF
SELECT db_id
    FROM db WHERE name = 'DB:NCBI_taxonomy'  
EOF;
            $stm_get_NCBI_DB_Id = $this->db->prepare($query_get_NCBI_DB_Id);
            $stm_get_NCBI_DB_Id->execute();
        while ($row = $stm_get_NCBI_DB_Id->fetch(PDO::FETCH_ASSOC)) {
            $ncbi_id = $row['db_id'];
        }
            
            $query_get_NCBI_Accession = <<<EOF
SELECT accession 
    FROM dbxref, organism_dbxref
    WHERE db_id = :ncbi_id AND organism_dbxref.dbxref_id = dbxref.dbxref_id AND organism_id = :organism_id;
EOF;
            $stm_get_NCBI_accession = $this->db->prepare($query_get_NCBI_Accession);
            $stm_get_NCBI_accession->bindValue('ncbi_id', $ncbi_id);
            $stm_get_NCBI_accession->bindValue('organism_id', $organsim_id);
            $stm_get_NCBI_accession->execute();
        while ($row = $stm_get_NCBI_accession->fetch(PDO::FETCH_ASSOC)) {
            $ncbi_accession = $row['accession'];
        }
        if (!isset($ncbi_accession)) {
            $ncbi_accession = "";
        }
            return $ncbi_accession;
    }
}
