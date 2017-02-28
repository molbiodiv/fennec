<?php

namespace AppBundle\Command;


use AppBundle\Entity\TraitCategoricalEntry;
use AppBundle\Entity\TraitCategoricalValue;
use AppBundle\Entity\TraitCitation;
use AppBundle\Entity\TraitType;
use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Helper\ProgressBar;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class ImportTraitValuesCommand extends ContainerAwareCommand
{
    /**
     * @var EntityManager
     */
    private $em;

    /**
     * @var TraitType
     */
    private $traitType;

    /**
     * @var int
     */
    private $insertedCitations;

    /**
     * @var int
     */
    private $insertedValues;

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
            "fennec_id\tvalue\tvalue_ontology\tcitation\torigin_url")
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
        $this->em = $orm->getManagerForVersion($connection_name);
        $this->traitType = $this->em->getRepository('AppBundle:TraitType')->findOneBy(array('type' => $input->getOption('traittype')));
        if($this->traitType === null){
            $output->writeln('<error>TraitType does not exist in db. Check for typos or create with app:create-traittype.</error>');
            return;
        }
        $user = $this->em->getRepository('AppBundle:Webuser')->find($input->getOption('user-id'));
        if($user === null){
            $output->writeln('<error>User with provided id does not exist in db.</error>');
            return;
        }
        if(!file_exists($input->getArgument('file'))){
            $output->writeln('<error>File does not exist: '.$input->getArgument('file').'</error>');
            return;
        }
        $lines = intval(exec('wc -l '.escapeshellarg($input->getArgument('file')).' 2>/dev/null'));
        $progress = new ProgressBar($output, $lines);
        $progress->start();
        $file = fopen($input->getArgument('file'), 'r');
        $this->em->getConnection()->beginTransaction();
        try{
            while (($line = fgetcsv($file, 0, "\t")) != false) {
                if(count($line) !== 5){
                    throw new \Exception('Wrong number of elements in line. Expected: 5, Actual: '.count($line).': '.join(" ",$line));
                }
                $traitCategoricalValue = $this->get_or_insert_trait_categorical_value($line[1], $line[2]);
                $traitCitation = $this->get_or_insert_trait_citation($line[3]);
                $traitEntry = new TraitCategoricalEntry();
                $traitEntry->setTraitType($this->traitType);
                $traitEntry->setTraitCategoricalValue($traitCategoricalValue);
                $traitEntry->setTraitCitation($traitCitation);
                $traitEntry->setOriginUrl($line[4]);
                $traitEntry->setFennec($this->em->getReference('AppBundle:Organism', $line[0]));
                $traitEntry->setWebuser($this->em->getReference('AppBundle:Webuser', $input->getOption('user-id')));
                $traitEntry->setPrivate(!$input->hasOption('public'));
                $this->em->persist($traitEntry);
                $progress->advance();
            }
            $this->em->flush();
            $this->em->getConnection()->commit();
        } catch (\Exception $e){
            $this->em->getConnection()->rollBack();
            throw $e;
        }
        $progress->finish();
    }

    private function get_or_insert_trait_categorical_value($value, $ontology_url){
        $traitCategoricalValue = $this->em->getRepository('AppBundle:TraitCategoricalValue')->findOneBy(array(
            'traitType' => $this->traitType,
            'value' => $value,
            'ontologyUrl' => $ontology_url
        ));
        if($traitCategoricalValue === null){
            $traitCategoricalValue = new TraitCategoricalValue();
            $traitCategoricalValue->setTraitType($this->traitType);
            $traitCategoricalValue->setValue($value);
            $traitCategoricalValue->setOntologyUrl($ontology_url);
            $this->em->persist($traitCategoricalValue);
            $this->em->flush();
            ++$this->insertedValues;
        }
        return $traitCategoricalValue;
    }

    private function get_or_insert_trait_citation($citation){
        $traitCitation = $this->em->getRepository('AppBundle:TraitCitation')->findOneBy(array(
            'citation' => $citation
        ));
        if($traitCitation === null){
            $traitCitation = new TraitCitation();
            $traitCitation->setCitation($citation);
            $this->em->persist($traitCitation);
            $this->em->flush();
            ++$this->insertedCitations;
        }
        return $traitCitation;
    }
}