<?php

namespace Tests\AppBundle\API\Listing;

use AppBundle\Entity\FennecUser;
use Tests\AppBundle\API\WebserviceTestCase;
use AppBundle\Entity\WebuserData;
use AppBundle\Entity\Organism;
use AppBundle\Entity\TraitCategoricalEntry;
use AppBundle\Entity\TraitNumericalEntry;
use AppBundle\Entity\TraitType;

class OverviewTest extends WebserviceTestCase
{
    const NICKNAME = 'listingOverviewTestUser';
    const USERID = 'listingOverviewTestUser';
    const PROVIDER = 'listingOverviewTestUser';

    private $em;

    public function setUp()
    {
        $kernel = self::bootKernel();
        $this->em = $kernel->getContainer()
            ->get('doctrine')
            ->getManager('test');
    }

    public function tearDown()
    {
        parent::tearDown();
        $this->em->close();
        $this->em = null; // avoid memory leaks

    }

    public function testOverviewIfUserIsNotLoggedIn()
    {
        $user = null;
        $projects = $this->em->getRepository(WebuserData::class)->getNumberOfProjects($user);
        $organisms = $this->em->getRepository(Organism::class)->getNumber();
        $traitEntries = $this->em->getRepository(TraitCategoricalEntry::class)->getNumber() + $this->em->getRepository(TraitNumericalEntry::class)->getNumber();
        $traitTypes = $this->em->getRepository(TraitType::class)->getNumber();
        $result = [
            "projects" => $projects,
            "organisms" => $organisms,
            "trait_entries" => $traitEntries,
            "trait_types" => $traitTypes
        ];
        $expected = array(
            "projects" => 0,
            "organisms" => 198102,
            "trait_entries" => 91494 + 7074,
            "trait_types" => 7
        );
        $this->assertEquals($expected, $result);
    }

    public function testOverviewIfUserIsLoggedIn(){
        $user = $this->em->getRepository(FennecUser::class)->findOneBy(array(
            "username" => OverviewTest::NICKNAME
        ));
        $projects = $this->em->getRepository(WebuserData::class)->getNumberOfProjects($user);
        $organisms = $this->em->getRepository(Organism::class)->getNumber();
        $traitEntries = $this->em->getRepository(TraitCategoricalEntry::class)->getNumber() + $this->em->getRepository(TraitNumericalEntry::class)->getNumber();
        $traitTypes = $this->em->getRepository(TraitType::class)->getNumber();
        $result = [
            "projects" => $projects,
            "organisms" => $organisms,
            "trait_entries" => $traitEntries,
            "trait_types" => $traitTypes
        ];
        $expected = array(
            "projects" => 1,
            "organisms" => 198102,
            "trait_entries" => 91494 + 7074,
            "trait_types" => 7
        );
        $this->assertEquals($expected, $result);
    }
}