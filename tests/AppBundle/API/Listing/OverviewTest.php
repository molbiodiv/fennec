<?php

namespace Tests\AppBundle\API\Listing;

use AppBundle\Entity\FennecUser;
use Symfony\Component\HttpFoundation\ParameterBag;
use Tests\AppBundle\API\WebserviceTestCase;

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
            ->get('app.orm')
            ->getManagerForVersion('test');
    }

    public function tearDown()
    {
        parent::tearDown();

        $this->em->close();
        $this->em = null; // avoid memory leaks
    }

    public function testOverviewIfUserIsNotLoggedIn()
    {
        //Test for overview if user is not logged in
        $default_db = $this->default_db;
        $overview = $this->webservice->factory('listing', 'overview');
        $parameterBag = new ParameterBag(array('dbversion' => $default_db));
        $results = $overview->execute($parameterBag, null);
        $expected = array(
            "projects" => 0,
            "organisms" => 198102,
            "trait_entries" => 91494 + 7074,
            "trait_types" => 7
        );
        $this->assertEquals($expected, $results);
    }

    public function testOverviewIfUserIsLoggedIn(){
        $default_db = $this->default_db;
        //Test of correct project if the user has only one project
        $user = $this->em->getRepository('AppBundle:FennecUser')->findOneBy(array(
            'username' => OverviewTest::NICKNAME
        ));
        $overview = $this->webservice->factory('listing', 'overview');
        $parameterBag = new ParameterBag(array('dbversion' => $default_db));
        $results = $overview->execute($parameterBag, $user);
        $expected['projects'] = 0;
        $this->assertEquals($expected, $results);
    }
}