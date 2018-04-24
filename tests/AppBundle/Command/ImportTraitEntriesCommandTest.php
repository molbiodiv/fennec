<?php

namespace Tests\AppBundle\Command;


use AppBundle\Command\ImportTraitEntriesCommand;
use AppBundle\Entity\Data\TraitCategoricalEntry;
use AppBundle\Entity\Data\TraitFormat;
use AppBundle\Entity\Data\TraitType;
use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Tester\CommandTester;

class ImportTraitEntriesCommandTest extends KernelTestCase
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
        $this->em = self::$kernel->getContainer()->get('doctrine')->getManager('test_data');
    }

    public function testExecute()
    {
        $this->commandTester->execute(array(
            'command' => $this->command->getName(),
            'file' => __DIR__ . '/files/emptyFile.tsv',
            '--provider' => 'traitEntryImporter_test'
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
            '--provider' => 'traitEntryImporter_testByFennecID',
            '--description' => 'traitEntryImporter test ImportByFennecID',
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

    public function testImportByFennecIDDefaultCitation(){
        $this->assertNull($this->em->getRepository('AppBundle:TraitCitation')->findOneBy(array(
            'citation' => 'fantasy3'
        )), 'before import there is no citation "fantasy3"');
        $this->assertNull($this->em->getRepository('AppBundle:TraitCitation')->findOneBy(array(
            'citation' => 'defaultFantasy'
        )), 'before import there is no citation "defaultFantasy"');
        $this->commandTester->execute(array(
            'command' => $this->command->getName(),
            '--provider' => 'traitEntryImporter_testDefaultCitation',
            '--traittype' => 'Flower Color',
            '--default-citation' => 'defaultFantasy',
            'file' => __DIR__.'/files/flowerColors_defaultCitation.tsv'
        ));
        $traitCitation = $this->em->getRepository('AppBundle:TraitCitation')->findOneBy(array(
            'citation' => 'fantasy3'
        ));
        $this->assertNotNull($traitCitation, 'after import there is a citation "fantasy3"');
        $traitCitation = $this->em->getRepository('AppBundle:TraitCitation')->findOneBy(array(
            'citation' => 'defaultFantasy'
        ));
        $this->assertNotNull($traitCitation, 'after import there is a citation "defaultFantasy"');
        $this->assertEquals(4, count($this->em->getRepository('AppBundle:TraitCategoricalEntry')->findBy(array(
            "traitCitation" => $traitCitation
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
            '--provider' => 'traitEntryImporter_test',
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
        $organism1 = new \AppBundle\Entity\Data\Organism();
        $organism1->setScientificName('Duplicate');
        $organism2 = new \AppBundle\Entity\Data\Organism();
        $organism2->setScientificName('Duplicate');
        $this->em->persist($organism1);
        $this->em->persist($organism2);
        $this->em->flush();
        $this->commandTester->execute(array(
            'command' => $this->command->getName(),
            '--provider' => 'traitEntryImporter_test',
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

        // reset of em is required. otherwise last rollback might still be in process
        self::$kernel->getContainer()->get('doctrine')->resetManager('test_data');
        // if skip-unmapped is set the trait entries without conflicts should be imported
        $this->commandTester->execute(array(
            'command' => $this->command->getName(),
            '--provider' => 'traitEntryImporter_test',
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
            '--provider' => 'traitEntryImporter_test',
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
            '--provider' => 'traitEntryImporter_test',
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

        // reset of em is required. otherwise last rollback might still be in process
        self::$kernel->getContainer()->get('doctrine')->resetManager('test_data');
        // check for correct application of --skip-unmapped flag
        $this->commandTester->execute(array(
            'command' => $this->command->getName(),
            '--provider' => 'traitEntryImporter_test',
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

    public function testImportOfNumericTraitEntries(){
        $this->assertNull($this->em->getRepository('AppBundle:TraitType')->findOneBy(array(
            'type' => 'testPlantHeight'
        )), 'before import there is no trait type called "testPlantHeight"');
        $this->assertNull($this->em->getRepository('AppBundle:TraitCitation')->findOneBy(array(
            'citation' => 'eol_fantasy_number'
        )), 'before import there is no citation "eol_fantasy_number"');
        $testPlantHeight = new TraitType();
        $testPlantHeight->setType('testPlantHeight');
        $testPlantHeight->setUnit('m');
        $numericalFormat = $this->em->getRepository('AppBundle:TraitFormat')->findOneBy(['format' => 'numerical']);
        if($numericalFormat === null){
            $numericalFormat = new TraitFormat();
            $numericalFormat->setFormat('numerical');
            $this->em->persist($numericalFormat);
        }
        $testPlantHeight->setTraitFormat($numericalFormat);
        $this->em->persist($testPlantHeight);
        $this->em->flush();
        $this->commandTester->execute(array(
            'command' => $this->command->getName(),
            '--provider' => 'traitEntryImporter_test',
            '--traittype' => 'testPlantHeight',
            'file' => __DIR__ . '/files/plantHeightEOL.tsv',
            '--mapping' => 'EOL'
        ));
        $this->assertNotNull($this->em->getRepository('AppBundle:TraitCitation')->findOneBy(array(
            'citation' => 'eol_fantasy_number'
        )), 'after import there is a citation "eol_fantasy_number"');
        $this->assertEquals(3, count($this->em->getRepository('AppBundle:TraitNumericalEntry')->findBy(array(
            'traitType' => $testPlantHeight
        ))), 'There are three entries with type "testPlantHeight"');
        /**
         * @var TraitCategoricalEntry
         */
        $singleEntry = $this->em->getRepository('AppBundle:TraitNumericalEntry')->findOneBy(array(
            'value' => 133,
            'traitType' => $testPlantHeight
        ));
        $this->assertNotNull($singleEntry, 'The entry with value for eol id 1094535 exists');
        $this->assertEquals(35729, $singleEntry->getFennec()->getFennecId(),
            'The trait has been assigned to the correct organism');
        $dialycerasEntry = $this->em->getRepository('AppBundle:TraitNumericalEntry')->findOneBy(array(
            'originUrl' => 'http://example.com/plantHeight6875647',
            'traitType' => $testPlantHeight
        ));
        $this->assertNotNull($dialycerasEntry, 'The entry with origin url for eol id 6875647 exists');
        $this->assertEquals(23118, $dialycerasEntry->getFennec()->getFennecId(),
            'The trait has been assigned to the correct organism');
    }

    public function testImportOfWideTable(){
        $this->assertNull($this->em->getRepository('AppBundle:TraitType')->findOneBy(array(
            'type' => 'Long Table Trait'
        )), 'before import there is no trait type called "Long Table Trait"');
        $this->assertNull($this->em->getRepository('AppBundle:TraitCitation')->findOneBy(array(
            'citation' => 'Long Table Default Citation'
        )), 'before import there is no citation "Long Table Default Citation"');
        $this->commandTester->execute(array(
            'command' => $this->command->getName(),
            '--provider' => 'traitEntryImporter_test',
            '--default-citation' => "Long Table Default Citation",
            '--wide-table' => true,
            'file' => __DIR__ . '/files/wideTable.tsv'
        ));
        $output = $this->commandTester->getDisplay();
        $this->assertContains('TraitType does not exist in db: "Long Table Trait". Check for typos or create with app:create-traittype', $output);
        $this->assertNull($this->em->getRepository('AppBundle:TraitCitation')->findOneBy(array(
            'citation' => 'Long Table Default Citation'
        )), 'after failed import there is still no citation "Long Table Default Citation"');

        $wideTableTraitType = new TraitType();
        $wideTableTraitType->setType('Long Table Trait');
        $wideTableTraitType->setUnit('m');
        $numericalFormat = $this->em->getRepository('AppBundle:TraitFormat')->findOneBy(['format' => 'numerical']);
        if($numericalFormat === null){
            $numericalFormat = new TraitFormat();
            $numericalFormat->setFormat('numerical');
            $this->em->persist($numericalFormat);
        }
        $wideTableTraitType->setTraitFormat($numericalFormat);
        $this->em->persist($wideTableTraitType);
        $this->em->flush();
        $this->commandTester->execute(array(
            'command' => $this->command->getName(),
            '--provider' => 'traitEntryImporter_test',
            '--default-citation' => "Long Table Default Citation",
            '--wide-table' => true,
            'file' => __DIR__ . '/files/wideTable.tsv'
        ));
        $this->assertNotNull($this->em->getRepository('AppBundle:TraitCitation')->findOneBy(array(
            'citation' => 'Long Table Default Citation'
        )), 'after import there is a citation "Long Table Default Citation"');

        $this->assertEquals(4, count($this->em->getRepository('AppBundle:TraitNumericalEntry')->findBy(array(
            'traitType' => $wideTableTraitType
        ))), 'There are four entries with type "wideTableTrait"');
        $sparklingValue = $this->em->getRepository('AppBundle:TraitCategoricalValue')->findOneBy(array(
            'value' => "sparkling"
        ));
        $this->assertNotNull($sparklingValue, 'The value sparkling exists');
        $sparklingEntry = $this->em->getRepository("AppBundle:TraitCategoricalEntry")->findOneBy(array(
            'traitCategoricalValue' => $sparklingValue
        ));
        $this->assertEquals(23461, $sparklingEntry->getFennec()->getFennecId(),'The trait has been assigned to the correct organism');
        $this->assertEquals("Flower Color", $sparklingEntry->getTraitType()->getType(),
            'The trait has been assigned to the correct trait type');

        $iucnXXValue = $this->em->getRepository('AppBundle:TraitCategoricalValue')->findOneBy(array(
            'value' => "iucn_XX"
        ));
        $this->assertNotNull($iucnXXValue, 'The value iucn_XX exists');
        $iucnXXEntry = $this->em->getRepository("AppBundle:TraitCategoricalEntry")->findOneBy(array(
            'traitCategoricalValue' => $iucnXXValue
        ));
        $this->assertEquals(23461, $iucnXXEntry->getFennec()->getFennecId(),'The trait has been assigned to the correct organism');
        $this->assertEquals("IUCN Threat Status", $iucnXXEntry->getTraitType()->getType(),
            'The trait has been assigned to the correct trait type');
        
        $strangeValue = $this->em->getRepository('AppBundle:TraitCategoricalValue')->findOneBy(array(
            'value' => "strange"
        ));
        $this->assertNotNull($strangeValue, 'The value strange exists');
        $strangeEntry = $this->em->getRepository("AppBundle:TraitCategoricalEntry")->findOneBy(array(
            'traitCategoricalValue' => $strangeValue
        ));
        $this->assertEquals(45, $strangeEntry->getFennec()->getFennecId(),'The trait has been assigned to the correct organism');
        $this->assertEquals("Plant Habit", $strangeEntry->getTraitType()->getType(),
            'The trait has been assigned to the correct trait type');
    }

    public function testImportOfWideTableMissingValues(){
        $this->assertNull($this->em->getRepository('AppBundle:TraitCitation')->findOneBy(array(
            'citation' => 'Long Table Missing Values Default Citation'
        )), 'before import there is no citation "Long Table Missing Values Default Citation"');
        $this->commandTester->execute(array(
            'command' => $this->command->getName(),
            '--provider' => 'traitEntryImporter_test',
            '--default-citation' => "Long Table Missing Values Default Citation",
            '--wide-table' => true,
            'file' => __DIR__ . '/files/wideTable_missingValues.tsv'
        ));

        $this->assertNotNull($this->em->getRepository('AppBundle:TraitCitation')->findOneBy(array(
            'citation' => 'Long Table Missing Values Default Citation'
        )), 'after import there is a citation "Long Table Missing Values Default Citation"');

        $flowerColor = $this->em->getRepository('AppBundle:TraitType')->findOneBy(array(
            'type' => 'Flower Color'
        ));
        $plantHabit = $this->em->getRepository('AppBundle:TraitType')->findOneBy(array(
            'type' => 'Plant Habit'
        ));
        $flowerColorOf12345 = $this->em->getRepository('AppBundle:TraitCategoricalEntry')->findOneBy(array(
            'traitType' => $flowerColor,
            'fennec' => $this->em->getRepository('AppBundle:Organism')->find(12345)
        ));
        $this->assertNotNull($flowerColorOf12345, 'There is an entry for flowerColor and organism 12345');
        $this->assertEquals('purpurRed', $flowerColorOf12345->getTraitCategoricalValue()->getValue());
        $this->assertNull($this->em->getRepository('AppBundle:TraitCategoricalEntry')->findOneBy(array(
            'traitType' => $plantHabit,
            'fennec' => $this->em->getRepository('AppBundle:Organism')->find(12345)
        )), 'There is no entry for plantHabit and organism 12345');

        $plantHabit54321 = $this->em->getRepository('AppBundle:TraitCategoricalEntry')->findOneBy(array(
            'traitType' => $plantHabit,
            'fennec' => $this->em->getRepository('AppBundle:Organism')->find(54321)
        ));
        $this->assertNotNull($plantHabit54321, 'There is an entry for plantHabit and organism 54321');
        $this->assertEquals('mammutTree', $plantHabit54321->getTraitCategoricalValue()->getValue());
        $this->assertNull($this->em->getRepository('AppBundle:TraitCategoricalEntry')->findOneBy(array(
            'traitType' => $flowerColor,
            'fennec' => $this->em->getRepository('AppBundle:Organism')->find(54321)
        )), 'There is no entry for flowerColor and organism 54321');
    }

    public function testMissingCitation(){
        $this->commandTester->execute(array(
            'command' => $this->command->getName(),
            '--provider' => 'traitEntryImporter_test',
            '--traittype' => 'Flower Color',
            'file' => __DIR__.'/files/flowerColors_missingCitation.tsv'
        ));
        $this->assertGreaterThan(0, $this->commandTester->getStatusCode(), 'The command produces an error if there is no citation and no default-citation');
        $output = $this->commandTester->getDisplay();
        $this->assertContains('No citation specified', $output);
    }

    public function testMissingCitationLong(){
        $this->commandTester->execute(array(
            'command' => $this->command->getName(),
            'file' => __DIR__ . '/files/wideTable.tsv',
            '--provider' => 'traitEntryImporter_test',
            '--wide-table' => true
        ));
        // the output of the command in the console
        $this->assertGreaterThan(0, $this->commandTester->getStatusCode(), 'The command produces an error if there is no default-citation with wide-table');
        $output = $this->commandTester->getDisplay();
        $this->assertContains('No citation specified', $output);
    }

    public function testCategoricalTraitsImportWithFennecUserId(){
        // Tests before import
        $rainbow = $this->em->getRepository('AppBundle:TraitCategoricalValue')->findOneBy(array(
            'value' => 'user_rainbow'
        ));
        $this->assertNull($rainbow, 'Before import there is no trait user_rainbow');
        $fileImportEntry = $this->em->getRepository('AppBundle:TraitFileUpload')->findOneBy(array(
            'fennecUserId' => '1',
            'filename' => 'flowerColorsByUser.tsv'
        ));
        $this->assertNull($fileImportEntry, 'Before import there is no fileImportEntry for user 1 and flowerColorsByUser.tsv');

        // Import
        $this->commandTester->execute(array(
            'command' => $this->command->getName(),
            '--provider' => 'traitEntryImporter_testByFennecID',
            '--description' => 'traitEntryImporter test ImportByFennecID',
            '--traittype' => 'Flower Color',
            '--fennec-user-id' => '1',
            'file' => __DIR__.'/files/flowerColorsByUser.tsv'
        ));

        // Tests after import
        $rainbow = $this->em->getRepository('AppBundle:TraitCategoricalValue')->findOneBy(array(
            'value' => 'user_rainbow'
        ));
        $this->assertNotNull($rainbow);
        $traitEntry = $this->em->getRepository('AppBundle:TraitCategoricalEntry')->findOneBy(array(
            'traitCategoricalValue' => $rainbow
        ));
        $this->assertNotNull($traitEntry, 'After import a trait by a user there should be the related trait entry');
        $traitFileUploadEntry = $this->em->getRepository('AppBundle:TraitFileUpload')->findOneBy(array(
            'fennecUserId' => '1',
            'filename' => 'flowerColorsByUser.tsv'
        ));
        $this->assertNotNull($traitFileUploadEntry, 'After import there is a fileImportEntry for user 1 and flowerColorsByUser.tsv');
        $this->assertEquals($traitEntry->getTraitFileUpload(), $traitFileUploadEntry, 'The connection between traitType and fileUpload is correct');
    }

    public function testNumericalTraitsImportWithFennecUserId(){
        // Tests before import
        $this->assertNull($this->em->getRepository('AppBundle:TraitType')->findOneBy(array(
            'type' => 'testNumericalTraitImportByFennecUserId'
        )), 'before import there is no trait type called "testNumericalTraitImportByFennecUserId"');
        $testImportTraitByUser = new TraitType();
        $testImportTraitByUser->setType('testNumericalTraitImportByFennecUserId');
        $testImportTraitByUser->setUnit('m');
        $numericalFormat = $this->em->getRepository('AppBundle:TraitFormat')->findOneBy(['format' => 'numerical']);
        $testImportTraitByUser->setTraitFormat($numericalFormat);
        $this->em->persist($testImportTraitByUser);
        $this->em->flush();

        // Import
        $this->commandTester->execute(array(
            'command' => $this->command->getName(),
            '--provider' => 'traitEntryImporter_testByFennecID',
            '--description' => 'traitEntryImporter test ImportByFennecID',
            '--traittype' => 'testNumericalTraitImportByFennecUserId',
            '--fennec-user-id' => '1',
            'file' => __DIR__.'/files/numericalTraitsByUser.tsv'
        ));

        // Tests after import
        $traitType = $this->em->getRepository('AppBundle:TraitType')->findOneBy(array(
            'type' => 'testNumericalTraitImportByFennecUserId'
        ));
        $this->assertNotNull($traitType);
        $numEntry = $this->em->getRepository('AppBundle:TraitNumericalEntry')->findOneBy(array(
            'traitType' => $traitType
        ));
        $this->assertNotNull($numEntry, 'After import a numerical entry of type "testNumericalTraitImportByFennecUserId" exists');

        $traitFileUploadEntry = $this->em->getRepository('AppBundle:TraitFileUpload')->findOneBy(array(
            'fennecUserId' => '1',
            'filename' => 'numericalTraitsByUser.tsv'
        ));
        $this->assertNotNull($traitFileUploadEntry, 'After import there is a fileImportEntry for user 1 and numericalTraitsByUser.tsv');
        $this->assertEquals($numEntry->getTraitFileUpload(), $traitFileUploadEntry, 'The connection between traitType and fileUpload is correct');
    }
}