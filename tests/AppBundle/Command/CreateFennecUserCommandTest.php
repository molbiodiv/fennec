<?php

namespace Tests\AppBundle\Command;

use AppBundle\Command\CreateUserCommand;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Console\Tester\CommandTester;

class CreateFennecUserCommandTest extends KernelTestCase
{
    const NICKNAME = 'CreateTestUser';
    const USERID = 'CreateTestUser';

    public function testExecute()
    {
        self::bootKernel();

        $em = self::$kernel->getContainer()->get('doctrine')->getManager('test');
        $testUser = $em->getRepository('AppBundle:FennecUser')->findOneBy(array(
            'username' => CreateFennecUserCommandTest::NICKNAME
        ));
        $this->assertNull($testUser, 'Before creation the "TestWebuserCreate" user does not exist.');

        $application = new Application(self::$kernel);

        $application->add(new CreateUserCommand());

        $command = $application->find('app:create-user');
        $commandTester = new CommandTester($command);
        $args = array(
            'command'  => $command->getName(),
            'username' => 'CreateTestUser',
            'email' => 'CreateTestUser@test.de',
            'password' => 'password'
        );
        $commandTester->execute($args);

        // the output of the command in the console
        $output = $commandTester->getDisplay();
        $this->assertContains('Webuser successfully created', $output);

        $testUser = $em->getRepository('AppBundle:FennecUser')->findOneBy(array(
            'username' => CreateFennecUserCommandTest::NICKNAME
        ));
        $this->assertNotNull($testUser, 'After creation the "TestWebuserCreate" user does exist.');
        $this->assertEquals('CreateTestUser', $testUser->getUsername());

        $commandTester->execute($args);
        $output = $commandTester->getDisplay();
        $this->assertContains('User already exists, nothing to do.', $output);
    }
}