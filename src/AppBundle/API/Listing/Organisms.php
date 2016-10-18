<?php

namespace AppBundle\API\Listing;

use AppBundle\API\Webservice;
use \PDO as PDO;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Web Service.
 * Returns Organisms up to a limit in the given db version (matching a search criterion if supplied)
 */
class Organisms extends Webservice
{
    private $database;

    /**
     * @inheritdoc
     * <code>
     * $query = array(
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
    public function execute(ParameterBag $query, SessionInterface $session = null)
    {
        $this->database = $this->getDbFromQuery($query);
        $limit = 5;
        if ($query->has('limit')) {
            $limit = $query->get('limit');
        }
        $search = "%%";
        if ($query->has('search')) {
            $search = "%".$query->get('search')."%";
        }
        $query_get_organisms = <<<EOF
SELECT *
    FROM organism WHERE organism.species ILIKE :search LIMIT :limit
EOF;
        $stm_get_organisms = $this->database->prepare($query_get_organisms);
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
            if ($row["abbreviation"]!=null) {
                $result['rank']='species';
            }
            $data[] = $result;
        }
        return $data;
    }
}
