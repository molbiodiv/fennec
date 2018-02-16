<?php

namespace Tests\AppBundle\API\Mapping;

use Symfony\Component\HttpFoundation\ParameterBag;
use Tests\AppBundle\API\WebserviceTestCase;
use AppBundle\API\Mapping;

class FullByOrganismNameTest extends WebserviceTestCase
{
    private $em;
    private $fullByOrganismName;
    public function setUp()
    {
        $kernel = self::bootKernel();

        $this->em = $kernel->getContainer()
            ->get('doctrine')
            ->getManager('test_data');
        $this->fullByOrganismName = $kernel->getContainer()->get(Mapping\FullByOrganismName::class);

    }

    public function tearDown()
    {
        parent::tearDown();

        $this->em->close();
        $this->em = null; // avoid memory leaks
    }

    public function testExecute()
    {
        $result = $this->fullByOrganismName->execute();
        $this->assertEquals(195203, count($result));
        $this->assertEquals(10, $result['Dunaliella tertiolecta']);
        $this->assertEquals([213,196104], $result['Onoclea sensibilis']);
        $this->assertEquals(353, $result['Ranunculaceae']);
        $this->assertEquals(1224, $result['Nymphaea']);
        $this->assertEquals(12341, $result['Diphasiastrum alpinum']);
    }
}
