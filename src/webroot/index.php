<?php

//config file
require_once __DIR__ . DIRECTORY_SEPARATOR . 'config.php';

//required libs
require_once 'smarty/smarty/libs/Smarty.class.php';

//initialize smarty
$smarty = new Smarty();
$smarty->setTemplateDir(SHARE_DIR . DIRECTORY_SEPARATOR . 'smarty' . DIRECTORY_SEPARATOR . 'templates');
$smarty->setCompileDir(VAR_DIR . DIRECTORY_SEPARATOR . 'smarty' . DIRECTORY_SEPARATOR . 'templates_c');
$smarty->setCacheDir(VAR_DIR . DIRECTORY_SEPARATOR . 'smarty' . DIRECTORY_SEPARATOR . 'cache');
$smarty->left_delimiter = '{#';
$smarty->right_delimiter = '#}';

$smarty->assign('AppPath', APPPATH);
$smarty->assign('ServicePath', SERVICEPATH);

$smarty->assign('fennec_version', '0.0.1');
$smarty->display('startpage.tpl');

?>


