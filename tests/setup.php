<?php

namespace Tests;

require_once __DIR__.'/../app/autoload.php';

use AppBundle\DB;
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
        $dbs = $client->getContainer()->getParameter('dbversions');
        $this->db = $dbs[$client->getContainer()->getParameter('default_db')];
        echo exec('PGPASSWORD='.$this->db['database_password'].
            ' dropdb --if-exists -U '.$this->db['database_user'].
            ' -h '.$this->db['database_host'].
            ' -p '.$this->db['database_port'].
            ' '.$this->db['database_name']);
        echo exec('PGPASSWORD='.$this->db['database_password'].
            ' createdb -U '.$this->db['database_user'].
            ' -h '.$this->db['database_host'].
            ' -p '.$this->db['database_port'].
            ' '.$this->db['database_name']);
        echo exec('PGPASSWORD='.$this->db['database_password'].
            ' bash -c \'xzcat '.__DIR__.'/chado_traits.sql.xz | psql -U '.
            $this->db['database_user'].
            ' -h '.$this->db['database_host'].
            ' -p '.$this->db['database_port'].
            ' -d '.$this->db['database_name'].'\'');
        echo exec('PGPASSWORD='.$this->db['database_password'].
            ' bash -c \'cat '.__DIR__.'/userData.sql | psql -U '.
            $this->db['database_user'].
            ' -h '.$this->db['database_host'].
            ' -p '.$this->db['database_port'].
            ' -d '.$this->db['database_name'].'\'');
    }
}

$st = new Setup();
$st->setUp();