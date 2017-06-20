<?php

namespace Tests\AppBundle\Command;


use AppBundle\Command\ImportOrganismDBCommand;
use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Tester\CommandTester;

class ImportOrganismDBCommandTest extends KernelTestCase
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

        $application->add(new ImportOrganismDBCommand());

        $this->command = $application->find('app:import-organism-db');
        $this->commandTester = new CommandTester($this->command);
        $this->em = self::$kernel->getContainer()->get('app.orm')->getManagerForVersion('test');
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

    public function testImportWithoutFennecID(){
        $this->assertNull($this->em->getRepository('AppBundle:Organism')->findOneBy(array(
            'scientificName' => 'rainbowFish'
        )), 'before import there is no scientific name "rainbowFish"');
        $this->assertNull($this->em->getRepository('AppBundle:Db')->findOneBy(array(
            'name' => 'organismDBWithoutFennecIDProvider'
        )), 'before import there is no db named "organismDBWithoutFennecIDProvider"');
        $this->commandTester->execute(array(
            'command' => $this->command->getName(),
            'file' => __DIR__ . '/files/organismDBWithoutFennecID.tsv',
            '--provider' => 'organismDBWithoutFennecIDProvider',
            '--description' => 'organismDBWithoutFennecIDDescription',
        ));
        $provider = $this->em->getRepository('AppBundle:Db')->findOneBy(array(
            'name' => 'organismDBWithoutFennecIDProvider'
        ));
        $this->assertNotNull($provider, 'after import there is a db named "organismDBWithoutFennecIDProvider"');
        $this->assertNotNull($this->em->getRepository('AppBundle:Organism')->findOneBy(array(
            'scientificName' => 'rainbowFish'
        )), 'after import there is a scientific name "rainbowFish"');
        $rbUnicorn = $this->em->getRepository('AppBundle:Organism')->findOneBy(array(
            'scientificName' => 'rainbow Unicorn'
        ));
        $rbUnicornID = $this->em->getRepository('AppBundle:FennecDbxref')->findOneBy(array(
            'db' => $provider,
            'fennec' => $rbUnicorn
        ))->getIdentifier();
        $this->assertEquals($rbUnicornID, 1357, 'The id of the rainbow Unicorn is 1357');
    }

//    public function testImportFennecID(){
//        $this->assertNull($this->em->getRepository('AppBundle:Db')->findOneBy(array(
//            'name' => 'organismDBWithFennecIDProvider'
//        )), 'before import there is no db named "organismDBWithFennecIDProvider"');
//        $this->commandTester->execute(array(
//            'command' => $this->command->getName(),
//            'file' => __DIR__ . '/files/organismDBWithFennecID.tsv',
//            '--provider' => 'organismDBWithFennecIDProvider',
//            '--description' => 'organismDBWithFennecIDDescription',
//        ));
//        $provider = $this->em->getRepository('AppBundle:Db')->findOneBy(array(
//            'name' => 'organismDBWithFennecIDProvider'
//        ));
//        $this->assertNotNull($provider, 'after import there is a db named "organismDBWithFennecIDProvider"');
//        $rbID = $this->em->getRepository('AppBundle:FennecDbxref')->findOneBy(array(
//            'db' => $provider,
//            'fennec' => 27
//        ))->getIdentifier();
//        $this->assertEquals($rbID, 2, 'The fennec id 27 has been linked to id 2');
//
//    }

}