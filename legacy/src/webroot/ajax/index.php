<?php

namespace fennecweb;

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');

require_once __DIR__ . DIRECTORY_SEPARATOR . '../config.php';


if (defined('DEBUG') && DEBUG) {
    error_reporting(E_ALL);
    ini_set('display_errors', '1');
}


list($service, $args) = WebService::factory($_REQUEST['path']);
if ($service == null) {
    WebService::output(array('error' => 'Web Service not found'));
    die();
}
try {
    WebService::output($service->execute(array_merge($args, $_REQUEST)));
} catch (\PDOException $e) {
    return WebService::output(array('error' => DEBUG ? $e->getMessage() : 'Database error!'));
} catch (\Exception $e) {
    return WebService::output(array('error' => $e->getMessage()));
}
?>
