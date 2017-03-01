<?php

namespace Tests\AppBundle\Command;


use AppBundle\Command\ImportTraitValuesCommand;
use AppBundle\Entity\TraitCategoricalEntry;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Console\Tester\CommandTester;

class ImportTraitValuesCommandTest extends KernelTestCase
{
    public function testExecute()
    {
        self::bootKernel();
        $application = new Application(self::$kernel);

        $application->add(new ImportTraitValuesCommand());

        $command = $application->find('app:import-trait-values');
        $commandTester = new CommandTester($command);
        $commandTester->execute(array(
            'command' => $command->getName(),
            'file' => __DIR__.'/files/emptyFile.tsv'
        ));
        // the output of the command in the console
        $output = $commandTester->getDisplay();
        $this->assertContains('Importer', $output);

        $em = self::$kernel->getContainer()->get('app.orm')->getManagerForVersion('test');
        $this->assertNull($em->getRepository('AppBundle:TraitCategoricalValue')->findOneBy(array(
            'value' => 'rainbow'
        )), 'before import there is no flower color "rainbow"');
        $this->assertNull($em->getRepository('AppBundle:TraitCitation')->findOneBy(array(
            'citation' => 'fantasy'
        )), 'before import there is no citation "fantasy"');
        $commandTester->execute(array(
            'command' => $command->getName(),
            '--user-id' => 1,
            '--traittype' => 'Flower Color',
            'file' => __DIR__.'/files/flowerColors.tsv'
        ));
        $rainbow = $em->getRepository('AppBundle:TraitCategoricalValue')->findOneBy(array(
            'value' => 'rainbow'
        ));
        $this->assertNotNull($rainbow, 'after import there is a flower color "rainbow"');
        $this->assertNotNull($em->getRepository('AppBundle:TraitCitation')->findOneBy(array(
            'citation' => 'fantasy'
        )), 'after import there is a citation "fantasy"');
        $this->assertEquals(4, count($em->getRepository('AppBundle:TraitCategoricalEntry')->findBy(array(
            'traitCategoricalValue' => $rainbow
        ))), 'There are four entries with flower color rainbow');

        $this->assertNull($em->getRepository('AppBundle:TraitCategoricalValue')->findOneBy(array(
            'value' => 'XY'
        )), 'before import there is no IUCN status "XY"');
        $this->assertNull($em->getRepository('AppBundle:TraitCitation')->findOneBy(array(
            'citation' => 'iucn_fantasy'
        )), 'before import there is no citation "iucn_fantasy"');
        $commandTester->execute(array(
            'command' => $command->getName(),
            '--user-id' => 1,
            '--traittype' => 'IUCN Threat Status',
            'file' => __DIR__.'/files/iucnRedlistSciname.tsv',
            '--mapping' => 'scientific_name'
        ));
        $xy = $em->getRepository('AppBundle:TraitCategoricalValue')->findOneBy(array(
            'value' => 'XY'
        ));
        $this->assertNotNull($xy, 'after import there is a IUCN status "XY"');
        $this->assertNotNull($em->getRepository('AppBundle:TraitCitation')->findOneBy(array(
            'citation' => 'iucn_fantasy'
        )), 'after import there is a citation "iucn_fantasy"');
        $this->assertEquals(3, count($em->getRepository('AppBundle:TraitCategoricalEntry')->findBy(array(
            'traitCategoricalValue' => $xy
        ))), 'There are three entries with iucn status "XY"');
        /**
         * @var TraitCategoricalEntry
         */
        $barbeyaEntry = $em->getRepository('AppBundle:TraitCategoricalEntry')->findOneBy(array(
            'originUrl' => 'http://example.com/Barbeya'
        ));
        $this->assertNotNull($barbeyaEntry, 'The entry with origin url for Barbeya exists');
        $this->assertEquals('Barbeya', $barbeyaEntry->getFennec()->getScientificName(), 'The trait has been assigned to the correct organism');
    }
}