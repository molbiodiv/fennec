<?php

namespace ajax\listing;

use \PDO as PDO;

/**
 * Web Service.
 * Returns Organisms up to a limit in the given db version (matching a search criterion if supplied)
 */
class Organisms extends \WebService {

    /**
     * @param array  $querydata  array of parameters:
     * <code>
     * $querydata = array(
     *   'dbversion' => '1.0', // the version of the database (required)
     *   'limit'     => 5,     // the maximum number of organisms to return (default: 5)
     *   'search'    => 'test' // a search term which is used to filter species names (optional)
     * );
     * </code>
     * @return array
     * <code>
     * $result = array(
     *   array(
     *     'organism_id'     => 1,                   // internal db organism id
     *     'scientific_name' => 'Dionaea muscipula',
     *     'rank'            => 'species',
     *     'common_name'     => 'Venus flytrap',
     *     'abbreviation'    => 'D. muscipula'
     * );
     * </code>
     */
    public function execute($querydata) {
        $db = $this->open_db_connection($querydata);
        $limit = 5;
        if(in_array('limit', array_keys($querydata))){
            $limit = $querydata['limit'];
        }
        $search = "%%";
        if(in_array('search', array_keys($querydata))){
            $search = "%".$querydata['search']."%";
        }
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
