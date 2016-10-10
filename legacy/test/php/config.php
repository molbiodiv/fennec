<?php

// this is the default file
// please copy to config.php and adjust carefully before executing tests
// make sure to never set the constants to your production database (otherwise it will be cleared)

//chado test database
define('DEFAULT_DBVERSION', 'test');
define('DATABASE', serialize(array('test' => array(
    'DB_ADAPTER' => 'pgsql',
    'DB_CONNSTR' => 'pgsql:host=CHADOTEST;dbname=fennectest;port=5432',
    'DB_USERNAME' => 'fennectest',
    'DB_PASSWORD' => 'fennectest',
    'DB_HOST' => 'CHADOTEST',
    'DB_PORT' => 5432,
    'DB_DBNAME' => 'fennectest'
))));
