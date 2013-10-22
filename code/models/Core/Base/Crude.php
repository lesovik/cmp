<?php

/**
 * Crude - create read update delete explore
 * @author     Les
 */
require_once(_ROOT.'code/models/Core/Base/Base.php');
class Crude extends Base{
    function create(){
        if(isAllowed($_SESSION['user_id'], get_class($this), 'create')){
            return $this->getBaseForm();
        }else{
            return $this->BasePermissionError('create');
        }
    }
    function read($useReturn=true){
        if(isAllowed($_SESSION['user_id'], get_class($this), 'read')){
             return $this->getBaseRead();
        }else{
            return $this->BasePermissionError('read');
        }
    }
    function update(){
        if(isAllowed($_SESSION['user_id'], get_class($this), 'update')){
            return $this->getBaseForm();
        }else{
            return $this->BasePermissionError('update');
        }
    }
    function delete($force_delete=false){
        if(isAllowed($_SESSION['user_id'], get_class($this), 'delete')){
            if(HARD_DELETE_ENABLED===true || $force_delete){
                parent::delete();
				if ($force_delete) {
					return true;
				}
            }
            $this->getBaseListRedirect();
        }else{
            return $this->BasePermissionError('delete');
        }
    }
    function explore(){  
        if(isAllowed($_SESSION['user_id'], get_class($this), 'explore')){
             return $this->getBaseList();
        }else{
            return $this->BasePermissionError('explore');
        }
    }   
}