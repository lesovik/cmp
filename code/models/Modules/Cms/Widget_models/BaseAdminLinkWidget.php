<?php

/**
 *PageContentWidget  Widget
 *
 */
class BaseAdminLinkWidget extends CoreWidget {
    function resolve($Page,$Zone,$Widget) {
        $a='';
        $b='';
         if(isAllowed($_SESSION['user_id'], get_class($this), 'display')){         
            $a=html('a')
                    ->class(BASE_ADMIN_LINK_CLASS.(($Page->name==BASE_LIST_PAGE)?' Selected':''))
                    ->href("/".BASE_LIST_PAGE)
                    ->append(getLabel('base_admin_link'));
            
         

            
        }
        $b=html('a')
                ->class(BASE_ADMIN_LINK_CLASS.' Help ContentAreaButton')
                ->append(getLabel('help_form_link'))
                ->data('page',INIT_URI)
                                ->data('zone','OxfordHelpZone')
                                ->data('function-name','AjaxHelpForm')
                                ->data('loader-text','Loading Help')
                                ->data('extra-data','garbage');
        return $a.$b;
    }
}