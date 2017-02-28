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
            'command'  => $command->getName(),
            'file' => __DIR__.'/files/emptyFile.tsv'
        ));

        // the output of the command in the console
        $output = $commandTester->getDisplay();
        $this->assertContains('Importer', $output);
    }
}