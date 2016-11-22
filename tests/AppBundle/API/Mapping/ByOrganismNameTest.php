<?php

namespace Tests\AppBundle\API\Mapping;

use Symfony\Component\HttpFoundation\ParameterBag;
use Tests\AppBundle\API\WebserviceTestCase;

class ByOrganismNameTest extends WebserviceTestCase
{
    public function testExecute()
    {
        $service = $this->webservice->factory('mapping', 'byOrganismName');

        // Test with existing IDs
        $names = [
            'Austrolejeunea bidentata',
            'Melilotus infestus',
            'Cyclogramma sp. 73',
            'Willkommia'
        ];
        $expected = [
            'Austrolejeunea bidentata' => 160643,
            'Melilotus infestus' => 167801,
            'Cyclogramma sp. 73' => 130395,
            'Willkommia' => 83683
        ];
        $result = $service->execute(new ParameterBag(array('dbversion' => $this->default_db, 'ids' => $names)),
            null);
        $this->assertEquals($expected, $result);

        // Test with some non-existing IDs
        $names = [
            'Austrolejeunea bidentata',
            'Melilotus infestus',
            'Cyclogramma sp. 73',
            'Willkommia',
            'non_existing'
        ];
        $expected = [
            'Austrolejeunea bidentata' => 160643,
            'Melilotus infestus' => 167801,
            'Cyclogramma sp. 73' => 130395,
            'Willkommia' => 83683,
            'non_existing' => null
        ];
        $result = $service->execute(new ParameterBag(array('dbversion' => $this->default_db, 'ids' => $names)),
            null);
        $this->assertEquals($expected, $result);
    }
}
