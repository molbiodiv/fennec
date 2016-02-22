<?php

//config file
require_once __DIR__ . DIRECTORY_SEPARATOR . 'config.php';

//initialize smarty
$smarty = new Smarty();
$smarty->setTemplateDir(SHARE_DIR . DIRECTORY_SEPARATOR . 'smarty' . DIRECTORY_SEPARATOR . 'templates');
$smarty->setCompileDir(VAR_DIR . DIRECTORY_SEPARATOR . 'smarty' . DIRECTORY_SEPARATOR . 'templates_c');
$smarty->setCacheDir(VAR_DIR . DIRECTORY_SEPARATOR . 'smarty' . DIRECTORY_SEPARATOR . 'cache');
$smarty->addPluginsDir(SHARE_DIR . DIRECTORY_SEPARATOR . 'smarty' . DIRECTORY_SEPARATOR . 'plugins');
$smarty->left_delimiter = '{#';
$smarty->right_delimiter = '#}';

$smarty->assign('WebRoot', WEBROOT);
$smarty->assign('ServicePath', SERVICEPATH);

$smarty->assign('fennec_version', '0.0.1');

$page = requestVal('page', '/^[a-z-_\.]*$/', '');
switch ($page) {
    case 'organism':
        $smarty->assign('type', 'organism');
        $smarty->assign('title', 'Organisms');
        $smarty->assign('limit', '10');
        $smarty->display('organism.tpl');
        die();
    case 'project':
        $smarty->assign('type', 'project');
        $smarty->assign('title', 'Projects');
        $smarty->display('project.tpl');
        die();
    case 'trait':
        $smarty->assign('type', 'trait');
        $smarty->assign('title', 'Traits');
        $smarty->display('trait.tpl');
        die();
    case 'community':
        $smarty->assign('type', 'community');
        $smarty->assign('title', 'Communities');
        $smarty->display('community.tpl');
        die();
}
$smarty->assign('type', 'startpage');
$smarty->assign('title', 'Welcome');
$smarty->display('startpage.tpl');

/**
 * returns $_REQUEST[$key] value if it matches $regexp, else return $defaultvalue
 * @param String $key
 * @param String $regexp
 * @param String $defaultvalue
 * @return String
 */
function requestVal($key, $regexp = "/^.*$/", $defaultvalue = "") {
    if (!isset($_REQUEST[$key]) || !preg_match($regexp, $_REQUEST[$key]))
        return $defaultvalue;
    else
        return $_REQUEST[$key];
}
?>


