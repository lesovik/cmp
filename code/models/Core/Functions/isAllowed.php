<?php
function isAllowed($user_id,$model,$action,$id=null) {
    $key="p_".md5($user_id.$model.$action.$id);
    if(isset($_SESSION[$key])) {
        return $_SESSION[$key];
    }else {
       
        if($user_id=='guest') {

            $user=initObj('CoreUser');
            $guest_role=initObj('CoreRole',AUTH_GUEST_ROLE_ID);

            $user['Roles'][]=$guest_role;
        }else {
            $user=initObj('CoreUser',$user_id);
        }
        foreach($user["Roles"] as $Role) {
            foreach($Role["Permissions"] as $Permission) {
               // echo $Permission['name']."-".$Permission['object']."<br>";
                if((empty($Permission['object']) ||$Permission['name']==$action) && (empty($Permission['object']) || $Permission['object']==$model)) {
                    $_SESSION[$key]=true;
                    return true;
                }
            }
        }
    }
}