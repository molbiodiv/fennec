<?php

namespace ajax\listing;

use \PDO as PDO;

/**
 * Web Service.
 * Returns Organisms with given ids
 */
class Details extends \WebService {

    /**
     * @param $querydata[ids] array of ids
     * @returns array of details
     */
    public function execute($querydata) {
        global $db;
        $id = $querydata['id'];
        $placeholders = implode(',', array_fill(0, count($id), '?'));
        $query_get_organisms = <<<EOF
SELECT *
    FROM organism WHERE organism_id IN ($placeholders)
EOF;
        $stm_get_organisms = $db->prepare($query_get_organisms);
        $stm_get_organisms->execute(array($id));

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

