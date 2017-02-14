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
        return $query->getSingleScalarResult();
    }

    private function get_number_of_trait_types(){
        $query = $this->manager->createQuery('SELECT COUNT(tt.id) FROM AppBundle\Entity\TraitType tt');
        return $query->getSingleScalarResult();
    }
}