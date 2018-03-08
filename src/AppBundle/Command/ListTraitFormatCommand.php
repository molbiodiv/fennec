<?php

namespace AppBundle\Command;


use AppBundle\Service\DBVersion;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Helper\Table;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class ListTraitFormatCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
        // the name of the command (the part after "bin/console")
        ->setName('app:list-traitformat')

        // the short description shown while running "php bin/console list"
        ->setDescription('Lists existing TraitFormats.')

        // the full command description shown when running the command with
        // the "--help" option
        ->setHelp("This command allows you to list all existing trait formats...")
        ->addOption('connection', 'c', InputOption::VALUE_REQUIRED, 'The database version')
    ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $connection_name = $input->getOption('connection');
        if($connection_name == null) {
            $connection_name = $this->getContainer()->get('doctrine')->getDefaultConnectionName();
        }
        $em = $this->getContainer()->get(DBVersion::class)->getDataEntityManager();
        $traitFormats = $em->getRepository('AppBundle:TraitFormat')->findAll();
        $table = new Table($output);
        $table->setHeaders(['ID', 'format']);
        foreach($traitFormats as $traitFormat){
            $table->addRow([$traitFormat->getId(), $traitFormat->getFormat()]);
        }
        $table->render();
    }
}