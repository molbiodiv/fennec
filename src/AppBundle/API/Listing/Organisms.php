<?php

namespace AppBundle\API\Listing;

use AppBundle\Entity\FennecUser;
use AppBundle\Service\DBVersion;
use \PDO as PDO;
use Symfony\Component\HttpFoundation\ParameterBag;

/**
 * Web Service.
 * Returns Organisms up to a limit in the given db version (matching a search criterion if supplied)
 */
class Organisms
{
    private $manager;

    /**
     * Organisms constructor.
     * @param $dbversion
     */
    public function __construct(DBVersion $dbversion)
    {
        $this->manager = $dbversion->getEntityManager();
    }


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
     *     'fennec_id'     => 1,                   // internal db organism id
     *     'scientific_name' => 'Dionaea muscipula'
     * );
     * </code>
     *
     * @api {get} /listing/organisms Organisms
     * @apiName ListingOrganisms
     * @apiGroup Listing
     * @apiParam {String} dbversion Version of the internal fennec database
     * @apiParam {Number} [limit=5] Limit number of results
     * @apiParam {String} [search=""] Only return organisms where the scientific name matches this string (case insensitive)
     * @apiVersion 0.8.0
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     [{
     *       "fennec_id": 22457,
     *       "scientific_name": "Bellis perennis"
     *     }]
     * @apiParamExample {json} Request-Example:
     *     {
     *       "dbversion": "1.0",
     *       "limit": 2,
     *       "search": "Bellis perennis"
     *     }
     * @apiSuccess {Array} results Array of result objects. Each result has keys fennec_id and scientific_name
     * @apiExample {curl} Example usage:
     *     curl http://fennec.molecular.eco/api/listing/organisms?dbversion=1.0&limit=1&search=bellis
     * @apiSampleRequest http://fennec.molecular.eco/api/listing/organisms
     */
    public function execute(ParameterBag $query)
    {
        $this->database = $this->getManagerFromQuery($query)->getConnection();
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
    FROM organism WHERE organism.scientific_name ILIKE :search LIMIT :limit
EOF;
        $stm_get_organisms = $this->database->prepare($query_get_organisms);
        $stm_get_organisms->bindValue('search', $search);
        $stm_get_organisms->bindValue('limit', $limit);
        $stm_get_organisms->execute();

        $data = array();

        while ($row = $stm_get_organisms->fetch(PDO::FETCH_ASSOC)) {
            $result = array();
            $result['fennec_id'] = $row['fennec_id'];
            $result['scientific_name'] = $row['scientific_name'];
            $data[] = $result;
        }
        return $data;
    }
}
