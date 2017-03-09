<?php

namespace AppBundle\Command;


use AppBundle\Entity\OauthProvider;
use AppBundle\Entity\TraitType;
use AppBundle\Entity\Webuser;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class CreateWebuserCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
        // the name of the command (the part after "bin/console")
        ->setName('app:create-webuser')

        // the short description shown while running "php bin/console list"
        ->setDescription('Creates new Webuser.')

        // the full command description shown when running the command with
        // the "--help" option
        ->setHelp("This command allows you to create webusers...")
        ->addArgument('oauth_id', InputArgument::REQUIRED, 'The oauth_id of the new webuser')
        ->addOption('connection', 'c', InputOption::VALUE_REQUIRED, 'The database version')
        ->addOption('oauth_provider', 'p', InputOption::VALUE_REQUIRED, 'The oauth_provider (string), will be created if not exists', 'manually_created')
    ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $output->writeln([
            'Webuser Creator',
            '===============',
            '',
        ]);
        $connection_name = $input->getOption('connection');
        if($connection_name == null) {
            $connection_name = $this->getContainer()->get('doctrine')->getDefaultConnectionName();
        }
        $orm = $this->getContainer()->get('app.orm');
        $em = $orm->getManagerForVersion($connection_name);
        $provider = $em->getRepository('AppBundle:OauthProvider')->findOneBy([
            'provider' => $input->getOption('oauth_provider')
        ]);
        if($provider === null){
            $provider = new OauthProvider();
            $provider->setProvider($input->getOption('oauth_provider'));
            $em->persist($provider);
        }
        $webuser = $em->getRepository('AppBundle:Webuser')->findOneBy([
            'oauthId' => $input->getArgument('oauth_id'),
            'oauthProvider' => $provider
        ]);
        if($webuser !== null){
            $output->writeln('<info>Webuser already exists, nothing to do.</info>');
            $output->writeln('<info>Webuser ID is: '.$webuser->getWebuserId().'</info>');
            return;
        }
        $webuser = new Webuser();
        $webuser->setOauthId($input->getArgument('oauth_id'));
        $webuser->setOauthProvider($provider);
        $em->persist($webuser);
        $em->flush();
        $output->writeln('<info>Webuser successfully created: '.$webuser->getOauthId().'</info>');
        $output->writeln('<info>Webuser ID is: '.$webuser->getWebuserId().'</info>');
    }
}