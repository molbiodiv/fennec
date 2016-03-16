<?php
require_once __DIR__ . DIRECTORY_SEPARATOR . '../../vendor/autoload.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . 'config.php';

echo exec('PGPASSWORD='.DB_PASSWORD.' dropdb --if-exists -U '.DB_USERNAME.' -h '.DB_HOST.' -p '.DB_PORT.' '.DB_DBNAME);
echo exec('PGPASSWORD='.DB_PASSWORD.' createdb -U '.DB_USERNAME.' -h '.DB_HOST.' -p '.DB_PORT.' '.DB_DBNAME);
echo exec('PGPASSWORD='.DB_PASSWORD.' xzcat '.__DIR__.'/chado_traits.sql.xz | psql -U '.DB_USERNAME.' -h '.DB_HOST.' -p '.DB_PORT.' -d '.DB_DBNAME);
?>
