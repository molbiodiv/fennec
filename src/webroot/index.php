<?php

//config file
require_once __DIR__ . DIRECTORY_SEPARATOR . 'config.php';

//required libs
require_once 'smarty/smarty/libs/Smarty.class.php';

//initialize smarty
$smarty = new Smarty();
$smarty->left_delimiter = '{#';
$smarty->right_delimiter = '#}';

?>


