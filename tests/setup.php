<?php

namespace Tests;

require_once __DIR__.'/../app/autoload.php';

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

/**
 * Created by PhpStorm.
 * User: s216121
 * Date: 11.10.16
 * Time: 18:46
 */
class Setup extends WebTestCase
{
    private $db;
    
    public function setUp()
    {
        $client = static::createClient();
        $dbs = $client->getContainer()->getParameter('dbal')['connections'];
        $this->db = $dbs[$client->getContainer()->getParameter('dbal')['default_connection']];
        echo exec('PGPASSWORD='.$this->db['password'].
            ' dropdb --if-exists -U '.$this->db['user'].
            ' -h '.$this->db['host'].
            ' -p '.$this->db['port'].
            ' '.$this->db['dbname']);
        echo exec('PGPASSWORD='.$this->db['password'].
            ' createdb -U '.$this->db['user'].
            ' -h '.$this->db['host'].
            ' -p '.$this->db['port'].
            ' '.$this->db['dbname']);
        echo exec('PGPASSWORD='.$this->db['password'].
            ' bash -c \'xzcat '.__DIR__.'/initial_testdata.sql.xz | psql -U '.
            $this->db['user'].
            ' -h '.$this->db['host'].
            ' -p '.$this->db['port'].
            ' -d '.$this->db['dbname'].'\'');
        echo exec('PGPASSWORD='.$this->db['password'].
            ' bash -c \'cat '.__DIR__.'/userData.sql | psql -U '.
            $this->db['user'].
            ' -h '.$this->db['host'].
            ' -p '.$this->db['port'].
            ' -d '.$this->db['dbname'].'\'');
    }
}

$st = new Setup();
$st->setUp();