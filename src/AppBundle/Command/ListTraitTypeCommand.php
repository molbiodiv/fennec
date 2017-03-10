<?php

namespace AppBundle\Command;


use AppBundle\Entity\TraitType;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Helper\Table;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class ListTraitTypeCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
        // the name of the command (the part after "bin/console")
        ->setName('app:list-traittype')

        // the short description shown while running "php bin/console list"
        ->setDescription('Lists existing TraitTypes.')

        // the full command description shown when running the command with
        // the "--help" option
        ->setHelp("This command allows you to list all existing trait types...")
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
        $traitTypes = $em->getRepository('AppBundle:TraitType')->findAll();
        $table = new Table($output);
        $table->setHeaders(['ID', 'type', 'format', 'description', 'ontology_url']);
        foreach($traitTypes as $traitType){
            $table->addRow([$traitType->getId(), $traitType->getType(), $traitType->getTraitFormat()->getFormat(), $traitType->getDescription(), $traitType->getOntologyUrl()]);
        }
        $table->render();
    }
}