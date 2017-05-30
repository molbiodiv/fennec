<?php

namespace Tests\AppBundle\Command;


use AppBundle\API\Details\Organism;
use AppBundle\Command\ImportTraitEntriesCommand;
use AppBundle\Entity\TraitCategoricalEntry;
use AppBundle\Entity\TraitFormat;
use AppBundle\Entity\TraitType;
use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Tester\CommandTester;

class ImportOrganismDBTest extends KernelTestCase
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

        $application->add(new ImportOrganismDBTest());

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
    }

}