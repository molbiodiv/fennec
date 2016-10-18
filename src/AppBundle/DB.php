<?php

namespace AppBundle;

use \PDO as PDO;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * provides access to the various databases by static functions
 */
class DB extends Controller
{
    private $dbversions;

    public function __construct($dbversions) {
        $this->dbversions = $dbversions;
    }

    /**
     * connects to databse using $version
     * @param String $version the database version to use (has to be defined in parameters.yml)
     * @return \PDO
     */
    public function getDbForVersion($version)
    {
        $database = $this->dbversions;
        if (!array_key_exists($version, $database)) {
            print "Error!: The requested database version ".$version." does not exist.<br/>";
            die();
        }
        $dbv = $database[$version];
        $database_connstr = 'pgsql:host='.$dbv['database_host'].';dbname='.$dbv['database_name'].';port='.$dbv['database_port'];
        $db = $this->getDbConnection(
            $database_connstr,
            $database[$version]['database_user'],
            $database[$version]['database_password']
        );
        return $db;
    }

    /**
     * connects to databse using $connstr, $username, $password
     * @param String $connstr
     * @param String $username
     * @param String $password
     * @return \PDO
     */
    public function getDbConnection($connstr, $username, $password)
    {
        try {
            $db = new PDO(
                $connstr,
                $username,
                $password,
                array(PDO::ATTR_PERSISTENT => true, PDO::ATTR_EMULATE_PREPARES => false)
            );

            #usually stop execution on DB error
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            return $db;
        } catch (\PDOException $e) {
            print "Error!: " . $e->getMessage() . "<br/>";
            die();
        }
    }
}