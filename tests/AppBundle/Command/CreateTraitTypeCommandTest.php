<?php

namespace Tests\AppBundle\Command;

use AppBundle\Command\CreateTraitTypeCommand;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Console\Tester\CommandTester;

class CreateTraitTypeCommandTest extends KernelTestCase
{
    public function testExecute()
    {
        self::bootKernel();

        $em = self::$kernel->getContainer()->get('app.orm')->getDefaultManager();
        $testType = $em->getRepository('AppBundle:TraitType')->findOneBy(array(
            'type' => 'TestCategoricalTrait'
        ));
        $this->assertNull($testType, 'Before creation the "TestCategoricalTrait" does not exist.');

        $application = new Application(self::$kernel);

        $application->add(new CreateTraitTypeCommand());

        $command = $application->find('app:create-traittype');
        $commandTester = new CommandTester($command);
        $args = array(
            'command'  => $command->getName(),
            '--format' => 'categorical_free',
            '--description' => 'Test categorical trait',
            'traitname' => 'TestCategoricalTrait',
            '--ontology_url' => 'http://example.com/testOntology/tct',
            '--unit' => 'mm'
        );
        $commandTester->execute($args);

        // the output of the command in the console
        $output = $commandTester->getDisplay();
        $this->assertContains('TraitType successfully created', $output);

        $testType = $em->getRepository('AppBundle:TraitType')->findOneBy(array(
            'type' => 'TestCategoricalTrait'
        ));
        $this->assertNotNull($testType, 'After creation the "TestCategoricalTrait" does exist.');
        $this->assertEquals('Test categorical trait', $testType->getDescription());
        $this->assertEquals('categorical_free', $testType->getTraitFormat()->getFormat());
        $this->assertEquals('http://example.com/testOntology/tct', $testType->getOntologyUrl());
        $this->assertEquals('mm', $testType->getUnit());

        $commandTester->execute($args);
        $output = $commandTester->getDisplay();
        $this->assertContains('TraitType already exists, nothing to do.', $output);
    }
}