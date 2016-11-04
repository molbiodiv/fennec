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
            'Galactites tomentosa',
            'Austrolejeunea bidentata',
            'Melilotus infestus',
            'Cyclogramma sp. 73',
            'Willkommia'
        ];
        $expected = [
            'Galactites tomentosa' => 505,
            'Austrolejeunea bidentata' => 1337,
            'Melilotus infestus' => 1564,
            'Cyclogramma sp. 73' => 1559,
            'Willkommia' => 1727
        ];
        $result = $service->execute(new ParameterBag(array('dbversion' => $this->default_db, 'ids' => $names)),
            null);
        $this->assertEquals($expected, $result);

        // Test with some non-existing IDs
        $names = [
            'Galactites tomentosa',
            'Austrolejeunea bidentata',
            'Melilotus infestus',
            'Cyclogramma sp. 73',
            'Willkommia',
            'non_existing'
        ];
        $expected = [
            'Galactites tomentosa' => 505,
            'Austrolejeunea bidentata' => 1337,
            'Melilotus infestus' => 1564,
            'Cyclogramma sp. 73' => 1559,
            'Willkommia' => 1727,
            'non_existing' => null
        ];
        $result = $service->execute(new ParameterBag(array('dbversion' => $this->default_db, 'ids' => $names)),
            null);
        $this->assertEquals($expected, $result);
    }
}
