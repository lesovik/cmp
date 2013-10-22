<?php

/**
 *PageContentWidget  Widget
 *
 */
require_once(_ROOT.'code/models/Modules/Cms/Core/CoreWidget.php');
class CopyrightWidget extends CoreWidget {
    function resolve($Page,$Zone,$Widget) {
        $content='ku';
        $text=COPYRIGHT_TEXT;
        $now=time();
        $year=date('Y',$now);       
        return $text.' '.$year;
    }


}