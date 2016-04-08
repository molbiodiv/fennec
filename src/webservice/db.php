<?php

/**
 * connects to databse using $version
 * if DEBUG is set to true, use loggedPDO, not PDO
 * @param String $version the database version to use (has to be defined in config.php)
 * @return \PDO
 */
function get_db_for_version($version){
    $database = unserialize(DATABASE);
    if(!array_key_exists($version, $database)){
        print "Error!: The requested database version ".$version." does not exist.<br/>";
        die();
    }
    $db = get_db_connection($database[$version]['DB_CONNSTR'], $database[$version]['DB_USERNAME'], $database[$version]['DB_PASSWORD']);
    return $db;
}

/**
 * connects to databse using $connstr, $username, $password
 * if DEBUG is set to true, use loggedPDO, not PDO
 * @param String $connstr
 * @param String $username
 * @param String $password
 * @return \PDO
 */
function get_db_connection($connstr, $username, $password) {
    try {
        if (defined('DEBUG') && DEBUG) {

            if (PHP_SAPI == 'cli') {
                $logtype = 'console';
            } else {
                if (in_array('Content-type: application/json', headers_list())) {
                    $logtype = 'console';
                } else {
                    $logtype = 'firebugJSON';
                }
            }
            $logger = Log::factory($logtype, '', 'PDO');
            $db = new \LoggedPDO\PDO($connstr, $username, $password, null, $logger);
            //$db->log_replace_params = false;
        } else {
            $db = new PDO($connstr, $username, $password, array(PDO::ATTR_PERSISTENT => true, PDO::ATTR_EMULATE_PREPARES => false));
        }
        #usually stop execution on DB error
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        return $db;
    } catch (\PDOException $e) {
        print "Error!: " . $e->getMessage() . "<br/>";
        die();
    }
}

?>
