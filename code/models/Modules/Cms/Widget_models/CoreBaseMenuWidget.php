<?php

/**
 * Widget
 *
 */
class CoreBaseMenuWidget extends CoreWidget {

    function resolve($Page,$Zone,$Widget) {
        $div=html('div')
                ->class(ACCOUNT_WIDGET_CONTENT_DIV)
                    ->append($this->getUlLi(getYml(_DISPLAY_YML_PATH.$this->name)));
        return $div;
    }
    function getUlLi($models) {
        $ul=html('ul');
        foreach ($models as $key => $model) {
            if(is_array($model) && count($model)>0) {
                $content=$this->getUlLi($model);
                if(!empty($content)) {
                    $li=html('li')
                            ->rel(getLabel($key))
                            ->append(getLabel($key))
                            ->append($content);
                    $ul->append($li);
                }
            }else {
                if(!isReserved($model) && isAllowed($_SESSION['user_id'],$model,'explore')) {
                    $a=html('a')
                            ->class((isset($_GET['obj']) && $model==$_GET['obj'])?'Selected':'')
                            ->href('?obj='.$model."&action=explore")
                            ->append(getLabel("menu_$model"));
                    $li=html('li')
                            ->append($a);
                    $ul->append($li);
                }
            }
        }
        if($ul->_is_empty==false){
            return $ul;
        }else{
            return false;
        }
    }
}