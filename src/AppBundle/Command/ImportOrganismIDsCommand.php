<?php

namespace AppBundle\Command;


use AppBundle\API\Mapping;
use AppBundle\Entity\Data\Db;
use AppBundle\Entity\Data\FennecDbxref;
use AppBundle\Entity\Data\Organism;
use Doctrine\ORM\EntityManager;
use Symfony\Component\Console\Helper\ProgressBar;
use Symfony\Component\Console\Helper\Table;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class ImportOrganismIDsCommand extends AbstractDataDBAwareCommand
{
    /**
     * @var EntityManager
     */
    private $em;

    private $mapping;

    private $skippedNoHit = 0;

    private $skippedMultiHits = 0;

    private $insertedEntries = 0;

    private $file;

    private $batchSize;

    protected function configure()
    {
        parent::configure();
        $this
        // the name of the command (the part after "bin/console")
        ->setName('app:import-organism-ids')

        // the short description shown while running "php bin/console list"
        ->setDescription('Importer for organism ids.')

        // the full command description shown when running the command with
        // the "--help" option
        ->setHelp("This command allows you to import ids for existing organisms...\n".
            "The tsv file has to have the following columns:\n".
            "fennec_id\tdb_id\n\n".
            "instead of fennec_id the first column can be something that is mappable to fennec_id via --mapping\n\n"
        )
        ->addArgument('file', InputArgument::REQUIRED, 'The path to the input csv file')
        ->addOption('provider', 'p', InputOption::VALUE_REQUIRED, 'The name of the database provider (e.g. NCBI Taxonomy)', null)
        ->addOption('mapping', "m", InputOption::VALUE_REQUIRED, 'Method of mapping for id column. If not set fennec_ids are assumed and no mapping is performed', null)
        ->addOption('description', 'd', InputOption::VALUE_REQUIRED, 'Description of the database provider', null)
        ->addOption('skip-unmapped', 's', InputOption::VALUE_NONE, 'do not exit if a line can not be mapped (uniquely) to a fennec_id instead skip this entry', null)
        ->addOption('batch-size', 'b', InputOption::VALUE_REQUIRED, 'Process large files in batches of this number of lines. Avoid out of memory errors', 1000)
    ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $output->writeln([
            'Organism ID Importer',
            '====================',
            '',
        ]);
        if(!$this->checkOptions($input, $output)){
            return;
        }
        $this->em = $this->initConnection($input);
        $this->em->getConnection()->getConfiguration()->setSQLLogger(null);
        gc_enable();
        $lines = intval(exec('wc -l '.escapeshellarg($input->getArgument('file')).' 2>/dev/null'));
        $this->batchSize = $input->getOption('batch-size');
        $progress = new ProgressBar($output, $lines);
        $progress->start();
        $this->em->getConnection()->beginTransaction();
        try{
            $needs_mapping = $input->getOption('mapping') !== null;
            $this->file = fopen($input->getArgument('file'), 'r');
            $providerID = $this->getOrInsertProvider($input->getOption('provider'), $input->getOption('description'))->getId();
            if($needs_mapping) {
                $dbversion = $this->getDbVersion($input);
                $this->mapping = $this->getMapping($dbversion,$input->getOption('mapping'));
            }
            while(count($lines = $this->getNextBatchOfLines()) > 0){
                foreach ($lines as $line) {
                    $fennec_id = $line[0];
                    if($needs_mapping){
                        if(! array_key_exists($fennec_id, $this->mapping)){
                            if(!$input->getOption('skip-unmapped')){
                                throw new \Exception('Error: No mapping found for: '.$fennec_id);
                            }
                            ++$this->skippedNoHit;
                            $progress->advance();
                            continue;
                        } elseif (is_array($this->mapping[$fennec_id])){
                            if(!$input->getOption('skip-unmapped')){
                                throw new \Exception('Error: Multiple mappings found for: '.$fennec_id.' ('.join(",",$this->mapping[$fennec_id]).').');
                            }
                            ++$this->skippedMultiHits;
                            $progress->advance();
                            continue;
                        }
                        $fennec_id = $this->mapping[$fennec_id];
                    }
                    $dbid = $line[1];
                    if($dbid == "" or $fennec_id == ""){
                        throw new \Exception('Error: Illegal line: '.join(" ",$line));
                    }
                    $this->insertDbxref($fennec_id, $dbid, $providerID);
                    ++$this->insertedEntries;
                    $progress->advance();
                }
                $this->em->flush();
                $this->em->clear();
                gc_collect_cycles();
            }
            $this->em->getConnection()->commit();
        } catch (\Exception $e){
            $this->em->getConnection()->rollBack();
            $output->writeln('<error>'.$e->getMessage().'</error>');
            return;
        }
        fclose($this->file);
        $progress->finish();

        $output->writeln('');
        $table = new Table($output);
        $table->addRow(array('Imported IDs', $this->insertedEntries));
        $table->addRow(array('Skipped (no hit)', $this->skippedNoHit));
        $table->addRow(array('Skipped (multiple hits)', $this->skippedMultiHits));
        $table->render();
    }

    private function getNextBatchOfLines(){
        $lines = array();
        $i = 0;
        while ($i<$this->batchSize && ($line = fgetcsv($this->file, 0, "\t")) != false) {
            $lines[] = $line;
            $i++;
        }
        return $lines;
    }

    /**
     * @param $name
     * @param $description
     * @return Db
     */
    protected function getOrInsertProvider($name, $description)
    {
        $provider = $this->em->getRepository('AppBundle:Db')->findOneBy(array(
            'name' => $name
        ));
        if($provider === null){
            $provider = new Db();
            $provider->setName($name);
            $provider->setDate(new \DateTime());
            $provider->setDescription($description);
            $this->em->persist($provider);
            $this->em->flush();
        }
        return $provider;
    }

    /**
     * @param $sciname
     * @return int
     */
    protected function insertOrganism($sciname){
        $organism = new Organism();
        $organism->setScientificName($sciname);
        $this->em->persist($organism);
        $this->em->flush();
        return $organism->getFennecId();
    }

    /**
     * @param $fennec_id
     * @param $dbid
     * @param int $providerID
     * @return FennecDbxref
     */
    protected function insertDbxref($fennec_id, $dbid, $providerID){
        $dbxref = new FennecDbxref();
        $dbxref->setDb($this->em->getReference('AppBundle:Db', $providerID));
        $dbxref->setFennec($this->em->getRepository('AppBundle:Organism')->find($fennec_id));
        $dbxref->setIdentifier($dbid);
        $this->em->persist($dbxref);
        return $dbxref;
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return boolean
     */
    protected function checkOptions(InputInterface $input, OutputInterface $output)
    {
        if($input->getOption('provider') === null){
            $output->writeln('<error>Provider (--provider) is required, none given.</error>');
            return false;
        }
        if(!file_exists($input->getArgument('file'))){
            $output->writeln('<error>File does not exist: '.$input->getArgument('file').'</error>');
            return false;
        }
        return true;
    }

    private function getMapping($dbversion,$method){
        if($method === 'scientific_name'){
            $mapper = $this->getContainer()->get(Mapping\FullByOrganismName::class);
            $mapping = $mapper->execute($dbversion);
        } else {
            $mapper = $this->getContainer()->get(Mapping\FullByDbxrefId::class);
            $mapping = $mapper->execute($dbversion,$method);
        }
        return $mapping;
    }

}