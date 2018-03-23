<?php

namespace AppBundle\Command;


use Symfony\Component\Console\Helper\Table;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class ListTraitTypeCommand extends AbstractDataDBAwareCommand
{
    protected function configure()
    {
        parent::configure();
        $this
        // the name of the command (the part after "bin/console")
        ->setName('app:list-traittype')

        // the short description shown while running "php bin/console list"
        ->setDescription('Lists existing TraitTypes.')

        // the full command description shown when running the command with
        // the "--help" option
        ->setHelp("This command allows you to list all existing trait types...")
    ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $em = $this->initConnection($input);
        $traitTypes = $em->getRepository('AppBundle:TraitType')->findAll();
        $table = new Table($output);
        $table->setHeaders(['ID', 'type', 'format', 'description', 'ontology_url', 'unit']);
        foreach($traitTypes as $traitType){
            $table->addRow([$traitType->getId(), $traitType->getType(), $traitType->getTraitFormat()->getFormat(), $traitType->getDescription(), $traitType->getOntologyUrl(), $traitType->getUnit()]);
        }
        $table->render();
    }
}