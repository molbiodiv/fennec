<?php

namespace Tests\AppBundle\API\Mapping;

use Symfony\Component\HttpFoundation\ParameterBag;
use Tests\AppBundle\API\WebserviceTestCase;
use AppBundle\API\Mapping;

class ByDbxrefIdTest extends WebserviceTestCase
{
    private $em;
    private $mappingByDbxrefId;

    public function setUp()
    {
        $kernel = self::bootKernel();

        $this->em = $kernel->getContainer()
            ->get('doctrine')
            ->getManager('test');
        $this->mappingByDbxrefId = $kernel->getContainer()->get(Mapping\ByDbxrefId::class);

    }

    public function tearDown()
    {
        parent::tearDown();

        $this->em->close();
        $this->em = null; // avoid memory leaks
    }

    public function testWithExistingNCBIIds()
    {
        $ncbi_ids = [1174942, 471708, 1097649, 1331079];
        $expected = [1174942 => 134560, 471708 => 88648, 1097649 => 127952, 1331079 => 146352];
        $result = $service->execute(new ParameterBag(array('dbversion' => $this->default_db, 'ids' => $ncbi_ids, 'db' => 'ncbi_taxonomy')),
            null);
        $this->assertEquals($expected, $result);
    }

    public function testWithSomeNonExistingIds()
    {
        $ncbi_ids = [1174942, 471708, 1097649, 1331079, -99, 'non_existing'];
        $expected = [1174942 => 134560, 471708 => 88648, 1097649 => 127952, 1331079 => 146352, -99 => null, 'non_existing' => null];
        $result = $service->execute(new ParameterBag(array('dbversion' => $this->default_db, 'ids' => $ncbi_ids, 'db' => 'ncbi_taxonomy')),
            null);
        $this->assertEquals($expected, $result);
    }

    public function testWithExistingEOLIds()
    {
        $expected = [
            1116106 => 99273,
            38161 => 23857,
            2872684 => 121992,
            39873511 => 16033,
            585322 => 137785,
            1151539 => 185959,
            6077077 => 119458,
            1148311 => 123883,
            5429983 => 63763,
            72298 => 1684
        ];
        $eol_ids = array_keys($expected);
        $result = $service->execute(new ParameterBag(array('dbversion' => $this->default_db, 'ids' => $eol_ids, 'db' => 'EOL')),
            null);
        $this->assertEquals($expected, $result);
    }

    public function testWithExistingIUCNIds(){
        $expected = [
            44392527 => 192982,
            45608 => 193968,
            33604 => 124000,
            33837 => 187895,
            35986 => 189282,
            80221048 => 196971,
            64325342 => 196269
        ];
        $iucn_ids = array_keys($expected);
        $result = $service->execute(new ParameterBag(array('dbversion' => $this->default_db, 'ids' => $iucn_ids, 'db' => 'iucn_redlist')),
            null);
        $this->assertEquals($expected, $result);
    }
}