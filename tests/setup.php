<?php

namespace Tests;

require_once __DIR__.'/../app/autoload.php';

use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\Console\Input\StringInput;

/**
 * Created by PhpStorm.
 * User: s216121
 * Date: 11.10.16
 * Time: 18:46
 */
class Setup extends  WebTestCase
{
    protected static $application;

    public function setUp()
    {
        self::runCommand('doctrine:database:drop --if-exists --force --connection test_user');
        self::runCommand('doctrine:database:drop --if-exists --force --connection test_data');
        self::runCommand('doctrine:database:drop --if-exists --force --connection test_data2');
        self::runCommand('doctrine:database:create --connection test_user');
        self::runCommand('doctrine:database:create --connection test_data');
        self::runCommand('doctrine:database:create --connection test_data2');
        self::runCommand('doctrine:schema:create --em test_user');
        self::runCommand('doctrine:schema:create --em test_data');
        self::runCommand('doctrine:schema:create --em test_data2');
        $client = static::createClient();
        $dbs = $client->getContainer()->getParameter('dbal')['connections'];
        $user_db = $dbs['test_user'];
        $data_db = $dbs['test_data'];
        // Do not use doctrine:database:import as that can not handle pg_dumps properly (e.g. COPY)
        // at least not in doctrine version 2.7.1
        echo exec('PGPASSWORD='.$data_db['password'].
            ' bash -c \'xzcat '.__DIR__.'/initial_testdata.sql.xz | psql -U '.
            $data_db['user'].
            ' -h '.$data_db['host'].
            ' -p '.$data_db['port'].
            ' -d '.$data_db['dbname'].'\'');
        $em = $client->getContainer()->get('doctrine')->getManager('test_user');
        $setupFixtures = new SetupFixtures($em);
        $setupFixtures->insertUserData();
    }

    protected static function runCommand($command)
    {
        $command = sprintf('%s --quiet', $command);

        return self::getApplication()->run(new StringInput($command));
    }

    protected static function getApplication()
    {
        if (null === self::$application) {
            $client = static::createClient();

            self::$application = new Application($client->getKernel());
            self::$application->setAutoExit(false);
        }

        return self::$application;
    }
}

$st = new Setup();
$st->setUp();