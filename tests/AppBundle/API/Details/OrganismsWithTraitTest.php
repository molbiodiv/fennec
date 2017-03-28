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
                'trait_type_id' => 3, 'limit' => 30000
            )),
            null
        );
        $this->assertEquals(23185, count($results));

        $results = $service->execute(
            new ParameterBag(array(
                'dbversion' => $default_db,
                'trait_type_id' => 1, 'limit' => 10
            )),
            null
        );
        $this->assertEquals(10, count($results));
        $this->assertTrue(array_key_exists('fennec_id',$results[0]));
        $this->assertTrue(array_key_exists('scientific_name',$results[0]));

        // Use numerical trait
        $results = $service->execute(
            new ParameterBag(array(
                'dbversion' => $default_db,
                'trait_type_id' => 7, 'limit' => 12
            )),
            null
        );
        $this->assertEquals(12, count($results));
        $this->assertTrue(array_key_exists('fennec_id',$results[0]));
        $this->assertTrue(array_key_exists('scientific_name',$results[0]));
    }
}