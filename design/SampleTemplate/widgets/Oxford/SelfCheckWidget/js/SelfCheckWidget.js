function bootstrap_self_checks()
{
    
    $(document).ready(function(){
        
        activateNewButton();
        activateViewButton();

        
        buildSelfCheckAccordion('.SelfCheckOverview','.Togglable');
    });
}

function initAdvancedQuizSelect() {
    //select.goforSelect
    $('div.include_options input').attr('disabled','true');
    $('div.type_options input').attr('disabled','true');

    $('.goforSelect').change(function(){
        var selected_value=$(this).find('option[selected]').attr('value');
        if (selected_value == 'remaining' || selected_value == 'default') {
            $('div.include_options input').attr('disabled',true);
            $('div.type_options input').attr('disabled','true');
        } else {
            $('div.include_options input').attr('disabled',false);
            $('div.type_options input').attr('disabled',false);
        }
    })
}

function activateNewButton(){
    $('.buttonLink.New').click(function(e){
        e.preventDefault();

        var clicked_button=$(this);
        var tab_content=$(this).parents('.TabContent');
        var loading_text='<div class="Loader Overlay"><img src="/design/SampleTemplate/images/loader-gray.gif" alt="" /> Loading ...</div>';
        clicked_button.parents('.TabContentBody').prepend(loading_text);
        $.get('/ajax_widget?page=book.html&widget=Self Check Test&functionName=buildGenerator',{
            level_id:$(this).attr('data-level-id'),
            book_id:tab_content.attr('data-book-id'),
            zone:tab_content.attr('data-zone')
        },function(data){
            clicked_button.parents('.TabContentBody').html(data);           
            activateBackButton();
            activateQuickButton();
            activateAdvancedButton();
            initAdvancedQuizSelect();
        });

    })
}
function activateViewButton(){
    $('.buttonLink.View').click(function(e){
        e.preventDefault();

        var clicked_button=$(this);
        var tab_content=$(this).parents('.TabContent');
        $.get('/ajax_widget?page=book.html&widget=Self Check Test&functionName=getView',{
            level_id:$(this).attr('data-level-id'),
            book_id:tab_content.attr('data-book-id'),
            zone:tab_content.attr('data-zone')
        },function(data){
            clicked_button.parents('.TabContentBody').html(data);
            activateBackButton();

        });

    })
}
function activateQuickButton(){
    $('.QuickCheckButton').click(function(e){
        e.preventDefault();

        var clicked_button=$(this);
        var tab_content=$(this).parents('.TabContent');
        var loading_text='<div class="Loader Overlay"><img src="/design/SampleTemplate/images/loader-gray.gif" alt="" /> Generating Test...</div>';

        clicked_button.parents('.TabContentBody').prepend(loading_text);
        $.get('/ajax_widget?page=book.html&widget=Self Check Test&functionName=getContent',{
            level_id:$(this).attr('data-level-id'),
            book_id:tab_content.attr('data-book-id'),
            is_quick:1,
            zone:tab_content.attr('data-zone')
        },function(data){
            clicked_button.parents('.TabContentBody').html(data);
            activateBackButton();
            activateSaveButton();
            sortSequenceQuestions();
        });

    })
}
function activateAdvancedButton(){
    $('.AdvancedCheckButton').click(function(e){
        e.preventDefault();

        var clicked_button=$(this);
        var select_value = $('.goforSelect option[selected]');
        var tab_content=$(this).parents('.TabContent');
        var loading_text='<div class="Loader Overlay"><img src="/design/SampleTemplate/images/loader-gray.gif" alt="" /> Generating Test...</div>';

        

        var filterArray = jQuery.makeArray($('input[type=checkbox]'));

        if(select_value != 'remaining' || select_value != 'default') {
            //                        level_id:clicked_button.attr('data-level-id'),
            //                        book_id:tab_content.attr('data-book-id'),
            //                        zone:tab_content.attr('data-zone')
            clicked_button.parents('.TabContentBody').prepend(loading_text);
            $.post('/ajax_widget?page=book.html&widget=Self Check Test&functionName=getContent&level_id='+clicked_button.attr('data-level-id')+'&book_id='+tab_content.attr('data-book-id')+'&zone='+ tab_content.attr('data-zone')
                , $("form#filter_values").serialize(), function(data){
                    clicked_button.parents('.TabContentBody').html(data);
                    activateSaveButton();
                    activateBackButton();
                    sortSequenceQuestions();
                })

        }
    /*
        $.get('/ajax_widget?page=book.html&widget=Self Check Test&functionName=getContent',{
            is_advanced: 1,
            level_id:$(this).attr('data-level-id'),
            book_id:tab_content.attr('data-book-id'),
            zone:tab_content.attr('data-zone')
        },function(data){
            clicked_button.parents('.TabContentBody').html(data);
            activateBackButton();
            activateSaveButton();
        });
*/
    })
         
}
function activateSaveButton(){
    $('.SelfCheckSubmitButton').click(function(e){
        e.preventDefault();

        var clicked_button=$(this);
        var tab_content=$(this).parents('.TabContent');
        var loading_text='<div class="Loader Overlay"><img src="/design/SampleTemplate/images/loader-gray.gif" alt="" /> Saving Test...</div>';
        clicked_button.parents('.TabContentBody').prepend(loading_text);
        $.post('/ajax_widget?page=book.html&widget=Self Check Test&functionName=saveTest&level_id='+ $(this).attr('data-level-id' )+ '& book_id='+tab_content.attr('data-book-id')+'&zone='+tab_content.attr('data-zone')

            ,$("#SelfCheck").serialize(),function(data){
                clicked_button.parents('.TabContentBody').html(data);
                activateBackButton();
            
            });

    })
    //add audio
    $('.SelfChecksWidget .AudioPlaceholder').each(function(){

        $(this).flash({
            swf:'/design/SampleTemplate/widgets/Oxford/MultimediaWidget/swfs/player2.swf',
            width:$(this).parents('.TabContentBody').attr('data-popup-width')*1-140,
            height:16,
            bgcolor:'#DCDCE1',
            scale:'noscale',
            allowFullscreen:true,
            flashVars:{
                filepath: $(this).attr('data-file-path'),
                autoplay:0,
                debug:0/*
				duration: player_duration,
				start:player_start*/
            }
        });
    })

}
function activateBackButton(){
    $('.CommandButton.Back').click(function(e){
        e.preventDefault();
        var loading_text='<div class="Loader"><img src="/design/SampleTemplate/images/loader-gray.gif" alt="" /> Loading content...</div>';

        var tab_content=$(this).parents('.TabContent');
        var book_id=tab_content.attr('data-book-id');
        var data_zone=tab_content.attr('data-zone');
        var content_body=$(this).parents('.TabContentBody');
        content_body.html(loading_text);


        $.get('/ajax_widget?page=book.html&widget=Self-Checks&functionName=getContent',{
            book_id:book_id,
            zone:data_zone
        },function(data){
            content_body.html(data);
            activateNewButton();
            activateViewButton();
            buildSelfCheckAccordion('.SelfCheckOverview','.Togglable');

        });

    })
}
function activateStateButton(){
    $('.Open .State').unbind('click').bind('click',function() {
        if(confirm('Are you sure you want to delete this question and all accoiated options and user answers?')){
            $(this).parents('.selfcheckTestQuestion').remove();
            $.get('/ajax_widget?page=book.html&widget=Self-Checks&functionName=AjaxState',{
                id:$(this).parents('.RearEndState').attr('data-id'),
                zone:'RightAdminZone'
            },function(data){


                });
        }

    })
}
function sortChoices(){
    var answer_content=$('.Answers').sortable({
        cursor: 'move',
        items: '.Answer',
        handle: '.SortArrow',
        delay: 50,
        revert: false ,
        scroll: false,
        smooth: false,
        opacity: 0.6
    }).bind('sortstart', function(event, ui) {

        }).bind('sortreceive', function(event, ui) {


        }).bind('sortstop', function(event, ui) {
        str='';
        (ui.item).parents('.Answers').find('.Answer').each(function(){
            str=str + $(this).find('.RearEndChoice').attr('data-id')+ ",";
        })
        $.post('/ajax_widget?zone=RightAdminZone&page=admin&widget=Self-Checks&functionName=AjaxSortOptions',{

            str:str
        },function(data){

            });
        
    });
}
function sortSequenceQuestions(){
    var answer_content=$('.Answers').sortable({
        cursor: 'move',
        items: '.Answer',
        axis:'y',
        delay: 50,
        revert: false ,
        scroll: false,
        smooth: false,
        opacity: 0.6
    }).bind('sortstart', function(event, ui) {

        }).bind('sortreceive', function(event, ui) {


        }).bind('sortstop', function(event, ui) {
        str='';
        (ui.item).parents('.Answers').find('.Answer').each(function(){
            str=str + $(this).find('.SortArrow').attr('data-answer-id')+ ",";
        });
        (ui.item).parents('.Sequence').find('.SequenceField').val(str);
        
    //        //$.post('/ajax_widget?zone=RightAdminZone&page=admin&widget=Self-Checks&functionName=AjaxSortOptions',{
    //
    //            str:str
    //        },function(data){
    //
    //            });

    });
}
function rebindSelfChecks(self_checks_object)
{
    self_checks_object.parents('.selfcheckTestQuestion').find('.ClickArea').children().unselectable();
    self_checks_object.parents('.selfcheckTestQuestion').find('.ClickArea').unbind('click').bind('click',function() {
    
        if($(this).parents('.Editable').hasClass('OnEdit')){
            $(this).parents('.Editable').removeClass('OnEdit');
            if ($(this).parents('.selfcheckTestQuestion').find('textarea').hasClass('hasEditor')) {
                $(this).parents('.selfcheckTestQuestion').find('textarea').removeClass('hasEditor');
            }
        }else{
            $(this).parents('.selfcheckTestQuestion').find('.Editable').removeClass('OnEdit') ;
            $(this).parents('.Editable').addClass('OnEdit');
            functionName=$(this).parents('.Editable').attr('data-function-name');
            id=$(this).parents('.Editable').attr('data-id');
            editArea=$(this).parents('.Editable').find('.EditArea');
            editArea.addClass('EditAreaLoader');

            $.get('/ajax_widget?zone=RightAdminZone&page=admin&widget=Self-Checks',{
                functionName:functionName,
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
                    if ($("#"+form_id).hasClass('FileForm')) {
                        $("#"+form_id).ajaxSubmit({
                            url:'/ajax_widget?zone=RightAdminZone&page=admin&widget=Self-Checks&functionName='
                            + functionName
                            +'&id='+ id,
                            iframe:true
                            ,
                            success:update_self_checks
                        }
                        )
                        $(this).attr('disabled','disabled');
                        $(this).closest('.ButtonWrap').prepend($('<div />').html('<span class="loading"></span>'))
                        return '';
                    }

                    $.post('/ajax_widget?zone=RightAdminZone&page=admin&widget=Self-Checks&functionName='
                        + functionName
                        +'&id='+ id

                        ,$("#"+form_id).serialize(),update_self_checks);
                });
            });
        }
    })
    sortChoices();
    activateStateButton();

}
function update_self_checks(data)
{
    editArea.parents('.Editable').removeClass('OnEdit');

    switch(functionName){
        case 'AjaxDisplayType':
            editArea.parents('.Editable').find('.ClickArea').html(data);
            editArea.parents('.selfcheckTestQuestion').removeClass('Vertical');
            editArea.parents('.selfcheckTestQuestion').removeClass('Horizontal');
            new_class=editArea.parents('.Editable').find('.DivValue').attr('data-type')
            editArea.parents('.selfcheckTestQuestion').addClass(new_class);

            break;
        case 'AjaxAddOption':
            editArea.parents('.selfcheckTestQuestion').find('.Answers').replaceWith(data);

            rebindSelfChecks(self_checks_object);
            break;
        default:
            editArea.parents('.Editable').find('.ClickArea').html(data);
            break;
    }

    if (editArea.find('textarea').hasClass('hasEditor')) {
        editArea.find('textarea').removeClass('hasEditor');


    }
    editArea.html('');
}

function bindInputClicks(self_checks_object) {
    self_checks_object.parents('.selfcheckTestQuestion').find('.ChoiceRadio').click(function(){
        $.post('/ajax_widget?zone=RightAdminZone&page=admin&widget=Self-Checks&functionName=AjaxSaveCorrect'
            ,{
                id:$(this).attr('value')
            },function(data){


            });
    });
}
function buildSelfCheckAccordion(main_tag, click_area) {
    $(main_tag +' ul ul').hide();
    $(main_tag +' li '+ click_area).click(function() {
        $(this).parents('li').find('.PlayscriptSelfcheck').toggle();
        $(this).toggleClass('Open');
    })
}

function initSelectSelfcheck() {
    $('.SelfCheckSceneSelection').live('change',function(){

        var new_page=$(this).find('option[selected]').attr('value');
        var clicked_button=$(this);

        //alert(new_level_title);

        $.get(window.location.href,{
            id: new_page
        },function(data){
            $('body').html(data);
            initAdminArrows();
        });
    })
}

function initAdminArrows() {
    $('.QuestionAdminArrow').live('click',function(e){
        e.preventDefault();
        arrow=$(this);
        var question_id=$(this).parents('.selfcheckTestQuestion').attr('id');
        $(this).parents('.selfcheckTest').find('.Open').each(function(){
            if($(this).attr('id')!=question_id){
                $(this).removeClass('Open');
                $(this).find('.QuestionAdminArrow').html('Edit');
            }
        });
        $(this).parents('.selfcheckTestQuestion').toggleClass('Open');
        if($(this).parents('.selfcheckTestQuestion').hasClass('Open')){
            $(this).html('Close');
            rebindSelfChecks($(this));
            bindInputClicks($(this));
        }else{
            $(this).parents('.selfcheckTestQuestion').find('.ClickArea').unbind('click');
            $(this).parents('.selfcheckTestQuestion').find('.Editable').removeClass('OnEdit');
            $(this).html('Edit');
        }


    })
}

$(document).ready(function(){
    initSelectSelfcheck();
    initAdminArrows();
    activateStateButton()
    activateToggleSelfCheckButtons();
});
function activateToggleSelfCheckButtons()
{
        
    $('.ChoiceDeactivate').live('click',function(){
        if(!$(this).parents('.Answer').find('.ChoiceRadio').attr('checked')){
            if(confirm('Are you sure you want to delete this option and all accoiated user answers?')){
                $.post(window.location.href,{
                    sub_action:'change_answer_toggle',
                    is_live:$(this).hasClass('ChoiceLive')?1:0,
                    answer_id:$(this).attr('data-answer-id')
                },function(data){

                    })
                parent=$(this).parents('.Answers');
                $(this).parents('.Answer').remove();
                str='';
                parent.find('.Answer').each(function(){
                    str=str + $(this).find('.RearEndChoice').attr('data-id')+ ",";
                })
                $.post('/ajax_widget?zone=RightAdminZone&page=admin&widget=Self-Checks&functionName=AjaxSortOptions',{

                    str:str
                },function(data){

                    });
            }
        }else{
            alert('You cannot delete selected option!');
        }
    })
	
}