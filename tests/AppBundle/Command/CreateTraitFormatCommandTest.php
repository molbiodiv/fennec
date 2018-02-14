<?php

namespace Tests\AppBundle\Command;

use AppBundle\Command\CreateTraitFormatCommand;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Console\Tester\CommandTester;

class CreateTraitFormatCommandTest extends KernelTestCase
{
    public function testExecute()
    {
        self::bootKernel();

        $em = self::$kernel->getContainer()->get('doctrine')->getManager('test_data');
        $testFormat = $em->getRepository('AppBundle:TraitFormat')->findOneBy(array(
            'format' => 'TestFormat'
        ));
        $this->assertNull($testFormat, 'Before creation the "TestFormat" does not exist.');

        $application = new Application(self::$kernel);

        $application->add(new CreateTraitFormatCommand());

        $command = $application->find('app:create-traitformat');
        $commandTester = new CommandTester($command);
        $args = array(
            'command'  => $command->getName(),
            'format' => 'TestFormat'
        );
        $commandTester->execute($args);

        // the output of the command in the console
        $output = $commandTester->getDisplay();
        $this->assertContains('TraitFormat successfully created', $output);

        $testFormat = $em->getRepository('AppBundle:TraitFormat')->findOneBy(array(
            'format' => 'TestFormat'
        ));
        $this->assertNotNull($testFormat, 'After creation the "TestFormat" does exist.');
        $this->assertEquals('TestFormat', $testFormat->getFormat());

        $commandTester->execute($args);
        $output = $commandTester->getDisplay();
        $this->assertContains('TraitFormat already exists, nothing to do.', $output);
    }
}