<?php

namespace AppBundle\Command;


use AppBundle\Entity\FennecUser;
use AppBundle\Entity\OauthProvider;
use AppBundle\Entity\TraitType;
use AppBundle\Entity\Webuser;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

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
        ->addArgument('password', InputArgument::REQUIRED, 'The password of the new user')
        ->addOption('super-admin', 'a', InputOption::VALUE_NONE, 'Set the user as admin user.')
        ->addOption('inactive', null, InputOption::VALUE_NONE, 'Set the user as inactive')
        ->addOption('connection', 'c', InputOption::VALUE_REQUIRED, 'The database version')
        ->addOption('oauth_provider', 'p', InputOption::VALUE_REQUIRED, 'The oauth_provider (string), will be created if not exists', 'manually_created')
    ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $output->writeln([
            'User Creator',
            '===============',
            '',
        ]);
        $connection_name = $input->getOption('connection');
        if($connection_name == null) {
            $connection_name = $this->getContainer()->get('doctrine')->getDefaultConnectionName();
        }
        $orm = $this->getContainer()->get('app.orm');
        $em = $orm->getManagerForVersion($connection_name);
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
        $inactive = $input->getOption('inactive');
        $superadmin = $input->getOption('super-admin');
        $manipulator = $this->getContainer()->get('fos_user.util.user_manipulator');
        $manipulator->create($username, $password, $email, !$inactive, $superadmin);
        $output->writeln('<info>Webuser successfully created: '.$username.'</info>');
    }
}