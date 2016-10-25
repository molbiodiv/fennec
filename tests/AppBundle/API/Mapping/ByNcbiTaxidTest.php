<?php

namespace Tests\AppBundle\API\Mapping;

use Symfony\Component\HttpFoundation\ParameterBag;
use Tests\AppBundle\API\WebserviceTestCase;

class ByNcbiTaxidTest extends WebserviceTestCase
{
    public function testExecute()
    {
        $service = $this->webservice->factory('mapping', 'byNcbiTaxid');

        // Test with existing IDs
        $ncbi_ids = [1174942, 471708, 1097649, 1331079];
        $expected = [1174942 => 14, 471708 => 17, 1097649 => 61, 1331079 => 10058];
        $result = $service->execute(new ParameterBag(array('dbversion' => $this->default_db, 'ids' => $ncbi_ids)),
            null);
        $this->assertEquals($expected, $result);

        // Test with some non-existing IDs
        $ncbi_ids = [1174942, 471708, 1097649, 1331079, -99, 'non_existing'];
        $expected = [1174942 => 14, 471708 => 17, 1097649 => 61, 1331079 => 10058, -1 => null, 'non_existing' => null];
        $result = $service->execute(new ParameterBag(array('dbversion' => $this->default_db, 'ids' => $ncbi_ids)),
            null);
        $this->assertEquals($expected, $result);
    }
}