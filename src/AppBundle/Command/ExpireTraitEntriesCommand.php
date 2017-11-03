<?php

namespace AppBundle\Command;

use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class ExpireTraitEntriesCommand extends ContainerAwareCommand
{
    /**
     * @var EntityManager
     */
    private $em;

    /**
     * @var array<int> TraitType ids
     */
    private $traitType;

    /**
     * @var string
     */
    private $connectionName;

    protected function configure()
    {
        $this
        // the name of the command (the part after "bin/console")
        ->setName('app:expire-trait-entries')

        // the short description shown while running "php bin/console list"
        ->setDescription('Expire all trait entries of a given trait-type. Useful if a new version is released.')

        // the full command description shown when running the command with
        // the "--help" option
        ->setHelp("This command allows you to expire all entries of a trait type...\n")
        ->addOption('connection', 'c', InputOption::VALUE_REQUIRED, 'The database version')
        ->addOption('traittype', 't', InputOption::VALUE_REQUIRED, 'The name of the trait type', null)
    ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $output->writeln([
            'Expire Trait Entries',
            '====================',
            '',
        ]);
        if(!$this->checkOptions($input, $output)){
            return;
        }
        $this->initConnection($input);
        $traitType = $this->em->getRepository('AppBundle:TraitType')->findOneBy(array('type' => $input->getOption('traittype')));
        if($traitType === null){
            $output->writeln('<error>Error: Unknown traittype '.$traitType.'</error>');
            return;
        }
        $traitFormat = $traitType->getTraitFormat()->getFormat();
        $entries = array();
        if($traitFormat === 'numerical'){
            $entries = $this->em->getRepository('AppBundle:TraitNumericalEntry')->findBy(array(
                'traitType' => $traitType,
            ));
        } elseif ($traitFormat === 'categorical_free'){
            $entries = $this->em->getRepository('AppBundle:TraitCategoricalEntry')->findBy(array(
                'traitType' => $traitType,
            ));
        }
        $expiryCount = 0;
        $deletionTime = new \DateTime();
        foreach($entries as $entry){
            if($entry->getDeletionDate() === null){
                $entry->setDeletionDate($deletionTime);
                $expiryCount++;
            }
        }
        $this->em->flush();
        $output->writeln('All entries for trait type "'.$traitType.'" have been expired (Total: '.$expiryCount.')');
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return boolean
     */
    protected function checkOptions(InputInterface $input, OutputInterface $output)
    {
        if ($input->getOption('traittype') === null) {
            $output->writeln('<error>No trait type given. Use --traittype</error>');
            return false;
        }
        return true;
    }

    /**
     * @param InputInterface $input
     */
    protected function initConnection(InputInterface $input)
    {
        $this->connectionName = $input->getOption('connection');
        if ($this->connectionName === null) {
            $this->connectionName = $this->getContainer()->get('doctrine')->getDefaultConnectionName();
        }
        $orm = $this->getContainer()->get('app.orm');
        $this->em = $orm->getManagerForVersion($this->connectionName);
    }
}