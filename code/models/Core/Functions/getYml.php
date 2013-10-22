<?php
function getYml($filename,$force_read=_YML_REFRESH) {
    $yml='';
    if(array_key_exists('yml_'.$filename, $_SESSION)) {
        $yml=$_SESSION['yml_'.$filename];
    }
    if(!$yml || $force_read) {
        if(file_exists($filename)) {
            $yml= sfYaml::load($filename);
            $_SESSION['yml_'.$filename]=$yml;
        }else {
            pr('Could not open yml file - '.$filename,0,1);
        }
    }
    return $yml;
}