
$(document).ready(function(){
    initSelect();
    sortText();
    sortSubs();
    buildAccordion('.DiscoveryGuideContent', '.CategoryAdminArrow');
    $('.CategoryText').each(function(){
        $(this).find('.textItem:last').addClass('Last');
    });
    $('.TocEditToggler').click(function(e){
        if($('.Editable').hasClass('Open')){
            $('.Editable').removeClass('Open');
            $(this).html('Modify Table of Contents');
        }else{
            $('.Editable').addClass('Open');
            rebindEditFields($(this));
            $(this).html('Stop Modifying');
        }

        
    });
    $('.CategoryAdminArrow').click(function(e){
        e.preventDefault();
        //$(this).parents('.selfcheckTestQuestion').toggleClass('Open'); //already toggled w/ accordion
        arrow=this;
        id=$(arrow).parents('li').attr('data-category-id');
        if($(this).parent().parent('li').hasClass('Open')){
            //alert('click an is open');
            var cookies=$.evalJSON($.cookie('openCategory'));
            if (!cookies) {
                cookies=[];
            }
            cookies.push(id);
            $.cookie('openCategory',$.toJSON(cookies));
            $(this).html('Close');
            rebindEditFields($(this));

        }else{

            var cookies=$.evalJSON($.cookie('openCategory'));
            cookies = jQuery.grep(cookies, function(value) {
                return value != id;

            });
            $.cookie('openCategory',$.toJSON(cookies));
            ;
            $(this).html('Edit');
            $(arrow).parents('li').removeClass('')
        }


    });
});

function buindArrow() {
    $('.CategoryAdminArrow').unbind('click').bind('click',function(e){
        e.preventDefault();
        //$(this).parents('.selfcheckTestQuestion').toggleClass('Open'); //already toggled w/ accordion
        arrow=this;
        id=$(arrow).parents('li').attr('data-category-id');
        if($(this).parent().parent('li').hasClass('Open')){
            //alert('click an is open');
            var cookies=$.evalJSON($.cookie('openCategory'));
            if (!cookies) {
                cookies=[];
            }
            cookies.push(id);
            $.cookie('openCategory',$.toJSON(cookies));
            $(this).html('Close');
            rebindEditFields($(this));

        }else{

            var cookies=$.evalJSON($.cookie('openCategory'));
            cookies = jQuery.grep(cookies, function(value) {
                return value != id;

            });
            $.cookie('openCategory',$.toJSON(cookies));
            ;
            $(this).html('Edit');
            $(arrow).parents('li').removeClass('')
        }


    });
}
function buildAccordion(main_tag, click_area) {
    main_tag = 'ul'+ main_tag;
    $(main_tag +' li '+ click_area).click(function() {

        $(this).parent().parent().toggleClass('Open');

        
    })
    if($.cookie('openCategory')){
        var cookies=$.evalJSON($.cookie('openCategory'));
        $(cookies).each(function(id,value) {

            $('#category'+value).addClass('Open');
            $('#category'+value).find('.CategoryAdminArrow').first().html('Close')
            rebindEditFields($('#category'+value).find('.CategoryAdminArrow'));
        })
        
    }
}
function rebindEditFields(self_checks_object)
{

    //alert('BINDING: '+self_checks_object);
    //self_checks_object.parents('.selfcheckTestQuestion').find('.ClickArea').children().unselectable();
    self_checks_object.parents().find('.ClickArea').children().unselectable();
    self_checks_object.parent().parent().find('.ClickArea').unbind('click').bind('click',function() {

        if($(this).parents('.Editable').hasClass('OnEdit')){
            $(this).parents('.Editable').removeClass('OnEdit');
        }else{
            $(this).parents('li').find('.Editable').removeClass('OnEdit') ;
            $(this).parents('.Editable').addClass('OnEdit');
            functionName=$(this).parents('.Editable').attr('data-function-name');
            toclId=$(this).parents('.Editable').attr('data-tocl-id');
            id=$(this).parents('.Editable').attr('data-id');
            editArea=$(this).parents('.Editable').find('.EditArea');
            editArea.addClass('EditAreaLoader');

            $.get('/ajax_widget?zone=RightAdminZone&page=admin&widget=Discovery Guide',{
                functionName:functionName,
                toclId:toclId,
                id:id
            },function(data){

                editArea.removeClass('EditAreaLoader');
                editArea.html(data);
                $('.AjaxForm textarea').basicEditor();
                form_id=editArea.find('.AjaxForm').attr('id');
                editArea.find('.CustomButton.Cancel').unbind('click').bind('click',function() {
                    editArea.parents('.Editable').removeClass('OnEdit');
                    editArea.html('');
                });
                editArea.find('.CustomButton.Save').unbind('click').bind('click',function() {
                    if (editArea.find('textarea').length) {
                        var new_editor_value=CKEDITOR.instances[editArea.find('textarea').attr('id')];
                        editArea.find('textarea').val(new_editor_value.getData())
                    }
                    $.post('/ajax_widget?zone=RightAdminZone&page=admin&widget=Discovery Guide&functionName='
                        + functionName
                        +'&id='+ id
                        +'&toclId='+ toclId

                        ,$("#"+form_id).serialize(),function(data){
                            editArea.parents('.Editable').removeClass('OnEdit');
                            switch(functionName){
                               
                                case 'AjaxAddSubcategory':
                                case 'AjaxCategoryText':

                                    window.location.reload();

                                    break;
                                default:
                                    editArea.parents('.Editable').find('.ClickArea').html(data);
                                    break;
                            }

                        })
                })
            });
        }
    })
    sortChoices();

}

function initSelect() {
    $('.DiscoveryGuideSelection').change(function(){
        var new_page=$(this).find('option[selected]').attr('value');
        guide_id=$('.MasterDiscoveryGuideContent').attr('data-guide-id');
        window.location.href='?obj=OxBookModuleDiscoveryGuide&action=read&id='+guide_id +'&tocl_id='+new_page;
    //
    //
    //        $.get(window.location.href,{
    //            tocl_id: new_page
    //        },function(data){
    //            $('body').html(data);
    //            buildAccordion('.DiscoveryGuideContent', '.CategoryAdminArrow');
    //            bindArrow();
    //        })
    });
}

function unbindSingleText(){
    /* ORIGINAL FUNCTION
    $('.CategoryText').each(function(){
        $(this).find('.DragTexts').remove();
        if( $(this).find('li').length==1){
            $(this).find('li').find('.SortArrow').attr('style','display:none');

        }else if($(this).find('li').length>1){

            $(this).find('li').find('.SortArrow').attr('style','display:block')
        }else{
            $(this).html('<span class="DragTexts">Drag texts for "'+ $(this).parents('li').attr('data-name') +'" here</span>');
        }
    })
    */
   $('.CategoryText').each(function(){
        $(this).find('.DragTexts').remove();
        if( $(this).find('li').length >= 1){
            $(this).find('li').find('.SortArrow').attr('style','display:block');

        }else{
            $(this).html('<span class="DragTexts">Drag texts for "'+ $(this).parents('li').attr('data-name') +'" here</span>');
        }
    })
}
function unbindSingleSub(){
    $('.Subcategories').each(function(){
        $(this).find('.DragCategories').remove();
        if( $(this).find('li').length==1){
            $(this).find('li').find('.SortArrow.CategoryArrow').attr('style','display:none');

        }else if($(this).find('li').length>1){

            $(this).find('li').find('.SortArrow.CategoryArrow').attr('style','display:block')
        }else{
            $(this).html('<span class="DragCategories">Drag subcategories for "'+ $(this).parents('li').attr('data-name') +'" here</span>');
        }
    })
}
function sortText(){
    unbindSingleText();
    var answer_content=$('.CategoryText').sortable({
        cursor: 'move',
        items: '.textItem',
        handle: '.SortArrow',
        delay: 50,
        revert: false ,
        scroll: false,
        smooth: false,
        opacity: 0.6,
        axis:'y',
        connectWith: '.CategoryText'
    }).bind('sortstart', function(event, ui) {

        }).bind('sortreceive', function(event, ui) {


        }).bind('sortstop', function(event, ui) {
        main=''
        $('.MasterDiscoveryGuideContent').find('.CategoryText').each(function(){
            sub='';
            $(this).find('li').each(function(){
                sub=sub+$(this).attr('data-text-id')+',';
            });
            main=main+$(this).parents('li').attr('data-category-id')+'='+sub+"&";

        });
        
        unbindSingleText();
        //
        $.post('/ajax_widget?zone=RightAdminZone&page=admin&widget=Discovery Guide&functionName='
            + 'AjaxSortTexts'
             

            ,main,function(data){
                            

            })

    });
}
function sortSubs(){
    unbindSingleSub();
    var answer_content=$('.Subcategories').sortable({
        cursor: 'move',
        items: '.SubcatagoryLI',
        handle: '.CategoryArrow',
        delay: 50,
        revert: false ,
        scroll: false,
        smooth: false,
        opacity: 0.6,
        axis:'y',
        connectWith: '.Subcategories'
    }).bind('sortstart', function(event, ui) {

        }).bind('sortreceive', function(event, ui) {


        }).bind('sortstop', function(event, ui) {
        main=''
        $('.MasterDiscoveryGuideContent').find('.Subcategories').each(function(){
            sub='';
            $(this).find('.SubcatagoryLI').each(function(){
                sub=sub+$(this).attr('data-category-id')+',';
            });
            main=main+$(this).parents('li').attr('data-category-id')+'='+sub+"&";

        });
        unbindSingleSub();
         $.post('/ajax_widget?zone=RightAdminZone&page=admin&widget=Discovery Guide&functionName='
            + 'AjaxSortSubs'


            ,main,function(data){


            })
    });
}