<?php

namespace AppBundle\Command;


use AppBundle\Entity\TraitType;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class ImportTraitValuesCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
        // the name of the command (the part after "bin/console")
        ->setName('app:import-trait-values')

        // the short description shown while running "php bin/console list"
        ->setDescription('Importer for trait values.')

        // the full command description shown when running the command with
        // the "--help" option
        ->setHelp("This command allows you to create trait types...\n".
            "The tsv file has to have the following columns:\n".
            "fennec_id\tvalue\tvalue_ontology\tcitation\torigin_url\tprivate\tcreation_date\tdeletion_date")
        ->addArgument('file', InputArgument::REQUIRED, 'The path to the input csv file')
        ->addOption('connection', 'c', InputOption::VALUE_REQUIRED, 'The database version')
        ->addOption('traittype', 't', InputOption::VALUE_REQUIRED, 'The name of the trait type', null)
        ->addOption('user-id', "u", InputOption::VALUE_REQUIRED, 'ID of the user importing the data', null)
        ->addOption('public', 'p', InputOption::VALUE_NONE, 'import traits as public (default is private)')
    ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $output->writeln([
            'TraitValues Importer',
            '====================',
            '',
        ]);
        if($input->getOption('traittype') === null){
            $output->writeln('<error>No trait type given. Use --traittype</error>');
            return;
        }
        if($input->getOption('user-id') === null){
            $output->writeln('<error>No user ID given. Use --user-id</error>');
            return;
        }
        $connection_name = $input->getOption('connection');
        if($connection_name == null) {
            $connection_name = $this->getContainer()->get('doctrine')->getDefaultConnectionName();
        }
        $orm = $this->getContainer()->get('app.orm');
        $em = $orm->getManagerForVersion($connection_name);
        $traitType = $em->getRepository('AppBundle:TraitType')->findOneBy(array('type' => $input->getOption('traittype')));
        if($traitType === null){
            $output->writeln('<error>TraitType does not exist in db. Check for typos or create with app:create-traittype.</error>');
            return;
        }
        $user = $em->getRepository('AppBundle:Webuser')->find($input->getOption('user-id'));
        if($user === null){
            $output->writeln('<error>User with provided id does not exist in db.</error>');
            return;
        }
        if(!file_exists($input->getArgument('file'))){
            $output->writeln('<error>File does not exist: '.$input->getArgument('file').'</error>');
            return;
        }
        $lines = intval(exec('wc -l '.escapeshellarg($input->getArgument('file')).' 2>/dev/null'));
        $output->writeln('<info>File has '.$lines.' lines.</info>');
    }
}