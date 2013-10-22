<?php

require_once(_ROOT.'code/models/Modules/Cms/Core/CoreWidget.php');
class BaseListWidget extends CoreWidget {
    function resolve($Page,$Zone,$Widget) {
        
        $not_id=array('obj','action','page','editorTwo','tocl_id','delete_file','current_book_id','ref_download_id','sub_action');
        $book=new OxBook();
        $content=$book->ListBooks();
        $header=html('h1')
                            ->class(BASE_HEADER_CLASS)
                            ->append(getLabel('administration_panel'));
        $models=Doctrine_Core::getLoadedModels();
        if(array_key_exists( 'obj',$_GET)
                && array_key_exists('action',$_GET)
                && in_array($_GET['obj'], $models)
                && !isReserved($_GET['obj'])) {
            
            switch($_GET['action']) {
                case "read":
                case "update":
                case "delete":
                    $id=array();
                    foreach($_GET as $key=>$val) {
                        if(!in_array($key, $not_id)) {
                            $id[$key]=$val;
                        }
                    }
                    $object=initObj($_GET['obj'],$id);                 
                    break;
                case "explore":
                case "create":                  
                    $object=initObj($_GET['obj']);                 
                    break;
                
            }
            $action=$_GET['action'];
            $content = $object->$action();
            $header=$object->getBaseHeader($action);
        }
        $div=html('div')
                ->class(ACCOUNT_WIDGET_CONTENT_DIV)
                ->append($content);
        return $header.$div;
    }
    
}