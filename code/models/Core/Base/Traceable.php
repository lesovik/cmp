<?php

/**
 * Traceable
 *
 */
require_once(_ROOT.'code/models/Modules/Cms/Core/CoreTrace.php');
class Traceable extends Crude {
    function save() {

		$user_id=isset($_SESSION['user_id'])&&$_SESSION['user_id']!='guest'?$_SESSION['user_id']:ADMIN_USER_ID;

        if(empty($this->id)){
            $this->Trace=new CoreTrace();
            $this->Trace->created_at=date("Y-m-j H:i:s",time());
            $this->Trace->created_by=$user_id;
            $this->Trace->status='pending';
            $this->Trace->reference=get_class($this);
        }
        $this->Trace->updated_at=date("Y-m-j H:i:s",time());
        $this->Trace->updated_by=$user_id;
        $this->Trace->save();
        parent::save();
    }
    function read() {
        if(isAllowed($_SESSION['user_id'], get_class($this), 'read')) {
            return $this->getBaseRead().$this->Trace->getBaseRead();
        }else {
            return $this->BasePermissionError('read');
        }
    }
//    function getBaseFormFields($is_filter=false) {
//        if($is_filter || !empty($this->id))
//            return parent::getBaseFormFields($is_filter).$this->Trace->getBaseFormFields($is_filter);
//        else {
//            return parent::getBaseFormFields($is_filter);
//        }
//    }

}