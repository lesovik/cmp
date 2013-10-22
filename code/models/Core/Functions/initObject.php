<?php
function initObj($object_name,$id=null,$refreshRelated=false) {
    $object_name=new $object_name(NULL,FALSE,$id,$refreshRelated);
    return $object_name;
}