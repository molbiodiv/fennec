<?php

namespace Tests\AppBundle\API\Mapping;

use Symfony\Component\HttpFoundation\ParameterBag;
use Tests\AppBundle\API\WebserviceTestCase;
use AppBundle\API\Mapping;

class FullByDbxrefIdTest extends WebserviceTestCase
{
    private $em;
    private $mappingFullByDbxrefId;

    public function setUp()
    {
        $kernel = self::bootKernel();

        $this->em = $kernel->getContainer()
            ->get('doctrine')
            ->getManager('test');
        $this->mappingFullByDbxrefId = $kernel->getContainer()->get(Mapping\FullByDbxrefId::class);

    }

    public function tearDown()
    {
        parent::tearDown();

        $this->em->close();
        $this->em = null; // avoid memory leaks
    }

    public function testByNcbiTaxonomy()
    {
        $dbname = 'ncbi_taxonomy';
        $result = $this->mappingFullByDbxrefId->execute($dbname);
        $this->assertEquals(181839, count($result));
        $this->assertEquals(29, $result['3070']);
        $this->assertEquals(748, $result['3880']);
        $this->assertEquals(3894, $result['38212']);
        $this->assertEquals(7983, $result['53750']);
    }

    public function testByEOL()
    {
        $dbname = 'EOL';
        $result = $this->mappingFullByDbxrefId->execute($dbname);
        $this->assertEquals(173027, count($result));
        $this->assertEquals(24571, $result['3812']);
        $this->assertEquals(148571, $result['994360']);
        $this->assertEquals(6664, $result['99084']);
        $this->assertEquals(18587, $result['93252']);
    }
}
