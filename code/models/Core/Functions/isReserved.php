<?php
function isReserved($model) {
    $haystack=array('Api', 'Base','Crude','Traceable',
    'CorePageSkin', 'CorePageSkinTemplate','CoreRolePermission','CoreSkinModel','CoreTemplateSkinModel',
    'CoreSkinZone', 'CoreTemplateSkin','CoreTreeGroup','CoreUserRole',
    'CoreWidgetModel', 'CoreZoneWidget','BaseListWidget',
        'BaseMenuWidget','CoreTrace',
        'LoginWidget'
    );
    if(in_array($model, $haystack)){
        return TRUE;
    }else{
        return FALSE;
    }
}