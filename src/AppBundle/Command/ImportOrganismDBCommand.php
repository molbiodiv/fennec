<?php

namespace AppBundle\Command;


use AppBundle\Entity\Data\Db;
use AppBundle\Entity\Data\FennecDbxref;
use AppBundle\Entity\Data\Organism;
use AppBundle\Service\DBVersion;
use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Helper\ProgressBar;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class ImportOrganismDBCommand extends ContainerAwareCommand
{
    const BATCH_SIZE = 10;
    /**
     * @var EntityManager
     */
    private $em;

    /**
     * @var string
     */
    private $connectionName;

    protected function configure()
    {
        $this
        // the name of the command (the part after "bin/console")
        ->setName('app:import-organism-db')

        // the short description shown while running "php bin/console list"
        ->setDescription('Importer for organism dbs.')

        // the full command description shown when running the command with
        // the "--help" option
        ->setHelp("This command allows you to import organism databases...\n".
            "The tsv file has to have the following columns:\n".
            "scientific_name\tdb_id\n\n"
        )
        ->addArgument('file', InputArgument::REQUIRED, 'The path to the input csv file')
        ->addOption('connection', 'c', InputOption::VALUE_REQUIRED, 'The database version')
        ->addOption('provider', 'p', InputOption::VALUE_REQUIRED, 'The name of the database provider (e.g. NCBI Taxonomy)', null)
        //->addOption('mapping', "m", InputOption::VALUE_REQUIRED, 'Method of mapping for id column. If not set fennec_ids are assumed and no mapping is performed', null)
        ->addOption('description', 'd', InputOption::VALUE_REQUIRED, 'Description of the database provider', null)
        //->addOption('skip-unmapped', 's', InputOption::VALUE_NONE, 'do not exit if a line can not be mapped (uniquely) to a fennec_id instead skip this entry', null)
    ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $output->writeln([
            'Organism DB Importer',
            '====================',
            '',
        ]);
        if(!$this->checkOptions($input, $output)){
            return;
        }
        $this->initConnection($input);
        $this->em->getConnection()->getConfiguration()->setSQLLogger(null);
        gc_enable();
        $provider = $this->getOrInsertProvider($input->getOption('provider'), $input->getOption('description'));
        $lines = intval(exec('wc -l '.escapeshellarg($input->getArgument('file')).' 2>/dev/null'));
        $progress = new ProgressBar($output, $lines);
        $progress->start();
        $file = fopen($input->getArgument('file'), 'r');
        $this->em->getConnection()->beginTransaction();
        try{
            $i = 0;
            while (($line = fgetcsv($file, 0, "\t")) != false) {
                $sciname = $line[0];
                $dbid = $line[1];
                if($dbid == "" or $sciname == ""){
                    throw new \Exception('Illegal line: '.join(" ",$line));
                }
                $fennec_id = $this->insertOrganism($sciname);
                $this->insertDbxref($fennec_id, $dbid, $provider);
                $progress->advance();
                $i++;
                if($i % ImportOrganismDBCommand::BATCH_SIZE === 0){
                    $this->em->flush();
                    $this->em->clear();
                    gc_collect_cycles();
                }
            }
            $this->em->flush();
            $this->em->getConnection()->commit();
        } catch (\Exception $e){
            $this->em->getConnection()->rollBack();
            $output->writeln('<error>'.$e->getMessage().'</error>');
            return;
        }
        fclose($file);
        $progress->finish();

        $output->writeln('');
    }

    /**
     * @param $name
     * @param $description
     * @return int Db id of provider
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
        return $provider->getDbId();
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
     * @param int $provider
     * @return FennecDbxref
     */
    protected function insertDbxref($fennec_id, $dbid, $provider){
        $dbxref = new FennecDbxref();
        $dbxref->setDb($this->em->getReference('AppBundle:Db', $provider));
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

    /**
     * @param InputInterface $input
     */
    protected function initConnection(InputInterface $input)
    {
        $this->connectionName = $input->getOption('connection');
        if ($this->connectionName === null) {
            $this->connectionName = $this->getContainer()->get('doctrine')->getDefaultConnectionName();
        }
        $this->em = $this->getContainer()->get(DBVersion::class)->getEntityManager();
    }

}