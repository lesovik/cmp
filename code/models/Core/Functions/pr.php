<?php
 function pr($inp, $useReturn = false,$die=false){
    if (is_null($inp) || is_bool($inp)){
        $out = "<pre>";
        ob_start();
        var_dump($inp);
        $out .= ob_get_contents();
        ob_end_clean();
        $out .="</pre>\n";
    }else{
        $out = "<pre>".print_r($inp, true)."</pre>\n";
    }
    if ($die) die($out);
    if ($useReturn){
        return $out;
    }
    else {
        echo $out;
    }
}
