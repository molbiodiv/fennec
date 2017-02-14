<?php

namespace AppBundle\Command;


use AppBundle\Entity\TraitType;
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
        ->addArgument('traitname', InputArgument::REQUIRED, 'The name of the new trait type')
        ->addOption('connection', 'c', InputOption::VALUE_REQUIRED, 'The database version')
        ->addOption('format', 'f', InputOption::VALUE_REQUIRED, 'The trait format (string), must already exist', 'categorical_free')
        ->addOption('description', 'd', InputOption::VALUE_REQUIRED, 'The description of this trait type', null)
        ->addOption('ontology_url', 'o', InputOption::VALUE_REQUIRED, 'The ontology url of this trait type', null)
    ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $output->writeln([
            'TraitType Creator',
            '=================',
            '',
        ]);
        $connection_name = $input->getOption('connection');
        if($connection_name == null) {
            $connection_name = $this->getContainer()->get('doctrine')->getDefaultConnectionName();
        }
        $orm = $this->getContainer()->get('app.orm');
        $em = $orm->getManagerForVersion($connection_name);
        $format = $em->getRepository('AppBundle:TraitFormat')->findOneBy(['format' => $input->getOption('format')]);
        if($format == null){
            $output->writeln('<error>Provided TraitFormat (--format) does not exist: '.$input->getOption('format').'</error>');
            return;
        }
        /**
         * @var TraitType
         */
        $traitType = $em->getRepository('AppBundle:TraitType')->findOneBy(array('type' => $input->getArgument('traitname')));
        if($traitType !== null){
            $output->writeln('<info>TraitType already exists, nothing to do.</info>');
            $output->writeln('<info>TraitType ID is: '.$traitType->getId().'</info>');
            return;
        }
        $traitType = new TraitType();
        $traitType->setTraitFormat($format);
        $traitType->setType($input->getArgument('traitname'));
        $traitType->setDescription($input->getOption('description'));
        $traitType->setOntologyUrl($input->getOption('ontology_url'));
        $em->persist($traitType);
        $em->flush();
        $output->writeln('<info>TraitType successfully created: '.$traitType->getType().'</info>');
        $output->writeln('<info>TraitType ID is: '.$traitType->getId().'</info>');
    }
}