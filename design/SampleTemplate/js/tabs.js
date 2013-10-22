$(function() {

    sizeInterface($('.book_nav_widescreen').hasClass('Selected'));

    // set the master vars for JS access
    $('select.MasterSceneSelection option').attr('selected',false);
    $('select.MasterSceneSelection option[data-number='+ 0 +']').attr('selected',true);
    var MASTER_SPINE_PAGE = 0;
    var MASTER_TOCL_ID = $('select.MasterSceneSelection').find('option[selected]').attr('value');

    $(window).resize(function(){
        sizeInterface($('.book_nav_widescreen').hasClass('Selected'));

    });

    $.extend({
        saveTabStates:function(){
            var zones=$('.BookWrap').children('.ZoneDiv');
            var zone_info=[];
            zones.each(function(zone_index){
                var zone_id=$(this).attr('id').replace('ZoneDiv_','')
                $(this).children().children().each(function(index){
                    zone_info.push({
                        name:zone_id+'_'+$(this).attr('id').replace('WidgetDiv_',''),
                        value:$(this).hasClass('Selected')?1:0
                        });
                })
            })
            zone_info.push({
                name:'widescreen',
                value:$('.book_nav_widescreen').hasClass('Selected')?1:0
                });

            $.post('/ajax_widget?page=book.html&widget=Playscript&functionName=saveBookOrder&book_id='+$('.OxfordBookBar').attr('data-book-id')+'&zone=BookLeftZone',
                zone_info);
        }
    })

	
    $('.TabHeadWrap').click(function() {
        hideHome();
        var has_selected=$(this).parent('div').hasClass('Selected');
        $(this).parents('.ZoneDiv').children().children('.WidgetDiv').each(function() {
            $(this).removeClass('Selected');
        });
        $(this).parent('div').addClass('Selected');
		
        var widget_name=$(this).next().attr('data-widget');
        var book_id=$(this).next().attr('data-book-id');
        var zone_name=$(this).next().attr('data-zone-name');
        var put_content=$(this).next().children('.TabContentBody');
        var loading_text='<div class="Loader"><img src="/design/SampleTemplate/images/loader-gray.gif" alt="" /> Loading content...</div>';

        if($('a.BookLogo[data-master-page]')) {
            MASTER_SPINE_PAGE = $('a.BookLogo').attr('data-master-page');
            MASTER_TOCL_ID = $('a.BookLogo').attr('data-master-tocl-id');
        }

        if (!put_content.hasClass('init_loaded')) {
            put_content.addClass('init_loaded');
            put_content.html(loading_text)
            $.get('/ajax_widget?page=book.html&widget='+widget_name+'&functionName=getContent',{
                book_id:book_id,
                zone:zone_name,
                spine_page:MASTER_SPINE_PAGE,
                master_tocl:MASTER_TOCL_ID
            },function(data){
                put_content.html(data);

                //bootstraps
                switch (widget_name) {
                    case 'Playscript':
                        bootstrap_playscript();
                        break;
                    case 'Graphic Novel':
                        bootstrap_graphic_novel();
                        break;
                    case 'Discovery Guide':
                        bootstrap_discovery_guide();
                        break;
                    case 'Multimedia':
                        bootstrap_multimedia();
                        break;
                    case 'Glossary':
                        bootstrap_glossary_guide();
                        break;
                    case 'Self-Checks':
                        bootstrap_self_checks();
                        break;
                    case 'Notebook':
                        bootstrap_notebook();
                        break;
                    case 'Downloads':
                        bootstrap_downloads();
                        break;
                }
				
            });
        }
        if ($(this).data('fake-click') || has_selected) {
            $(this).data('fake-click',false)
        }else{

            $.cookie('tab_'+$(this).parents('.ZoneDiv').attr('id'),$(this).parent().attr('id'));
            $.saveTabStates();
        }
    });
    $('.book_nav_home').click(function(e) {
        if($(this).hasClass('Selected')){
        //hideHome();
        }else{
            $('.WidgetDiv.Selected').removeClass('Selected');
            $(this).addClass('Selected');
            height=$(window).height()-160;
            $('.BookHomeZone').attr('style','display:block;height:'+height+'px');
        }
    });
    $('.book_nav_widescreen').click(function(e) {

        e.preventDefault();
        hideHome();
        if ($(this).hasClass('Selected')) {
            $('.BookMiddleZone').children().children().each(function(index,value) {
                $(index%2==0?'.BookLeftZone':'.BookRightZone').children().append($(this));
            })
        }else{
            if ($('.BookMiddleZone').children().children().length==0) {
                $('.ZoneDiv:not(.BookMiddleZone) .NestedTabsWidget').each(function(){
                    var unused_tabs=Math.ceil($(this).children('.WidgetDiv:not(.Selected)').length/2);
                    $(this).children('.WidgetDiv:not(.Selected)').each(function(index,value) {
                        if (index>=unused_tabs) {
                            $('.BookMiddleZone').children().append($(this));
                        }
                    })
                })


            /*$('.PageContentSwapper .WidgetDiv .WidgetDiv:not(.Selected)').each(function(index,value) {

				})*/
            }
        }
        sizeInterface($('.book_nav_widescreen').toggleClass('Selected').hasClass('Selected'));
        $.saveTabStates();
    });
    sizeAndSelect();
    var sort_content=$('.NestedTabsWidget').sortable({
        cursor: 'move',
        items: '.WidgetDiv',
        handle: '.TabHeadWrap',
        delay: 50,
        revert: false ,
        axis: 'x',
        scroll: false,
        smooth: false,
        opacity: 0.6,
        connectWith: '.NestedTabsWidget'
    }).bind('sortstart', function(event, ui) {
        //        parent_zone=$(ui.item).parents().find('.ZoneDiv').attr('id');
        //        console.log($(ui.item));
        //$('.TabContent').css('display','none');
        }).bind('sortreceive', function(event, ui) {
        

        }).bind('sortstop', function(event, ui) {
        sizeAndSelect(true,$(ui.item).attr('id'));
        $.saveTabStates();
    });
});
function hideHome(){
    $('.BookHomeZone').attr('style','display:none');
    $('.book_nav_home').removeClass('Selected');

}
function sizeAndSelect(onDrag,item_id){
    var zones=['.BookLeftZone','.BookRightZone','.BookMiddleZone'];
    $(zones).each(function(index,zone) {
        var zone_width=$(zone).width();
        var count=$(zone + ' .NestedTabsWidget .WidgetDiv').length;
        $(zone + ' .NestedTabsWidget .WidgetDiv .TabSpacer').css('display','block');
        $(zone + ' .NestedTabsWidget .WidgetDiv').removeClass('Last');
        var tab_width=Math.floor(zone_width/count)-29;
        var diff_width=zone_width-count*Math.floor(zone_width/count)+1;
        $(zone + ' .NestedTabsWidget .WidgetDiv').each(function(index) {
            $(this).find('.TabHeadBody').width(tab_width+(index==0?diff_width:0));
        });

        if(!onDrag){
            $(zone + ' .NestedTabsWidget .WidgetDiv').removeClass('Selected');
            $(zone + ' .NestedTabsWidget .WidgetDiv:first').addClass('Selected');
        }
        $(zone + ' .NestedTabsWidget .WidgetDiv:last').addClass('Last');
        $(zone + ' .NestedTabsWidget .WidgetDiv:last .TabSpacer:last').css('display','none');
    });
    $(zones).each(function(index,zone) {
        if($(zone).find('.Selected').length==0){
            $(zone + ' .NestedTabsWidget .WidgetDiv:first').addClass('Selected');
        }
    
        if($(zone).find('.Selected').length>1){
            $(zone + ' .NestedTabsWidget .WidgetDiv').removeClass('Selected');
            $('#' + item_id).addClass('Selected');
        }
    });
    $('.BookWrap').children('.ZoneDiv').each(function(){
		
        if ($.cookie('tab_'+$(this).attr('id'))) {
            if ($(this).children().children('#'+$.cookie('tab_'+$(this).attr('id'))).length>0) {
                $(this).children().children().removeClass('Selected');
                $(this).children().children('#'+$.cookie('tab_'+$(this).attr('id'))).addClass('Selected');
                $('#'+$.cookie('tab_'+$(this).attr('id'))).children('.TabHeadWrap').data('fake-click',true).click();
            }
        }
    });
    $('.WidgetDiv.Selected').children('.TabHeadWrap').data('fake-click',true).click();
}
function sizeInterface(widescreen,redo_size){
    window_width=$(window).width();
    window_height=$(window).height();
    zone_width=(widescreen)?Math.floor((window_width-24) /3):Math.floor((window_width-12)/2);
    tab_content_width=zone_width-2;
    tab_content_height=window_height-160;
    
    tab_head_width=tab_content_width-26;
    
    $('.Container').width(window_width);
    $('.Container').height(window_height);
    $('.Wrap').width(window_width);
    $('.Wrap').height(window_height);
    $('.BookLeftZone').width(zone_width);
    $('.BookRightZone').width(zone_width);
    $('.BookMiddleZone').width(zone_width);
    if(widescreen){
        $('.BookMiddleZone').css('display','block');
        $('.TabZoneDivider.Last').css('display','block');
    }else{
        $('.BookMiddleZone').css('display','none');
        $('.TabZoneDivider.Last').css('display','none');
    }
    $('.TabContent').width(tab_content_width);

    
    $('.BookWrap').height(tab_content_height+46);
    $('.BookHomeZone').height(tab_content_height);
    $('.TabZoneDivider').height(tab_content_height+46);
    $('.TabContent').height(tab_content_height);
    $('.TabContentHead').width(tab_head_width);

    $('.TabContentBody').each(function(){
        var has_dock=$(this).parents('.dock_show').length>0;
        $(this).height(tab_content_height - 34 - (has_dock?71:0));
        $(this).children('.PopupContainer').width(tab_head_width).height(tab_content_height - 34);
        $(this).children('.PopupContainerContent').width(tab_head_width-16).height(tab_content_height - 34 - 100);
        //store these so we can fill em later
        $(this).attr('data-popup-width',tab_head_width*1-13);
        $(this).attr('data-popup-height',tab_content_height - 34 - 100);
    })


    $('.TabContentFooter').css('top',(tab_content_height - 34)+'px')

    if (typeof(redo_size)=='undefined') {
        sizeInterface(widescreen,true);
    }else{
        sizeAndSelect();
    }
    $('.AddNotebookTooltip').remove();
}
