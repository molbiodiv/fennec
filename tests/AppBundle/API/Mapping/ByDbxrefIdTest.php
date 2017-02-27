<?php

namespace Tests\AppBundle\API\Mapping;

use Symfony\Component\HttpFoundation\ParameterBag;
use Tests\AppBundle\API\WebserviceTestCase;

class ByDbxrefIdTest extends WebserviceTestCase
{
    public function testExecute()
    {
        $service = $this->webservice->factory('mapping', 'byDbxrefId');

        // Test with existing IDs
        $ncbi_ids = [1174942, 471708, 1097649, 1331079];
        $expected = [1174942 => 134560, 471708 => 88648, 1097649 => 127952, 1331079 => 146352];
        $result = $service->execute(new ParameterBag(array('dbversion' => $this->default_db, 'ids' => $ncbi_ids, 'db' => 'ncbi_taxonomy')),
            null);
        $this->assertEquals($expected, $result);

        // Test with some non-existing IDs
        $ncbi_ids = [1174942, 471708, 1097649, 1331079, -99, 'non_existing'];
        $expected = [1174942 => 134560, 471708 => 88648, 1097649 => 127952, 1331079 => 146352, -99 => null, 'non_existing' => null];
        $result = $service->execute(new ParameterBag(array('dbversion' => $this->default_db, 'ids' => $ncbi_ids, 'db' => 'ncbi_taxonomy')),
            null);
        $this->assertEquals($expected, $result);
    }
}