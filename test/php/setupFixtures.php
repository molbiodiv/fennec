<?php
require_once __DIR__ . DIRECTORY_SEPARATOR . '../../vendor/autoload.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . 'config.php';

$database = unserialize(DATABASE)['test'];
echo exec('PGPASSWORD='.$database['DB_PASSWORD'].' dropdb --if-exists -U '.$database['DB_USERNAME'].' -h '.$database['DB_HOST'].' -p '.$database['DB_PORT'].' '.$database['DB_DBNAME']);
echo exec('PGPASSWORD='.$database['DB_PASSWORD'].' createdb -U '.$database['DB_USERNAME'].' -h '.$database['DB_HOST'].' -p '.$database['DB_PORT'].' '.$database['DB_DBNAME']);
echo exec('PGPASSWORD='.$database['DB_PASSWORD'].' xzcat '.__DIR__.'/chado_traits.sql.xz | psql -U '.$database['DB_USERNAME'].' -h '.$database['DB_HOST'].' -p '.$database['DB_PORT'].' -d '.$database['DB_DBNAME']);
?>
