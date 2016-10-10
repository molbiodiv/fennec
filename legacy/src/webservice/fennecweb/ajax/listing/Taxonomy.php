<?php

namespace fennecweb\ajax\listing;

use \PDO as PDO;

/**
 * Web Service.
 * Returns Taxonomy information for a given organism_id
 */
class Taxonomy extends \fennecweb\WebService
{

    private $db;
    /**
     * @param $querydata[ids] array of organism ids
     * @returns array of taxonomy information for a given organism id
     * array('lineage' => [grandgrandparent, grandparent, parent])
     */
    public function execute($querydata)
    {
        $this->db = $this->openDbConnection($querydata);
        $child_organism_id = $querydata['id'];
        $result['lineage'] = array();
        array_unshift($result['lineage'], $this->getParent($child_organism_id));
        while ($this->getParent($result['lineage'][0]) != null) {
            array_unshift($result['lineage'], $this->getParent($result['lineage'][0]));
        }
        $data['lineage'] = array();
        foreach ($result['lineage'] as $organism_id) {
            array_push($data['lineage'], $this->getOrganismName($organism_id)." &#8594;");
        }
        array_push($data['lineage'], $this->getOrganismName($child_organism_id));
        return $data;
        
    }
    
    /**
     * @param $organism_id id of organism
     * @return $parent_name parents name of the corresponding organism
     */
    private function getParent($organism_id)
    {
        $query_get_parent_phylonode_id = <<<EOF
SELECT parent_phylonode_id 
    FROM phylonode, phylonode_organism 
    WHERE phylonode_organism.phylonode_id = phylonode.phylonode_id AND organism_id = :organism_id
EOF;
        $stm_get_parent_phylonode_id = $this->db->prepare($query_get_parent_phylonode_id);
        $stm_get_parent_phylonode_id->bindValue('organism_id', $organism_id);
        $stm_get_parent_phylonode_id->execute();
        
        $result = $stm_get_parent_phylonode_id->fetch(PDO::FETCH_ASSOC);
        $parent_phylonode_id = $result['parent_phylonode_id'];
        
        $query_get_parent_organism_id = <<<EOF
SELECT organism_id FROM phylonode_organism WHERE phylonode_id = :parent_phylonode_id
EOF;
        $stm_get_parent_organism_id = $this->db->prepare($query_get_parent_organism_id);
        $stm_get_parent_organism_id->bindValue('parent_phylonode_id', $parent_phylonode_id);
        $stm_get_parent_organism_id->execute();
        
        $result = $stm_get_parent_organism_id->fetch(PDO::FETCH_ASSOC);
        $parent_organism_id = $result['organism_id'];
        
        return $parent_organism_id;
    }
    
    private function getOrganismName($organism_id)
    {
        $query_get_organism_name = <<<EOF
SELECT species FROM organism WHERE organism_id = :organism_id
EOF;
        $stm_get_organism_name = $this->db->prepare($query_get_organism_name);
        $stm_get_organism_name->bindValue('organism_id', $organism_id);
        $stm_get_organism_name->execute();
        $result = $stm_get_organism_name->fetch(PDO::FETCH_ASSOC);
        $organism_name = $result['species'];
        return $organism_name;
        
    }
}
