<?php

namespace AppBundle\API\Listing;

use AppBundle\API\Webservice;
use AppBundle\User\FennecUser;
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
        $query_get_user_projects = <<<EOF
SELECT
    COUNT(*)
    FROM full_webuser_data WHERE provider = :provider AND oauth_id = :oauth_id
EOF;
        $stm_get_user_projects = $this->manager->getConnection()->prepare($query_get_user_projects);
        $stm_get_user_projects->bindValue('provider', $user->getProvider());
        $stm_get_user_projects->bindValue('oauth_id', $user->getId());
        $stm_get_user_projects->execute();
        $row = $stm_get_user_projects->fetch(\PDO::FETCH_ASSOC);
        return $row['count'];
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