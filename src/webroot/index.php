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

$smarty->assign('fennec_version', '0.0.5');

$dbversion = requestVal('dbversion', '/^[A-Za-z-_\.0-9]*$/', DEFAULT_DBVERSION);
$smarty->assign('DbVersion', $dbversion);
$page = requestVal('page', '/^[A-Za-z-_\.]*$/', '');
switch ($page) {
    case 'organism':
        $smarty->assign('type', 'organism');
        $smarty->assign('title', 'Organisms');
        $smarty->assign('limit', '100');
        $smarty->display('organism.tpl');
        die();
    case 'organism-search':
        $smarty->assign('type', 'organism');
        $smarty->assign('title', 'Search for organisms');
        $smarty->assign('limit', '100');
        $smarty->display('organismSearch.tpl');
        die();
    case 'organism-results':
        if(displayOrganismSearchResults(requestVal('searchTerm', '/^[a-zA-Z-\.]*$/', '')))
            die();
        break;
    case 'organism-byid':
        if (displayOrganismById(requestVal('organismId', '/^[0-9]+$/', '')))
            die();
        break;
    case 'organism-by-trait':
        if (displayOrganismByTrait(requestVal('type_cvterm_id', '/^[0-9]+$/', '')))
            die();
        break;
    case 'project':
        $smarty->assign('type', 'project');
        $smarty->assign('title', 'Projects');
        $smarty->display('project.tpl');
        die();
    case 'trait':
        $smarty->assign('type', 'trait');
        $smarty->assign('title', 'Traits');
        $smarty->assign('max', 6);
        $smarty->display('trait.tpl');
        die();
    case 'trait-search-overview':
        $smarty->assign('type', 'trait');
        $smarty->assign('title', 'Search for Traits');
        $smarty->assign('searchLevel', 'overview');
        $smarty->display('traitSearch.tpl');
        die();
    case 'trait-search-ecology':
        $smarty->assign('type', 'trait');
        $smarty->assign('title', 'Search for Traits');
        $smarty->assign('searchLevel', 'ecology');
        $smarty->display('traitSearch.tpl');
        die();
    case 'trait-search-eco':
        $smarty->assign('type', 'trait');
        $smarty->assign('title', 'Search for Traits');
        $smarty->assign('searchLevel', 'humanAndEcosystems');
        $smarty->display('traitSearch.tpl');
        die();
    case 'trait-search-behaviour':
        $smarty->assign('type', 'trait');
        $smarty->assign('title', 'Search for Traits');
        $smarty->assign('searchLevel', 'behaviour');
        $smarty->display('traitSearch.tpl');
        die();
    case 'trait-search-woodland':
        $smarty->assign('type', 'trait');
        $smarty->assign('title', 'Search for Traits');
        $smarty->assign('searchLevel', 'woodland');
        $smarty->display('traitSearch.tpl');
        die();
    case 'trait-search-zone':
        $smarty->assign('type', 'trait');
        $smarty->assign('title', 'Search for Traits');
        $smarty->assign('searchLevel', 'geographicalZone');
        $smarty->display('traitSearch.tpl');
        die();
    case 'trait-search-plant':
        $smarty->assign('type', 'trait');
        $smarty->assign('title', 'Search for Traits');
        $smarty->assign('searchLevel', 'plant');
        $smarty->display('traitSearch.tpl');
        die();
    case 'trait-byid':
        if (displayTraitsById(requestVal('type_cvterm_id', '/^[0-9]+$/', '')))
            die();
        break;
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
    if (!isset($_REQUEST[$key]) || !preg_match($regexp, $_REQUEST[$key])){
        return $defaultvalue;
    }
    else {
        return $_REQUEST[$key];
    }
}

/**
 * displays organism based on $organismId
 * @global Smarty $smarty
 * @param type $organismId
 * @return boolean false on failure
 */
function displayOrganismById($organismId){
    global $smarty;
    $smarty->assign('type', 'organism');
    $smarty->assign('limit', 1000);
    $smarty->assign('organismId', $organismId);
    $smarty->display('organismDetails.tpl');
    return true;
}

function displayOrganismByTrait($type_cvterm_id){
    global $smarty;
    $smarty->assign('type', 'organism');
    $smarty->assign('title', 'Search for organisms');
    $smarty->assign('limit', '1000');
    $smarty->assign('type_cvterm_id', $type_cvterm_id);
    $smarty->display('organismByTrait.tpl');
    return true;
}

function displayOrganismSearchResults($searchTerm){
    global $smarty;
    $smarty->assign('type', 'organism');
    $smarty->assign('title', 'Search for organisms');
    $smarty->assign('searchTerm', $searchTerm);
    $smarty->assign('limit', '1000');
    $smarty->display('organismResults.tpl');
    return true;
}

function displayTraitsById($type_cvterm_id){
    global $smarty;
    $smarty->assign('type_cvterm_id', $type_cvterm_id);
    $smarty->display('traitDetails.tpl');
    return true;
}

?>

