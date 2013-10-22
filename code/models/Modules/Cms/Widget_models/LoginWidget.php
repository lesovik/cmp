<?php

/**
 *Login  Widget
 *
 */
class LoginWidget extends CoreWidget {
    function resolve($Page,$Zone,$Widget) {


        if($_SESSION['user_id']=='guest') {
            $content=$this->getForm();
        }else {
            $content=$this->getLoggedAs();
        }
        return $content;
    }
    function getForm() {
        $error='';
        if($_POST) {
            
            $user=Doctrine_Core::getTable('CoreUser')->findOneBy('username', $_POST['username']);
            
            if($user) {
                if($user->password==md5($_POST['password'])){
                    $_SESSION['user_id']=$user->id;
                    $_SESSION['language_id']=$user->language_id;
                    $user->last_logon=date("Y-m-j H:i:s",time());
                    $user->save();
                    Application::redirect();
                }
            }else{

            }
        }
        $form=html('form')
                ->action('')
                ->method('POST')
                ->append($this->getFormFields())
                ->append($this->getBaseFormsSubmit('log_in'));
        return $form;
    }
    function getFormFields() {
        $fieldsDiv=html('div')
                ->class(BASE_FIELDS_DIV_CLASS)
                ->id(BASE_FIELDS_DIV_ID.get_class($this));
        $fields=array();
        $fields['username']=(isset ($_POST['username']))? $_POST['username']:'' ;
        $fields['password']=(isset ($_POST['password']))? $_POST['password']:'' ;
        foreach($fields as $key=>$field) {
            $input=html('input')            
                    ->value($field)
                    ->name($key);
            if($key=='password'){
                $input ->type('password');
            }else{
                $input ->type('text');
            }
            $label=html('label')
                    ->append(getLabel($key));
            $fieldDiv=html('div')
                    ->class(BASE_FIELD_DIV_CLASS)
                    ->id(BASE_FIELD_DIV_ID.$key)
                    ->append($label)
                    ->append($input);
            $fieldsDiv->append($fieldDiv);

        }
        return $fieldsDiv;
    }
    function getLoggedAs() {
        if(!isset ($_SESSION['user_name'])) {
            $user=initObj('CoreUser',$_SESSION['user_id']);
            $name=$user->name;
        }else {
            $name=$_SESSION['user_name'];
        }
        $a=html('a')
                ->href(BASE_LIST_PAGE.'?obj=CoreUser&action=read&id='.$_SESSION['user_id'])
                ->append($name);
        $name=html('div')
                ->class(LOGGED_AS_NAME_DIV_CLASS)
                ->append($a);
        $logged=html('div')
                ->class(LOGGED_AS_CLASS)
                ->append(getLabel('logged_as'));
        $a=html('a')
                ->href('?logout')
                ->append(getLabel('logout'));
        $logut=html('div')
                ->class(LOGOUT_DIV_CLASS)
                ->append($a);
        $fieldDiv=html('div')
                ->class(LOGGED_AS_DIV_CLASS)
                ->append($logged)
                ->append($name)
                ->append($logut);
        return $fieldDiv;
    }

}