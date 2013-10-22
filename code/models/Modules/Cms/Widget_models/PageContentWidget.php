<?php

/**
 *PageContentWidget  Widget
 *
 */
include_once _ROOT.'/code/models/Modules/Cms/Core/CoreWidget.php';

class PageContentWidget extends CoreWidget {
    function resolve($Page,$Zone,$Widget) {
        $content='';
        foreach($Page->Contents as $C) {
            foreach($C->Zones as $Z) {
                if($Z->id==$Zone->id) {
                    $div=html('div')
                            ->class(get_class($C))
                            ->id(get_class($C).'_'.$C->id)
                            ->append($C->content);
                    $content=$div;
                }
            }
        }
        return $content;
    }


}