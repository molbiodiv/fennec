<?php

namespace AppBundle\Command;


use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class CreateTraitTypeCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
        // the name of the command (the part after "bin/console")
        ->setName('app:create-traittype')

        // the short description shown while running "php bin/console list"
        ->setDescription('Creates new TraitType.')

        // the full command description shown when running the command with
        // the "--help" option
        ->setHelp("This command allows you to create trait types...")
        ->addArgument('traitname', InputArgument::REQUIRED, 'The name of the new trait type.')
        ->addOption('connection', null, InputOption::VALUE_REQUIRED, 'The database version.')
    ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $output->writeln([
            'TraitType Creator',
            '=================',
            '',
        ]);
        $orm = $this->getContainer()->get('app.orm');
        $em = $orm->getManagerForVersion($input->getOption('connection'));
        if(count($em->getRepository('AppBundle:TraitType')->findOneBy(array('type' => $input->getArgument('traitname')))) > 0){
            $output->writeln('Trait exists');
        }
        $output->writeln('Trait name: '.$input->getArgument('traitname'));
    }
}