<?php

namespace AppBundle\API\Listing;

use AppBundle\API\Webservice;
use AppBundle\User\FennecUser;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\Criteria;
use Doctrine\ORM\EntityManager;
use Symfony\Component\HttpFoundation\ParameterBag;

class Overview extends Webservice
{
    /**
     * @var EntityManager
     */
    private $manager;

    /**
     * @inheritdoc
     *
     * @api {get} /listing/overview Overview
     * @apiName ListingOverview
     * @apiDescription This returns an object containing the number of elements in the database, split by organisms, projects and traits.
     * @apiGroup Listing
     * @apiParam {String} dbversion Version of the internal fennec database
     * @apiVersion 0.8.0
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "projects": 0,
     *       "organisms": 1400000,
     *       "trait_entries": 200000,
     *       "trait_types": 30,
     *     }
     * @apiParamExample {json} Request-Example:
     *     {
     *       "dbversion": "1.0"
     *     }
     * @apiSuccess {Number} projects  Number of projects for the current user.
     * @apiSuccess {Number} organisms  Number of organisms in the database.
     * @apiSuccess {Number} trait_entries  Number of total trait entries in the database.
     * @apiSuccess {Number} trait_types  Number of distinct trait types in the database.
     * @apiExample {curl} Example usage:
     *     curl http://fennec.molecular.eco/api/listing/overview?dbversion=1.0
     * @apiSampleRequest http://fennec.molecular.eco/api/listing/overview
     */
    public function execute(ParameterBag $query, FennecUser $user = null){
        $this->manager = $this->getManagerFromQuery($query);
        $result = array();
        $result['projects'] = $this->get_number_of_projects($user);
        $result['organisms'] = $this->get_number_of_organisms();
        $result['trait_entries'] = $this->get_number_of_trait_entries();
        $result['trait_types'] = $this->get_number_of_trait_types();
        return $result;
    }

    /**
     * @param $user FennecUser
     * @return int number_of_projects
     */
    private function get_number_of_projects($user){
        if ($user === null) {
            return 0;
        }

        $provider = $this->manager->getRepository('AppBundle:OauthProvider')->findOneBy(['provider' => $user->getProvider()]);
        if($provider === null){
            return 0;
        }

        $criteria = Criteria::create()->where(
            Criteria::expr()->eq(
                'oauthId',
                $user->getId()
            )
        )->setMaxResults(1);

        /**
         * @var Collection $webUsers
         */
        $webUsers = $provider->getWebUsers()->matching($criteria);

        if ($webUsers->count() < 1){
            return 0;
        }

        return $webUsers->first()->getData()->count();
    }

    private function get_number_of_organisms(){
        $query = $this->manager->createQuery('SELECT COUNT(o.fennecId) FROM AppBundle\Entity\Organism o');
        return $query->getSingleScalarResult();
    }

    private function get_number_of_trait_entries(){
        $query = $this->manager->createQuery('SELECT COUNT(t.id) FROM AppBundle\Entity\TraitCategoricalEntry t WHERE t.deletionDate IS NULL ');
        $numberCategorical = $query->getSingleScalarResult();
        $query = $this->manager->createQuery('SELECT COUNT(t.id) FROM AppBundle\Entity\TraitNumericalEntry t WHERE t.deletionDate IS NULL ');
        $numberNumerical = $query->getSingleScalarResult();
        return $numberCategorical + $numberNumerical;
    }

    private function get_number_of_trait_types(){
        $query = $this->manager->createQuery('SELECT COUNT(tt.id) FROM AppBundle\Entity\TraitType tt');
        return $query->getSingleScalarResult();
    }
}