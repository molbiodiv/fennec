<?php

namespace Test\AppBundle\API\Details;

use AppBundle\API\Details\OrganismsWithTrait;
use Symfony\Component\HttpFoundation\ParameterBag;
use Tests\AppBundle\API\WebserviceTestCase;

class OrganismsWithTraitTest extends WebserviceTestCase
{
    public function testExecute()
    {
        $default_db = $this->default_db;
        $service = $this->webservice->factory('details', 'organismsWithTrait');
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