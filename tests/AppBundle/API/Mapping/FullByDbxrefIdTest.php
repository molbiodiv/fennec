<?php

namespace Tests\AppBundle\API\Mapping;

use Symfony\Component\HttpFoundation\ParameterBag;
use Tests\AppBundle\API\WebserviceTestCase;

class FullByDbxrefIdTest extends WebserviceTestCase
{
    public function testByNcbiTaxonomy()
    {
        $service = $this->webservice->factory('mapping', 'fullByDbxrefId');
        $result = $service->execute(new ParameterBag(array('dbversion' => $this->default_db, 'db' => 'ncbi_taxonomy')), null);
        $this->assertEquals(181839, count($result));
        $this->assertEquals(29, $result['3070']);
        $this->assertEquals(748, $result['3880']);
        $this->assertEquals(3894, $result['38212']);
        $this->assertEquals(7983, $result['53750']);
    }

    public function testByEOL()
    {
        $service = $this->webservice->factory('mapping', 'fullByDbxrefId');
        $result = $service->execute(new ParameterBag(array('dbversion' => $this->default_db, 'db' => 'EOL')), null);
        $this->assertEquals(173027, count($result));
        $this->assertEquals(24571, $result['3812']);
        $this->assertEquals(148571, $result['994360']);
        $this->assertEquals(6664, $result['99084']);
        $this->assertEquals(18587, $result['93252']);
    }
}
