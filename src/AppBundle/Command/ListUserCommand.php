<?php

namespace AppBundle\Command;


use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Helper\Table;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class ListUserCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
        // the name of the command (the part after "bin/console")
        ->setName('app:list-user')

        // the short description shown while running "php bin/console list"
        ->setDescription('Lists existing users.')

        // the full command description shown when running the command with
        // the "--help" option
        ->setHelp("This command allows you to list all existing users...")
        ->addOption('connection', 'c', InputOption::VALUE_REQUIRED, 'The database version')
    ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $connection_name = $input->getOption('connection');
        if($connection_name == null) {
            $connection_name = $this->getContainer()->get('doctrine')->getDefaultConnectionName();
        }
        $orm = $this->getContainer()->get('app.orm');
        $em = $orm->getManagerForVersion($connection_name);
        $users = $em->getRepository('AppBundle:FennecUser')->findAll();
        $table = new Table($output);
        $table->setHeaders(['user_id', 'github_id', 'firstName', 'lastName', 'username']);
        foreach($users as $user){
            $table->addRow([$user->getId(), $user->getGithubId(), $user->getFirstName(), $user->getLastName(), $user->getUsername()]);
        }
        $table->render();
    }
}