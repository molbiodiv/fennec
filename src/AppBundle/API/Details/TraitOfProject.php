<?php

namespace AppBundle\API\Details;

use AppBundle\API\Webservice;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Web Service.
 * Return trait details of project
 */
class TraitOfProject extends Webservice
{

    /**
     * @inheritdoc
     * @returns Array $result
     * see output of details/Traits.php
     */
    public function execute(ParameterBag $query, SessionInterface $session = null)
    {
        $service = $this->factory('details', 'OrganismsOfProject');
        $results = $service->execute($query, $session);
        if (key_exists('error', $results)){
            return $results;
        }
        $service = $this->factory('details', 'traits');
        $query->set('fennec_ids', $results);
        $results = $service->execute($query, $session);

        return $results;
    }
}