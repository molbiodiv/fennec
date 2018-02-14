<?php

namespace Tests\AppBundle\Command;


use AppBundle\Command\ImportOrganismIDsCommand;
use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Tester\CommandTester;

class ImportOrganismIDsCommandTest extends KernelTestCase
{
    /**
     * @var EntityManager
     */
    private $em;
    /**
     * @var CommandTester
     */
    private $commandTester;
    /**
     * @var Command
     */
    private $command;

    public function setUp()
    {
        self::bootKernel();
        $application = new Application(self::$kernel);

        $application->add(new ImportOrganismIDsCommand());

        $this->command = $application->find('app:import-organism-ids');
        $this->commandTester = new CommandTester($this->command);
        $this->em = self::$kernel->getContainer()->get('doctrine')->getManager('test_data');
    }

    public function testExecute()
    {
        $this->commandTester->execute(array(
            'command' => $this->command->getName(),
            'file' => __DIR__ . '/files/emptyFile.tsv'
        ));
        // the output of the command in the console
        $output = $this->commandTester->getDisplay();
        $this->assertContains('Importer', $output);
    }

    public function testImportFennecID(){
        $this->assertNull($this->em->getRepository('AppBundle:Db')->findOneBy(array(
            'name' => 'organismDBWithFennecIDProvider'
        )), 'before import there is no db named "organismDBWithFennecIDProvider"');
        $this->commandTester->execute(array(
            'command' => $this->command->getName(),
            'file' => __DIR__ . '/files/organismIDs_fennec_id.tsv',
            '--provider' => 'organismDBWithFennecIDProvider',
            '--description' => 'organismDBWithFennecIDDescription',
            '--batch-size' => 1
        ));
        if($this->commandTester->getStatusCode() !== 0){
            echo $this->commandTester->getDisplay();
        }
        $provider = $this->em->getRepository('AppBundle:Db')->findOneBy(array(
            'name' => 'organismDBWithFennecIDProvider'
        ));
        $this->assertNotNull($provider, 'after import there is a db named "organismDBWithFennecIDProvider"');
        $rbID = $this->em->getRepository('AppBundle:FennecDbxref')->findOneBy(array(
            'db' => $provider,
            'fennec' => 27
        ))->getIdentifier();
        $this->assertEquals($rbID, 2, 'The fennec id 27 has been linked to id 2');

    }

    public function testImportScientificName(){
        $this->assertNull($this->em->getRepository('AppBundle:Db')->findOneBy(array(
            'name' => 'organismDBWithScientificNameProvider'
        )), 'before import there is no db named "organismDBWithScientificNameProvider"');
        $this->commandTester->execute(array(
            'command' => $this->command->getName(),
            'file' => __DIR__ . '/files/organismIDs_scientificName.tsv',
            '--provider' => 'organismDBWithScientificNameProviderNonExistent',
            '--description' => 'organismDBWithScientificNameDescription',
            '--mapping' => 'scientific_name'
        ));

        // reset of em is required. otherwise last rollback might still be in process
        self::$kernel->getContainer()->get('doctrine')->resetManager('test_data');

        $output = $this->commandTester->getDisplay();
        // Expect error due to unmappable organism
        $this->assertContains('Error', $output);
        $fennec = $this->em->getRepository("AppBundle:Organism")->findOneBy(array(
            'scientificName' => 'Coptosperma littorale'
        ));
        $provider = $this->em->getRepository('AppBundle:Db')->findOneBy(array(
            'name' => 'organismDBWithScientificNameProviderNonExistent'
        ));
        $this->assertNull($provider, 'nothing should be imported if there is an error due to unmappable scientific name');

        $this->commandTester->execute(array(
            'command' => $this->command->getName(),
            'file' => __DIR__ . '/files/organismIDs_scientificName.tsv',
            '--provider' => 'organismDBWithScientificNameProvider',
            '--description' => 'organismDBWithScientificNameDescription',
            '--mapping' => 'scientific_name',
            '--skip-unmapped' => true
        ));
        $provider = $this->em->getRepository('AppBundle:Db')->findOneBy(array(
            'name' => 'organismDBWithScientificNameProvider'
        ));
        $this->assertNotNull($provider, 'after import there is a db named "organismDBWithScientificNameProvider"');
        $rbID = $this->em->getRepository('AppBundle:FennecDbxref')->findOneBy(array(
            'db' => $provider,
            'fennec' => $fennec
        ))->getIdentifier();
        $this->assertEquals($rbID, 362, 'Coptosperma littorale has been linked to id 362');
    }

    public function testImportNcbiID(){
        $this->assertNull($this->em->getRepository('AppBundle:Db')->findOneBy(array(
            'name' => 'organismDBWithNcbiIDProvider'
        )), 'before import there is no db named "organismDBWithNcbiIDProvider"');
        $this->commandTester->execute(array(
            'command' => $this->command->getName(),
            'file' => __DIR__ . '/files/organismIDs_ncbiID.tsv',
            '--provider' => 'organismDBWithNcbiIDProvider',
            '--description' => 'organismDBWithNcbiIDProviderDescription',
            '--mapping' => 'ncbi_taxonomy',
            '--skip-unmapped' => true
        ));
        $provider = $this->em->getRepository('AppBundle:Db')->findOneBy(array(
            'name' => 'organismDBWithNcbiIDProvider'
        ));
        $ncbi = $this->em->getRepository('AppBundle:Db')->findOneBy(array(
            'name' => 'ncbi_taxonomy'
        ));
        $this->assertNotNull($provider, 'after import there is a db named "organismDBWithNcbiIDProvider"');
        $this->performTestDbxrefForNcbiID($ncbi, $provider, '1905655', 987);
        $this->performTestDbxrefForNcbiID($ncbi, $provider, '301881', 19);
        $this->performTestDbxrefForNcbiID($ncbi, $provider, '121176', 19);
        $fennec = $this->em->getRepository('AppBundle:FennecDbxref')->findOneBy(array(
            'db' => $ncbi,
            'identifier' => '523875'
        ))->getFennec();
        $this->assertEquals(count($this->em->getRepository('AppBundle:FennecDbxref')->findBy(array(
            'db' => $provider,
            'fennec' => $fennec
        ))),2, 'There are two identifiers for organism 523875 (ncbi id)');
    }

    /**
     * @param $ncbi
     * @param $provider
     */
    protected function performTestDbxrefForNcbiID($ncbi, $provider, $ncbiID, $linkedId)
    {
        $fennec = $this->em->getRepository('AppBundle:FennecDbxref')->findOneBy(array(
            'db' => $ncbi,
            'identifier' => $ncbiID
        ))->getFennec();
        $rbID = $this->em->getRepository('AppBundle:FennecDbxref')->findOneBy(array(
            'db' => $provider,
            'fennec' => $fennec
        ))->getIdentifier();
        $this->assertEquals($rbID, $linkedId, 'Organism with NCBI ID '.$ncbiID.' linked to id '.$linkedId);
    }

}