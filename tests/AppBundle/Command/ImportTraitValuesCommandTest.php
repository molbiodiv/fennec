<?php

namespace Tests\AppBundle\Command;


use AppBundle\Command\ImportTraitValuesCommand;
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
    }
}