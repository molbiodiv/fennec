<?php

namespace AppBundle\API\Listing;

use AppBundle\Service\DBVersion;
use AppBundle\Entity\Data\Organism;

/**
 * Web Service.
 * Returns Organisms up to a limit in the given db version (matching a search criterion if supplied)
 */
class Organisms
{
    private $dbversion;

    /**
     * Organisms constructor.
     * @param $dbversion
     */
    public function __construct(DBVersion $dbversion)
    {
        $this->dbversion = $dbversion;
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
    public function execute($limit, $search)
    {
        return $this->dbversion->getEntityManager()->getRepository(Organism::class)->getListOfOrganisms($limit, $search);
    }
}
