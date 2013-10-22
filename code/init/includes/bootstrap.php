<?php

//server root shortcut constant
define('_ROOT', rtrim($_SERVER['DOCUMENT_ROOT'], '/') . '/');
define('_SCHEMA_YML_PATH', _ROOT . 'code/config/yml/');
define('_DISPLAY_YML_PATH', _ROOT . 'code/config/display/');
//db credentials
require_once('db.php');
require_once('constants.php');
if (DEBUG) {
    ini_set('display_errors', 'On');
}
//doctrine load
require_once(_ROOT . 'code/doctrine/lib/Doctrine.php');
spl_autoload_register(array('Doctrine', 'autoload'));
//db connection

$dbh = new PDO($dsn, $user, $password);
$conn = Doctrine_Manager::connection($dbh);

$manager = Doctrine_Manager::getInstance();
$manager->setAttribute(Doctrine_Core::ATTR_QUOTE_IDENTIFIER, true);
$conn->setCollate('utf8_general_ci');
$conn->setCharset('utf8');
if (function_exists('apc_fetch')) {
    $cacheDriver = new Doctrine_Cache_Apc();
}else{
    $cacheDriver = new Doctrine_Cache_Array();
}
$manager->setAttribute(Doctrine_Core::ATTR_QUERY_CACHE, $cacheDriver);
$manager->setAttribute(Doctrine_Core::ATTR_RESULT_CACHE, $cacheDriver);



Doctrine::loadModels(_ROOT . 'code/models/Core');

//autoload modules
Doctrine::loadModels(_ROOT . 'code/models/Modules/Cms');