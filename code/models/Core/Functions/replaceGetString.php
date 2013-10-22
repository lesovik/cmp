<?php
function replaceGetString($pair=array()) {
    $get=$_GET;
    foreach ($pair as $key => $value) {
        $get[$key]=$value;
    }
    $getstring='?';
    $count=1;
    foreach ($get as $key=>$val) {
        $getstring.="$key=$val";
        if(count($get)>$count) {
            $getstring.="&";
        }
        $count++;
    }
    return $getstring;
}