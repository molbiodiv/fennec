<?php

namespace AppBundle\API\Listing;

use AppBundle\Entity\TaxonomyNode;
use AppBundle\Service\DBVersion;
use \PDO as PDO;

/**
 * Web Service.
 * Returns Taxonomy information for a given organism_id
 */
class Taxonomy
{

    private $manager;

    /**
     * Taxonomy constructor.
     * @param $dbversion
     */
    public function __construct(DBVersion $dbversion)
    {
        $this->manager = $dbversion->getEntityManager();
    }


    /**
     * @param $query ParameterBag $query[ids] array of organism ids
     * @param $user FennecUser
     * @returns array of taxonomy information for a given organism id
     * array('lineage' => [grandgrandparent, grandparent, parent])
     */
    public function execute(ParameterBag $query)
    {
        $result = array();
        $taxonomy_databases = $this->getTaxomomyDatabases($fennec_id);
        foreach($taxonomy_databases as $name => $taxonomy_node_id){
            $result[$name] = $this->getLineage($taxonomy_node_id);
        }
        return $result;

    }

    /**
     * @param $taxonomy_node_id
     * @return array
     */
    private function getLineage($taxonomy_node_id){
        $result = array();
        $previousParent = $taxonomy_node_id;
        $parent = $this->getParent($taxonomy_node_id);
        while ($parent !== $previousParent) {
            array_unshift($result, $this->getOrganismName($parent));
            $previousParent = $parent;
            $parent = $this->getParent($previousParent);
        }
        return $result;
    }

    /**
     * @param $taxonomy_node_id
     * @return $parent_taxonomy_node_id
     */
    private function getParent($taxonomy_node_id)
    {
        $query_get_parent_taxonomy_node_id = <<<EOF
SELECT parent_taxonomy_node_id 
    FROM taxonomy_node 
    WHERE taxonomy_node_id = :taxonomy_node_id
EOF;
        $stm_get_parent_taxonomy_node_id = $this->db->prepare($query_get_parent_taxonomy_node_id);
        $stm_get_parent_taxonomy_node_id->bindValue('taxonomy_node_id', $taxonomy_node_id);
        $stm_get_parent_taxonomy_node_id->execute();

        $result = $stm_get_parent_taxonomy_node_id->fetch(PDO::FETCH_ASSOC);

        return $result['parent_taxonomy_node_id'];
    }
    
    private function getOrganismName($taxonomy_node_id)
    {
        $query_get_scientific_name = <<<EOF
SELECT scientific_name FROM organism, taxonomy_node WHERE organism.fennec_id = taxonomy_node.fennec_id AND taxonomy_node_id = :taxonomy_node_id
EOF;
        $stm_get_scientific_name = $this->db->prepare($query_get_scientific_name);
        $stm_get_scientific_name->bindValue('taxonomy_node_id', $taxonomy_node_id);
        $stm_get_scientific_name->execute();
        $result = $stm_get_scientific_name->fetch(PDO::FETCH_ASSOC);
        return $result['scientific_name'];

    }
}
