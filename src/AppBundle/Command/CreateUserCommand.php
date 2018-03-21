<?php

namespace AppBundle\Command;


use AppBundle\Service\DBVersion;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Question\Question;

class CreateUserCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
        // the name of the command (the part after "bin/console")
        ->setName('app:create-user')

        // the short description shown while running "php bin/console list"
        ->setDescription('Creates new User.')

        // the full command description shown when running the command with
        // the "--help" option
        ->setHelp("This command allows you to create users...")
        ->addArgument('username', InputArgument::REQUIRED, 'The username of the new user')
        ->addArgument('email', InputArgument::REQUIRED, 'The email address of the new user')
        ->addArgument('password', InputArgument::OPTIONAL, 'The password of the new user')
        ->addOption('super-admin', 'a', InputOption::VALUE_NONE, 'Set the user as admin user.')
        ->addOption('inactive', null, InputOption::VALUE_NONE, 'Set the user as inactive')
    ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $output->writeln([
            'User Creator',
            '===============',
            '',
        ]);
        $em = $this->getContainer()->get(DBVersion::class)->getUserEntityManager();
        $user = $em->getRepository('AppBundle:FennecUser')->findOneBy([
            'username' => $input->getArgument('username')
        ]);
        if($user !== null){
            $output->writeln('<info>User already exists, nothing to do.</info>');
            $output->writeln('<info>User ID is: '.$user->getId().'</info>');
            return;
        }
        $username = $input->getArgument('username');
        $email = $input->getArgument('email');
        $password = $input->getArgument('password');

        if(!$password){
            // Inspired by example in symfony 3.4 docu: http://symfony.com/doc/3.4/components/console/helpers/questionhelper.html
            $helper = $this->getHelper('question');
            $question = new Question('Please enter your password: ');
            $question->setValidator(function ($value) {
                if (trim($value) == '') {
                    throw new \Exception('The password cannot be empty');
                }
                return $value;
            });
            $question->setHidden(true);
            $question->setMaxAttempts(20);
            $password = $helper->ask($input, $output, $question);
        }

        $inactive = $input->getOption('inactive');
        $superadmin = $input->getOption('super-admin');
        $manipulator = $this->getContainer()->get('fos_user.util.user_manipulator');
        $manipulator->create($username, $password, $email, !$inactive, $superadmin);
        $output->writeln('<info>User successfully created: '.$username.'</info>');
    }
}