<?php

namespace AppBundle\API\Listing;

use AppBundle\API\Webservice;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\HttpFoundation\Session\Session;

class Overview extends Webservice
{
    private $database;

    /**
     * @inheritdoc
     */
    public function execute(ParameterBag $query, Session $session){
        $this->database = $this->getDbFromQuery($query);
        $result = array();
        $result['projects'] = $this->get_number_of_projects($session);
        $result['organisms'] = $this->get_number_of_organisms();
        $result['trait_entries'] = $this->get_number_of_trait_entries();
        $result['trait_types'] = $this->get_number_of_trait_types();
        return $result;
    }

    /**
     * @param $session Session
     * @return int number_of_projects
     */
    private function get_number_of_projects($session){
        if ($session === null || !$session->has('user')) {
            return 0;
        }
        $query_get_user_projects = <<<EOF
SELECT
    COUNT(*)
    FROM full_webuser_data WHERE provider = :provider AND oauth_id = :oauth_id
EOF;
        $stm_get_user_projects = $this->database->prepare($query_get_user_projects);
        $stm_get_user_projects->bindValue('provider', $session->get('user')['provider']);
        $stm_get_user_projects->bindValue('oauth_id', $session->get('user')['id']);
        $stm_get_user_projects->execute();
        $row = $stm_get_user_projects->fetch(\PDO::FETCH_ASSOC);
        return $row['count'];
    }

    private function get_number_of_organisms(){
        $query_get_number_of_organisms = <<<EOF
SELECT
    COUNT(*)
    FROM organism
EOF;
        $stm_get_number_of_organisms = $this->database->prepare($query_get_number_of_organisms);
        $stm_get_number_of_organisms->execute();
        $row = $stm_get_number_of_organisms->fetch(\PDO::FETCH_ASSOC);
        return $row['count'];
    }

    private function get_number_of_trait_entries(){
        $query_get_number_of_trait_entries = <<<EOF
SELECT
    COUNT(*)
    FROM trait_categorical_entry
EOF;
        $stm_get_number_of_trait_entries = $this->database->prepare($query_get_number_of_trait_entries);
        $stm_get_number_of_trait_entries->execute();
        $row = $stm_get_number_of_trait_entries->fetch(\PDO::FETCH_ASSOC);
        return $row['count'];
    }

    private function get_number_of_trait_types(){
        $query_get_number_of_trait_types = <<<EOF
SELECT
    COUNT(*)
    FROM trait_type
EOF;
        $stm_get_number_of_trait_types = $this->database->prepare($query_get_number_of_trait_types);
        $stm_get_number_of_trait_types->execute();
        $row = $stm_get_number_of_trait_types->fetch(\PDO::FETCH_ASSOC);
        return $row['count'];
    }
}