<?php

namespace Tests\AppBundle\API\Mapping;

use AppBundle\Entity\Organism;
use Symfony\Component\HttpFoundation\ParameterBag;
use Tests\AppBundle\API\WebserviceTestCase;
use AppBundle\API\Mapping;

class ByOrganismNameTest extends WebserviceTestCase
{
    private $em;
    private $mappingByOrganismName;

    public function setUp()
    {
        $kernel = self::bootKernel();

        $this->em = $kernel->getContainer()
            ->get('doctrine')
            ->getManager('test_data');
        $this->mappingByOrganismName = $kernel->getContainer()->get(Mapping\ByOrganismName::class);

    }

    public function tearDown()
    {
        parent::tearDown();

        $this->em->close();
        $this->em = null; // avoid memory leaks
    }

    public function testWithExistingIds()
    {
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
        $result = $this->mappingByOrganismName->execute($names);
        $this->assertEquals($expected, $result);
    }

    public function testWithSomeNonExistingIds()
    {
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
        $result = $this->mappingByOrganismName->execute($names);
        $this->assertEquals($expected, $result);
    }

    public function testWithNonUniqueIds(){
        $organismWithSameName = new Organism();
        $organismWithSameName->setScientificName("Citrus");
        $this->em->persist($organismWithSameName);
        $this->em->flush();
        $names = [
            'Austrolejeunea bidentata',
            'Melilotus infestus',
            'Cyclogramma sp. 73',
            'Willkommia',
            'Citrus'
        ];
        $expected = [
            'Austrolejeunea bidentata' => 160643,
            'Melilotus infestus' => 167801,
            'Cyclogramma sp. 73' => 130395,
            'Willkommia' => 83683,
            'Citrus' => array(1, $organismWithSameName->getFennecId())
        ];
        $result = $this->mappingByOrganismName->execute($names);
        $this->assertEquals($expected, $result);
        $this->em->remove($organismWithSameName);
        $this->em->flush();
    }
}
