<?php

namespace ajax\listing;

use \PDO as PDO;

/**
 * Web Service.
 * Returns Organisms with given ids
 */
class Organisms extends \WebService {

    /**
     * @param $querydata[ids] array of organism ids
     * @returns array of organisms
     */
    public function execute($querydata) {
        global $db;
        $limit = 5;
        if(in_array('limit', array_keys($querydata))){
            $limit = $querydata['limit'];
        }
            $search = "%".$querydata['search']."%";
        $query_get_organisms = <<<EOF
SELECT *
    FROM organism WHERE organism.species LIKE :search LIMIT :limit
EOF;
        $stm_get_organisms = $db->prepare($query_get_organisms);
        $stm_get_organisms->bindValue('search', $search);
        $stm_get_organisms->bindValue('limit', $limit);
        $stm_get_organisms->execute();

        $data = array();
        
        while ($row = $stm_get_organisms->fetch(PDO::FETCH_ASSOC)) {
            $result = array();
            $result['organism_id'] = $row['organism_id'];
            $result['scientific_name'] = $row['species'];
            $result['rank'] = $row['genus'];
            $result['common_name'] = $row['common_name'];
            if($row["abbreviation"]!=null){
                $result['rank']='species';
            }
            $data[] = $result;
        }
        
        return $data;
    }
}

?>
