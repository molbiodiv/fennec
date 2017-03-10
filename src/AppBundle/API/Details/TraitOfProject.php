<?php

namespace AppBundle\API\Details;

use AppBundle\API\Webservice;
use AppBundle\User\FennecUser;
use Symfony\Component\HttpFoundation\ParameterBag;

/**
 * Web Service.
 * Return trait details of project
 */
class TraitOfProject extends Webservice
{

    /**
     * @inheritdoc
     * @returns array $result
     * see output of details/Traits.php
     */
    public function execute(ParameterBag $query, FennecUser $user = null)
    {
        $service = $this->factory('details', 'OrganismsOfProject');
        $results = $service->execute($query, $user);
        if (key_exists('error', $results)){
            return $results;
        }
        $service = $this->factory('details', 'traits');
        $query->set('fennec_ids', $results);
        $results = $service->execute($query, $user);

        return $results;
    }
}