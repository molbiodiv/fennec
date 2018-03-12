<?php

namespace Tests\AppBundle\API\Listing;

use AppBundle\Entity\Data\Db;
use Tests\AppBundle\API\WebserviceTestCase;
use AppBundle\Entity\Data\Organism;

class OrganismsTest extends WebserviceTestCase
{
    private $em;
    private $em2;
    /**
     * @var AppBundle\API\Listing\Organisms
     */
    private $organismListing;
    /**
     * @var AppBundle\Service\DBVersion
     */
    private $dbversion;
    private $dbOnStart;

    public function setUp()
    {
        $kernel = self::bootKernel();

        $this->em = $kernel->getContainer()
            ->get('doctrine')
            ->getManager('test_data');

        $this->em2 = $kernel->getContainer()
            ->get('doctrine')
            ->getManager('test_data2');

        $this->organismListing = $kernel->getContainer()->get('AppBundle\API\Listing\Organisms');
        $this->dbversion = $kernel->getContainer()->get('AppBundle\Service\DBVersion');
        $this->dbOnStart = $this->dbversion->getConnectionName();
    }

    public function tearDown()
    {
        parent::tearDown();

        $this->em->close();
        $this->em = null; // avoid memory leaks
        $this->em2->close();
        $this->em2 = null; // avoid memory leaks
        $this->dbversion->overwriteDBVersion($this->dbOnStart);
    }

    public function testExecute()
    {
        $search = '%bla%';
        $limit = 5;
        $results = $this->em->getRepository(Organism::class)->getListOfOrganisms($limit, $search);
        $expected = array(
            array("fennecId" => 2243, "scientificName" => "Anemone blanda"),
            array("fennecId" => 3520, "scientificName" => "Lablab purpureus"),
            array("fennecId" => 4295, "scientificName" => "Tmesipteris oblanceolata"),
            array("fennecId" => 4357, "scientificName" => "Silene oblanceolata"),
            array("fennecId" => 5588, "scientificName" => "Verbascum blattaria")
        );
        $this->assertEquals($expected, $results);
    }

    public function testExecuteViaService()
    {
        $search = '%bla%';
        $limit = 5;
        $results = $this->organismListing->execute($limit, $search);
        $expected = array(
            array("fennecId" => 2243, "scientificName" => "Anemone blanda"),
            array("fennecId" => 3520, "scientificName" => "Lablab purpureus"),
            array("fennecId" => 4295, "scientificName" => "Tmesipteris oblanceolata"),
            array("fennecId" => 4357, "scientificName" => "Silene oblanceolata"),
            array("fennecId" => 5588, "scientificName" => "Verbascum blattaria")
        );
        $this->assertEquals($expected, $results);
    }
}