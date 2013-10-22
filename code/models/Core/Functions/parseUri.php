<?php
//function parseUri(){

        $init_uri=getenv("REQUEST_URI");
        while (strstr($init_uri,'//')) $init_uri=str_replace('//','/',$init_uri);
        $init_q=strpos($init_uri,'?');
        if ($init_q !== false) $init_uri = substr($init_uri,0,$init_q);
        $init_q=strpos($init_uri,'#');
        if ($init_q !== false) $init_uri=substr($init_uri,0,$init_q);
        $init_uri = trim($init_uri,"/");
        if (!$init_uri) $init_uri = DEFAULT_PAGE;
        define('INIT_URI',$init_uri);

 //}
