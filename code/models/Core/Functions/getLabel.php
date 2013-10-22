<?php
function getLabel($label) {
    if(SESSION_CACHE && array_key_exists('label_'.$label, $_SESSION) &&
       array_key_exists($_SESSION['language_id'], $_SESSION['label_'.$label])) {
       return $_SESSION['label_'.$label][$_SESSION['language_id']];
    }else{
        $_SESSION['label_'.$label]=array();
        $lbl=initObj('CoreLabel', array('label'=>$label,'language_id'=>$_SESSION['language_id']));
        $a='{'.$label.'}';
        if(LINK_UNSET_LABELS===true) {
            $a=html('a')
            ->href('/'.BASE_LIST_PAGE.'?obj=CoreLabel&action=create&label='.$label)
            ->append('{'.$label.'}');
        }
        if($lbl->text) {
            $text=$lbl->text;
            $_SESSION['label_'.$label][$_SESSION['language_id']]=$text;
        }else {
            $text=$a;
        }      
        return $text;
    }
}