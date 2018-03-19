<?php

namespace AppBundle\Command;


use Symfony\Component\Console\Helper\Table;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class ListTraitFormatCommand extends AbstractDataDBAwareCommand
{
    protected function configure()
    {
        parent::configure();
        $this
        // the name of the command (the part after "bin/console")
        ->setName('app:list-traitformat')

        // the short description shown while running "php bin/console list"
        ->setDescription('Lists existing TraitFormats.')

        // the full command description shown when running the command with
        // the "--help" option
        ->setHelp("This command allows you to list all existing trait formats...")
    ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $em = $this->initConnection($input);
        $traitFormats = $em->getRepository('AppBundle:TraitFormat')->findAll();
        $table = new Table($output);
        $table->setHeaders(['ID', 'format']);
        foreach($traitFormats as $traitFormat){
            $table->addRow([$traitFormat->getId(), $traitFormat->getFormat()]);
        }
        $table->render();
    }
}