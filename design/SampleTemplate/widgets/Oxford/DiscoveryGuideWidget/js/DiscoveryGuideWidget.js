function bootstrap_discovery_guide()
{
	$(document).ready(function(){
            if(new_page != undefined){
                updateDDs(new_page);
            }
		initSelect();
		refreshDiscoveryGuide();
		initNavButtons();
	});
}

function refreshDiscoveryGuide() {
    initJournalEntryButtons();
    buildAccordion('.DiscoveryGuide', '.CategoryNameWrap');
    check_hide_discovery_nav_buttons();
}

function initJournalEntryButtons() {
    $('span.journalBtn').each(function() {
        $(this).click(function(e) {

                //alert('ID: '+ $(this).attr('data-id') +'\nContents:\n'+ $(this).next().html());
                
                console.log(e);
        });
    });
}

function initSelect() {
    $('.DiscoveryGuideSelection').change(function(){

        //var new_page=$(this).find('option[selected]').attr('value');
        //var new_level_title = $(this).find('option[selected]').text();
        //var clicked_button=$(this);
        var btnValue = $(this).find('option[selected]').attr('data-number');
        updateDDs(btnValue);
        //alert(new_level_title);
/*
        $.get('/ajax_widget?page=book.html&widget=Discovery Guide&functionName=getContent',{
            book_id:$('.DiscoveryGuide').attr('data-book-id'),
            level_title:new_level_title,
            level_id:new_page,
            zone:$('.DiscoveryGuide').attr('data-zone')
        },function(data){
            clicked_button.parents('.TabContent').find('.TabContentBody').html(data);
            //alert('BOOK_ID: '+ $('.DiscoveryGuide').attr('data-book-id') +'\nLEVEL_ID: '+ new_page +'\nDATA: '+ data);
            refreshDiscoveryGuide();
        });

        
        //alert('NEW btnValue: '+ btnValue);
        $('.discoveryPreviousButton').attr('data-page',btnValue*1-1);
        $('.discoveryNextButton').attr('data-page',btnValue*1+1);
        check_hide_discovery_nav_buttons();
        */
    })
}

function initNavButtons() {
    var refer = this;
    $('.discoveryNextButton').click(function(e){
		e.preventDefault();

		var clicked_button=$(this);

                var btnValue = clicked_button.attr('data-page');
                updateDDs(btnValue);
                /*
                var new_page = $(this).attr('data-page');
                new_page = $('select.DiscoveryGuideSelection option[data-number='+ new_page +']').attr('value');
                
		//$.get('/ajax_widget?page=book.html&widget=Playscript&functionName=getContent',{playscript_page:$(this).attr('data-page'),book_id:$('.Playscript').attr('data-book-id'),zone:$('.Playscript').attr('data-zone')},function(data){
		$.get('/ajax_widget?page=book.html&widget=Discovery Guide&functionName=getContent',{
                    book_id:$('.DiscoveryGuide').attr('data-book-id'),
                    level_id:new_page,
                    zone:$('.DiscoveryGuide').attr('data-zone')
                },function(data){
			clicked_button.parents('.TabContent').find('.TabContentBody').html(data);
                        //alert('CHAPTER ID: '+ new_page);
			clicked_button.attr('data-page',btnValue*1+1);
			clicked_button.prev().prev().attr('data-page',btnValue*1-1);
                        refreshDiscoveryGuide();
		});
*/
	})

	$('.discoveryPreviousButton').click(function(e){
		e.preventDefault();

		var clicked_button=$(this);
                var btnValue = clicked_button.attr('data-page');
                updateDDs(btnValue);
                /*
                var new_page = $(this).attr('data-page');
                new_page = $('select.DiscoveryGuideSelection option[data-number='+ new_page +']').attr('value');
                
		//$.get('/ajax_widget?page=book.html&widget=Playscript&functionName=getContent',{playscript_page:$(this).attr('data-page'),book_id:$('.Playscript').attr('data-book-id'),zone:$('.Playscript').attr('data-zone')},function(data){
		$.get('/ajax_widget?page=book.html&widget=Discovery Guide&functionName=getContent',{
                    book_id:$('.DiscoveryGuide').attr('data-book-id'),
                    level_id:new_page,
                    zone:$('.DiscoveryGuide').attr('data-zone')
                },function(data){
			clicked_button.parents('.TabContent').find('.TabContentBody').html(data);

			clicked_button.attr('data-page',btnValue*1-1);
			clicked_button.next().next().attr('data-page',btnValue*1+1);
                        refreshDiscoveryGuide();
		});
*/
	})
        
}
function check_hide_discovery_nav_buttons()
{
	$('.discoveryPreviousButton').each(function(){
		if ($(this).attr('data-page')*1<0) {
			$(this).hide();
		}else{
			$(this).show();
		}
	});
	$('.discoveryNextButton').each(function(){
		if ($(this).attr('data-page')*1>=$(this).attr('data-max-page')*1) {
			$(this).hide();
		}else{
			$(this).show();
		}
	});
	$('.discoverySeperator').each(function(){
		if (!$(this).prev().is(':visible') || !$(this).next().is(':visible')) {
			$(this).hide();
		}else{
			$(this).show();
		}
	})

}
function buildAccordion(main_tag, click_area) {
    $(main_tag +' ul ul').hide();
    $(main_tag +' li '+ click_area).click(function() {
       $(this).next().toggle();
       $(this).toggleClass('toggled');
       if($(this).next().next().attr('class') ==  'CategoryText') {
           $(this).next().next().toggle();
       }
    })
}