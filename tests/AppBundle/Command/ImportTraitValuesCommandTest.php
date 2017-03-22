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

        $application->add(new ImportTraitEntriesCommand());

        $this->command = $application->find('app:import-trait-entries');
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

    public function testImportByScinameNonUnique(){
        $this->assertNull($this->em->getRepository('AppBundle:TraitCategoricalValue')->findOneBy(array(
            'value' => 'ZYX'
        )), 'before import there is no IUCN status "ZYX"');
        $this->assertNull($this->em->getRepository('AppBundle:TraitCitation')->findOneBy(array(
            'citation' => 'iucn_fantasy3'
        )), 'before import there is no citation "iucn_fantasy3"');
        $organism1 = new \AppBundle\Entity\Organism();
        $organism1->setScientificName('Duplicate');
        $organism2 = new \AppBundle\Entity\Organism();
        $organism2->setScientificName('Duplicate');
        $this->em->persist($organism1);
        $this->em->persist($organism2);
        $this->em->flush();
        $this->commandTester->execute(array(
            'command' => $this->command->getName(),
            '--user-id' => 1,
            '--traittype' => 'IUCN Threat Status',
            'file' => __DIR__.'/files/iucnRedlistScinameNonUnique.tsv',
            '--mapping' => 'scientific_name'
        ));
        $output = $this->commandTester->getDisplay();
        $this->assertContains('multiple mappings to fennec ids found', $output);
        $this->assertNull($this->em->getRepository('AppBundle:TraitCategoricalValue')->findOneBy(array(
            'value' => 'ZYX'
        )), 'after failed import there is still no IUCN status "ZYX"');
        $this->assertNull($this->em->getRepository('AppBundle:TraitCitation')->findOneBy(array(
            'citation' => 'iucn_fantasy3'
        )), 'after failed import there is still no citation "iucn_fantasy3"');

        // if skip-unmapped is set the trait entries without conflicts should be imported
        $this->commandTester->execute(array(
            'command' => $this->command->getName(),
            '--user-id' => 1,
            '--traittype' => 'IUCN Threat Status',
            'file' => __DIR__.'/files/iucnRedlistScinameNonUnique.tsv',
            '--mapping' => 'scientific_name',
            '--skip-unmapped' => true
        ));
        $output = $this->commandTester->getDisplay();
        $this->assertContains('Skipped', $output);
        $this->assertNotNull($this->em->getRepository('AppBundle:TraitCategoricalValue')->findOneBy(array(
            'value' => 'ZYX'
        )), 'after import with --skip-unmapped flag there is a IUCN status "ZYX"');
        $this->assertNotNull($this->em->getRepository('AppBundle:TraitCitation')->findOneBy(array(
            'citation' => 'iucn_fantasy3'
        )), 'after import with --skip-unmapped flag there is a citation "iucn_fantasy3"');
    }

    public function testImportByEOL()
    {
        $this->assertNull($this->em->getRepository('AppBundle:TraitCategoricalValue')->findOneBy(array(
            'value' => 'fantasyTree'
        )), 'before import there is no plant habit "fantasyTree"');
        $this->assertNull($this->em->getRepository('AppBundle:TraitCitation')->findOneBy(array(
            'citation' => 'eol_fantasy'
        )), 'before import there is no citation "eol_fantasy"');
        $this->commandTester->execute(array(
            'command' => $this->command->getName(),
            '--user-id' => 1,
            '--traittype' => 'Plant Habit',
            'file' => __DIR__ . '/files/plantHabitEOL.tsv',
            '--mapping' => 'EOL'
        ));
        $fantasyTree = $this->em->getRepository('AppBundle:TraitCategoricalValue')->findOneBy(array(
            'value' => 'fantasyTree'
        ));
        $this->assertNotNull($fantasyTree, 'after import there is a plant habit "fantasyTree"');
        $this->assertNotNull($this->em->getRepository('AppBundle:TraitCitation')->findOneBy(array(
            'citation' => 'eol_fantasy'
        )), 'after import there is a citation "eol_fantasy"');
        $this->assertEquals(3, count($this->em->getRepository('AppBundle:TraitCategoricalEntry')->findBy(array(
            'traitCategoricalValue' => $fantasyTree
        ))), 'There are three entries with plant habit "fantasyTree"');
        /**
         * @var TraitCategoricalEntry
         */
        $barbeyaEntry = $this->em->getRepository('AppBundle:TraitCategoricalEntry')->findOneBy(array(
            'originUrl' => 'http://example.com/eol11887710'
        ));
        $this->assertNotNull($barbeyaEntry, 'The entry with origin url for eol id 11887710 exists');
        $this->assertEquals(3313, $barbeyaEntry->getFennec()->getFennecId(),
            'The trait has been assigned to the correct organism');
    }

    public function testImportWithUnmappableID(){
        // Check for error if value can not be mapped
        $this->assertNull($this->em->getRepository('AppBundle:TraitCategoricalValue')->findOneBy(array(
            'value' => 'fantasyTree2'
        )), 'before import there is no plant habit "fantasyTree2"');
        $this->assertNull($this->em->getRepository('AppBundle:TraitCitation')->findOneBy(array(
            'citation' => 'eol_fantasy2'
        )), 'before import there is no citation "eol_fantasy2"');
        $this->commandTester->execute(array(
            'command' => $this->command->getName(),
            '--user-id' => 1,
            '--traittype' => 'Plant Habit',
            'file' => __DIR__.'/files/plantHabitEOL_missing.tsv',
            '--mapping' => 'EOL'
        ));
        $output = $this->commandTester->getDisplay();
        $this->assertContains('no mapping to fennec id found', $output);
        $this->assertNull($this->em->getRepository('AppBundle:TraitCategoricalValue')->findOneBy(array(
            'value' => 'fantasyTree2'
        )), 'after failed import there is still no plant habit "fantasyTree2"');
        $this->assertNull($this->em->getRepository('AppBundle:TraitCitation')->findOneBy(array(
            'citation' => 'eol_fantasy2'
        )), 'after failed import there is still no citation "eol_fantasy2"');
        // check for correct application of --skip-unmapped flag
        $this->commandTester->execute(array(
            'command' => $this->command->getName(),
            '--user-id' => 1,
            '--traittype' => 'Plant Habit',
            'file' => __DIR__.'/files/plantHabitEOL_missing.tsv',
            '--mapping' => 'EOL',
            '--skip-unmapped' => true
        ));
        $output = $this->commandTester->getDisplay();
        $this->assertContains('Skipped', $output);
        $this->assertNotNull($this->em->getRepository('AppBundle:TraitCategoricalValue')->findOneBy(array(
            'value' => 'fantasyTree2'
        )), 'after import with --skip-unmapped flag there is a plant habit "fantasyTree2"');
        $this->assertNotNull($this->em->getRepository('AppBundle:TraitCitation')->findOneBy(array(
            'citation' => 'eol_fantasy2'
        )), 'after import with --skip-unmapped flag there is a citation "eol_fantasy2"');
    }
}