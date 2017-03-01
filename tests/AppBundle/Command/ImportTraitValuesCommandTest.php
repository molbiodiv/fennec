<?php

namespace Tests\AppBundle\Command;


use AppBundle\Command\ImportTraitValuesCommand;
use AppBundle\Entity\TraitCategoricalEntry;
use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Tester\CommandTester;

class ImportTraitValuesCommandTest extends KernelTestCase
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

    public function setUp(){
        self::bootKernel();
        $application = new Application(self::$kernel);

        $application->add(new ImportTraitValuesCommand());

        $this->command = $application->find('app:import-trait-values');
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

    public function testImportByFennecID(){
        $this->assertNull($this->em->getRepository('AppBundle:TraitCategoricalValue')->findOneBy(array(
            'value' => 'rainbow'
        )), 'before import there is no flower color "rainbow"');
        $this->assertNull($this->em->getRepository('AppBundle:TraitCitation')->findOneBy(array(
            'citation' => 'fantasy'
        )), 'before import there is no citation "fantasy"');
        $this->commandTester->execute(array(
            'command' => $this->command->getName(),
            '--user-id' => 1,
            '--traittype' => 'Flower Color',
            'file' => __DIR__.'/files/flowerColors.tsv'
        ));
        $rainbow = $this->em->getRepository('AppBundle:TraitCategoricalValue')->findOneBy(array(
            'value' => 'rainbow'
        ));
        $this->assertNotNull($rainbow, 'after import there is a flower color "rainbow"');
        $this->assertNotNull($this->em->getRepository('AppBundle:TraitCitation')->findOneBy(array(
            'citation' => 'fantasy'
        )), 'after import there is a citation "fantasy"');
        $this->assertEquals(4, count($this->em->getRepository('AppBundle:TraitCategoricalEntry')->findBy(array(
            'traitCategoricalValue' => $rainbow
        ))), 'There are four entries with flower color rainbow');
    }

    public function testImportBySciname(){
        $this->assertNull($this->em->getRepository('AppBundle:TraitCategoricalValue')->findOneBy(array(
            'value' => 'XY'
        )), 'before import there is no IUCN status "XY"');
        $this->assertNull($this->em->getRepository('AppBundle:TraitCitation')->findOneBy(array(
            'citation' => 'iucn_fantasy'
        )), 'before import there is no citation "iucn_fantasy"');
        $this->commandTester->execute(array(
            'command' => $this->command->getName(),
            '--user-id' => 1,
            '--traittype' => 'IUCN Threat Status',
            'file' => __DIR__.'/files/iucnRedlistSciname.tsv',
            '--mapping' => 'scientific_name'
        ));
        $xy = $this->em->getRepository('AppBundle:TraitCategoricalValue')->findOneBy(array(
            'value' => 'XY'
        ));
        $this->assertNotNull($xy, 'after import there is a IUCN status "XY"');
        $this->assertNotNull($this->em->getRepository('AppBundle:TraitCitation')->findOneBy(array(
            'citation' => 'iucn_fantasy'
        )), 'after import there is a citation "iucn_fantasy"');
        $this->assertEquals(3, count($this->em->getRepository('AppBundle:TraitCategoricalEntry')->findBy(array(
            'traitCategoricalValue' => $xy
        ))), 'There are three entries with iucn status "XY"');
        /**
         * @var TraitCategoricalEntry
         */
        $barbeyaEntry = $this->em->getRepository('AppBundle:TraitCategoricalEntry')->findOneBy(array(
            'originUrl' => 'http://example.com/Barbeya'
        ));
        $this->assertNotNull($barbeyaEntry, 'The entry with origin url for Barbeya exists');
        $this->assertEquals('Barbeya', $barbeyaEntry->getFennec()->getScientificName(), 'The trait has been assigned to the correct organism');
    }
}