<?php
// the path to your web site. 
// if you are at the root dir of your domain, this can be an empty string.
// otherwise, use an url like http://example.com
define('WEBROOT', '');
//just like above, just for the subfolder /ajax.
//either /ajax 
//or http://example.com/ajax
define('SERVICEPATH', '/ajax');

//chado database
const DATABASE = array("1.0" => array(
    'DB_ADAPTER' => 'pgsql',
    'DB_CONNSTR' => 'pgsql:host=${chado_db_host};dbname=${chado_db_name};port=${chado_db_port}',
    'DB_USERNAME' => '${chado_db_username}',
    'DB_PASSWORD' => '${chado_db_password}'
    ));

//set error reporting to a level that suits you
error_reporting(E_ALL ^ E_STRICT ^ E_NOTICE);
ini_set('display_errors', '0');

//uncomment for debugging
if (isset($_REQUEST['DEBUG']))
    define('DEBUG', true);
error_reporting(E_ALL );
ini_set('display_errors', '1');
?>
