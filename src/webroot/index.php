<?php

//config file
require_once __DIR__ . DIRECTORY_SEPARATOR . 'config.php';

if (!isset($_SESSION)) {
    session_start();
}

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

$smarty->assign('fennec_version', '0.1.5');

$dbversion = requestVal('dbversion', '/^[A-Za-z-_\.0-9]*$/', DEFAULT_DBVERSION);
$smarty->assign('DbVersion', $dbversion);
$allDbVersions = array_keys(unserialize(DATABASE));
$smarty->assign('allDbVersions', $allDbVersions);

if (isset($_SESSION['user']) && array_key_exists('nickname', $_SESSION['user'])) {
    $smarty->assign('user', $_SESSION['user']['nickname']);
}

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
        if (displayOrganismSearchResults(requestVal('searchTerm', '/^[a-zA-Z-\.]*$/', '')))
            die();
        break;
    case 'organism-byid':
        if (displayOrganismById(requestVal('organismId', '/^[0-9]+$/', '')))
            die();
        break;
    case 'organism-by-trait':
        if (displayOrganismByTrait(requestVal('trait_type_id', '/^[0-9]+$/', '')))
            die();
        break;
    case 'project':
        $smarty->assign('type', 'project');
        $smarty->assign('title', 'Projects');
        $smarty->display('project.tpl');
        die();
    case 'project-byid':
        if (displayProjectById(requestVal('internal_project_id', '/^[0-9]+$/', '')))
            die();
        break;
    case 'project-trait-details':
        if (displayProjectTraitDetails(requestVal('internal_project_id', '/^[0-9]+$/', ''),requestVal('trait_type_id', '/^[0-9]+$/', '')))
            die();
        break;
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
    case 'trait-browse':
        $smarty->assign('type', 'trait');
        $smarty->assign('title', 'Browse Traits');
        $smarty->assign('searchLevel', 'overview');
        $smarty->display('traitBrowse.tpl');
        die();
    case 'trait-byid':
        if (displayTraitsById(requestVal('trait_type_id', '/^[0-9]+$/', '')))
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
function requestVal($key, $regexp = "/^.*$/", $defaultvalue = "")
{
    if (!isset($_REQUEST[$key]) || !preg_match($regexp, $_REQUEST[$key])) {
        return $defaultvalue;
    } else {
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

function displayOrganismByTrait($trait_type_id){
    global $smarty;
    $smarty->assign('type', 'organism');
    $smarty->assign('title', 'Search for organisms');
    $smarty->assign('limit', '1000');
    $smarty->assign('trait_type_id', $trait_type_id);
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

function displayTraitsById($trait_type_id){
    global $smarty;
    $smarty->assign('type', 'trait');
    $smarty->assign('trait_type_id', $trait_type_id);
    $smarty->display('traitDetails.tpl');
    return true;
}

function displayProjectById($internal_project_id){
    global $smarty;
    $smarty->assign('type', 'project');
    $smarty->assign('title', 'Project Details');
    $smarty->assign('internal_project_id', $internal_project_id);
    $smarty->display('projectDetails.tpl');
    return true;
}

function displayProjectTraitDetails($internal_project_id, $trait_type_id){
    if($internal_project_id === '' or $trait_type_id === ''){
        return false;
    }
    global $smarty;
    $smarty->assign('type', 'project');
    $smarty->assign('title', 'Project Trait Details');
    $smarty->assign('internal_project_id', $internal_project_id);
    $smarty->assign('trait_type_id', $trait_type_id);
    $smarty->display('projectTraitDetails.tpl');
    return true;
}

?>

