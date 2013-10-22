<?php
function getSchema($class_name,$force_read=_SCHEMA_YML_REFRESH) {
    if(!SESSION_CACHE && function_exists('apc_fetch')) {
        $schema=apc_fetch('schema_'.$class_name);
    }else {
        if(array_key_exists('schema_'.$class_name, $_SESSION)) {
            $schema=$_SESSION['schema_'.$class_name];
        }else {
            $schema='';           
        }
    }
    if(!$schema || $force_read) {
        $filename=_SCHEMA_YML_PATH.$class_name.'.yml';
        
        if(file_exists($filename)) {
            
            $schema= sfYaml::load($filename);
            if(!SESSION_CACHE && function_exists('apc_add')) {
                apc_add('schema_'.$class_name,$schema);
            }else {
                $_SESSION['schema_'.$class_name]=$schema;
            }
        }else {

            $class_name=(strpos($class_name,'Widget'))?'CoreWidget':'CorePage';
            if(array_key_exists('schema_'.$class_name, $_SESSION)) {
                $schema=$_SESSION['schema_'.$class_name];
            }else {
                $filename=_SCHEMA_YML_PATH.$class_name.'.yml';
                if(file_exists($filename)) {
                    $schema= sfYaml::load($filename);
                    if(!SESSION_CACHE && function_exists('apc_store')) {
                        apc_store('schema_'.$class_name,$schema,60);
                    }else {
                        $_SESSION['schema_'.$class_name]=$schema;
                    }
                }else {
                    pr('Could not open schema file - '.$filename,0,1);
                }
            }
        }
    }
    return $schema[$class_name];
}