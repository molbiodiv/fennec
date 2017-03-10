<?php

namespace Tests\AppBundle\Command;


use AppBundle\Command\ListWebuserCommand;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Console\Tester\CommandTester;

class ListWebuserCommandTest extends KernelTestCase
{
    public function testExecute()
    {
        self::bootKernel();
        $application = new Application(self::$kernel);

        $application->add(new ListWebuserCommand());

        $command = $application->find('app:list-webuser');
        $commandTester = new CommandTester($command);
        $commandTester->execute(array(
            'command'  => $command->getName(),
        ));

        // the output of the command in the console
        $output = $commandTester->getDisplay();
        $this->assertContains('iucn_redlist_api', $output);
    }
}