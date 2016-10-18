<?php

namespace Test\AppBundle\API\Details;

use AppBundle\API\Details\OrganismsWithTrait;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\ParameterBag;

class OrganismsWithTraitTest extends WebTestCase
{
    public function testExecute()
    {
        $container = static::createClient()->getContainer();
        $default_db = $container->getParameter('default_db');
        $service = $container->get('app.api.webservice')->factory('details', 'organismsWithTrait');
        //Test for the correct number of elements in the returned array
        $results = $service->execute(new ParameterBag(array(
            'dbversion' => $default_db,
            'trait_type_id' => 1)),
            null
        );
        $this->assertEquals(OrganismsWithTrait::DEFAULT_LIMIT, count($results));
        $results = $service->execute(
            new ParameterBag(array(
                'dbversion' => $default_db,
                'trait_type_id' => 1, 'limit' => 10
            )),
            null
        );
        $this->assertEquals(10, count($results));
    }
}