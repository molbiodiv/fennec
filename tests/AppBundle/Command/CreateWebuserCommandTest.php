<?php

namespace Tests\AppBundle\Command;

use AppBundle\Command\CreateUserCommand;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Console\Tester\CommandTester;

class CreateWebuserCommandTest extends KernelTestCase
{
    public function testExecute()
    {
        self::bootKernel();

        $em = self::$kernel->getContainer()->get('app.orm')->getDefaultManager();
        $testUser = $em->getRepository('AppBundle:Webuser')->findOneBy(array(
            'oauthId' => 'TestWebuserCreate'
        ));
        $this->assertNull($testUser, 'Before creation the "TestWebuserCreate" user does not exist.');

        $application = new Application(self::$kernel);

        $application->add(new CreateUserCommand());

        $command = $application->find('app:create-webuser');
        $commandTester = new CommandTester($command);
        $args = array(
            'command'  => $command->getName(),
            '--oauth_provider' => 'TestWebuserCreateProvider',
            'oauth_id' => 'TestWebuserCreate',
        );
        $commandTester->execute($args);

        // the output of the command in the console
        $output = $commandTester->getDisplay();
        $this->assertContains('Webuser successfully created', $output);

        $testUser = $em->getRepository('AppBundle:Webuser')->findOneBy(array(
            'oauthId' => 'TestWebuserCreate'
        ));
        $this->assertNotNull($testUser, 'After creation the "TestWebuserCreate" user does exist.');
        $this->assertEquals('TestWebuserCreateProvider', $testUser->getOauthProvider()->getProvider());

        $commandTester->execute($args);
        $output = $commandTester->getDisplay();
        $this->assertContains('Webuser already exists, nothing to do.', $output);
    }
}