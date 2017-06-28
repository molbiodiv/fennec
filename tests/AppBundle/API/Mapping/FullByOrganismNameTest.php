<?php

namespace Tests\AppBundle\API\Mapping;

use Symfony\Component\HttpFoundation\ParameterBag;
use Tests\AppBundle\API\WebserviceTestCase;

class FullByOrganismNameTest extends WebserviceTestCase
{
    public function testExecute()
    {
        $service = $this->webservice->factory('mapping', 'fullByOrganismName');
        $result = $service->execute(new ParameterBag(array('dbversion' => $this->default_db)), null);
        $this->assertEquals(195203, count($result));
        $this->assertEquals(10, $result['Dunaliella tertiolecta']);
        $this->assertEquals([213,196104], $result['Onoclea sensibilis']);
        $this->assertEquals(353, $result['Ranunculaceae']);
        $this->assertEquals(1224, $result['Nymphaea']);
        $this->assertEquals(12341, $result['Diphasiastrum alpinum']);
    }
}
