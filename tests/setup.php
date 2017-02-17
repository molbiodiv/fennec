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
        self::runCommand('doctrine:database:drop --if-exists --force');
        self::runCommand('doctrine:database:create');
        self::runCommand('doctrine:schema:update --force');
        $client = static::createClient();
        $dbs = $client->getContainer()->getParameter('dbal')['connections'];
        $db = $dbs[$client->getContainer()->getParameter('dbal')['default_connection']];
        // Do not use doctrine:database:import as that can not handle pg_dumps properly (e.g. COPY)
        // at least not in doctrine version 2.7.1
        echo exec('PGPASSWORD='.$db['password'].
            ' bash -c \'xzcat '.__DIR__.'/initial_testdata.sql.xz | psql -U '.
            $db['user'].
            ' -h '.$db['host'].
            ' -p '.$db['port'].
            ' -d '.$db['dbname'].'\'');
        $em = $client->getContainer()->get('app.orm')->getDefaultManager();
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