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
            ->getManager('test');
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
        $organismRepository = $this->em->getRepository('AppBundle:Organism');
        $organism1 = $organismRepository->find(1);
        $organismWithSameName = new Organism();
        $organismWithSameName->setScientificName($organism1->getScientificName());
        $em->persist($organismWithSameName);
        $em->flush();
        $names = [
            'Austrolejeunea bidentata',
            'Melilotus infestus',
            'Cyclogramma sp. 73',
            'Willkommia',
            $organism1->getScientificName()
        ];
        $expected = [
            'Austrolejeunea bidentata' => 160643,
            'Melilotus infestus' => 167801,
            'Cyclogramma sp. 73' => 130395,
            'Willkommia' => 83683,
            $organism1->getScientificName() => array(1, $organismWithSameName->getFennecId())
        ];
        $result = $service->execute(new ParameterBag(array('dbversion' => $this->default_db, 'ids' => $names)), null);
        $this->assertEquals($expected, $result);
        $em->remove($organismWithSameName);
        $em->flush();
    }
}
