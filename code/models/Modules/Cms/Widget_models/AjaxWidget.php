<?php
class AjaxWidget extends CoreWidget {
    function resolve($Page,$Zone,$Widget) {
        $params=$_GET;
        
        if($_POST){
            $params=$_POST;
        }
        if(getVal('page')){
            $page_name=getVal('page');
            unset($params['widget']);
            $page=Doctrine_Core::getTable('CorePage')->findOneBy('name', $page_name);
        }
        if(getVal('widget')){
            $widget_name=getVal('widget');
            unset($params['widget']);
            $widget=Doctrine_Core::getTable('CoreWidget')->findOneBy('name', $widget_name);
        }
        if(getVal('zone')){
            $zone_name=getVal('zone');
            unset($params['widget']);
            $zone=Doctrine_Core::getTable('CoreZone')->findOneBy('name', $zone_name);
        }
        
        if($page && $widget && $zone){
            $widgetInstance=initObj($widget->Model->class_name,$widget->id);
            if(getVal('functionName')){
                
                $functionName=getVal('functionName');
                unset($params['functionName']);
                return $widgetInstance->$functionName($page,$zone,$widget);
            }           
            return $widgetInstance->resolve($page,$zone,$widget);
        }
    }
    
}