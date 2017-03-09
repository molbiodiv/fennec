<?php

namespace AppBundle\Command;


use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Helper\Table;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class ListWebuserCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
        // the name of the command (the part after "bin/console")
        ->setName('app:list-webuser')

        // the short description shown while running "php bin/console list"
        ->setDescription('Lists existing Webusers.')

        // the full command description shown when running the command with
        // the "--help" option
        ->setHelp("This command allows you to list all existing webusers...")
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
        $webusers = $em->getRepository('AppBundle:Webuser')->findAll();
        $table = new Table($output);
        $table->setHeaders(['webuser_id', 'oauth_id', 'oauth_provider']);
        foreach($webusers as $webuser){
            $table->addRow([$webuser->getWebuserId(), $webuser->getOauthId(), $webuser->getOauthProvider()->getProvider()]);
        }
        $table->render();
    }
}