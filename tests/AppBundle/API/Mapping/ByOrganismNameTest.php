<?php

namespace Tests\AppBundle\API\Mapping;

use AppBundle\Entity\Organism;
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
        $result = $service->execute(new ParameterBag(array('dbversion' => $this->default_db, 'ids' => $names)), null);
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
        $result = $service->execute(new ParameterBag(array('dbversion' => $this->default_db, 'ids' => $names)), null);
        $this->assertEquals($expected, $result);

        // Test with non-unique IDs
        $em = $this->container->get('app.orm')->getDefaultManager();
        $organismRepository = $em->getRepository('AppBundle:Organism');
        $organism1 = $organismRepository->find(1);
        $organismWithSameName = new Organism();
        $organismWithSameName->setScientificName($organism1->getScientificName());
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
