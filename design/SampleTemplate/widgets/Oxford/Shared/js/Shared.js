var old_def;
var glossary_timeout;
$(function(){
    $('.AccountSelectorProvince select').live('change',function(){
        $.post('/ajax_widget?zone=BottomLeftZone&page=admin&widget=AccountContentWidget&functionName=AjaxContent&dataFunctionName=getSchoolDistricts',{province:$(this).find('option:selected').val()},function(data){
            $('.AccountSelectorSchoolDistrict select').html(data)
            $('.AccountSelectorSchool select').html('<option value="">Pick a School District First</option');
	});
    })
    $('.AccountSelectorSchoolDistrict select').live('change',function(){
        var district=$(this).find('option:selected').val();
        if (district) {
            $.post('/ajax_widget?zone=BottomLeftZone&page=admin&widget=AccountContentWidget&functionName=AjaxContent&dataFunctionName=getSchools',{district:district,province:$('.AccountSelectorProvince').find('option:selected').val()},function(data){
                $('.AccountSelectorSchool select').html(data)
            });
        }
    })
	$.extend({
		 refreshNotebookToggles:function(){
			 $('.AddNotebookTooltip').remove();
			$('.NotebookTypes li').each(function(){
				var items_to_hide=[$(this).attr('data-type')];
				if ($(this).attr('data-type')=='Note') {
					items_to_hide.push('Title');
				}
				var element_clicked=$(this);
				$(items_to_hide).each(function(index,item_value) {
					var notebook_li=$('.NotebookWrapper .Entry'+item_value);
					if (element_clicked.hasClass('Toggled')) {
						notebook_li.hide();
					}else{
						notebook_li.stop(true,true).show();
					}
				});
				
			})

			$('.NotebookWrapper,.EntryFolder .EntryContent').sortable({
				cursor: 'move',
				items: '> .EntryWrapper:not(.EntryEmpty)',
				handle: '.SortArrow',
				placeholder: 'ui-playscript-placeholder',
				delay: 50,
				revert: false ,
				//axis:'y',
				scroll: false,
				smooth: true,
				opacity: 0.6,
				dropOnEmpty:true,
				//grid:[10,10],
			//tolerance:'intesect',
				connectWith: '.NotebookWrapper .ui-sortable',
				
				start: function(event, ui) {$(this).addClass('StartedSort')},
				stop: function(event, ui) {$(this).removeClass('StartedSort')}

				}).bind('sortstop', function(event, ui) {
					var list_of_items=$('.NotebookWrapper');
				var sort_data=list_of_items.sortable("toArray", {attribute: "data-entry-id",expression:'(.+)'});

				$.post('/ajax_widget?page=book.html&widget=Notebook&functionName=sortEntries',{book_id:$(this).closest('.TabContent').attr('data-book-id'),zone:$(this).closest('.TabContent').attr('data-zone'),entries:sort_data},function(data){
				});

			});

		}
	});

	$.fn.extend({
		//tooltips
		
		attachTooltip:function(){
			$(this).each(function(){
				var tooltip_id=$(this).attr('data-id');
				var tooltip_text=$(this).text();
				var playscript=$(this).parents('.TabContent');
				var footer=playscript.children('.TabContentFooter');
				var content_body=playscript.children('.TabContentBody');
				var dock=footer.children('.Dock').children('.DockContent');
				var loading_text='<img src="/design/SampleTemplate/images/loader-tooltip.gif" alt="" /> Loading definition...';
				var popup_container=playscript.children('.TabContentBody').children('.PopupContainer');
				var popup_container_content=playscript.children('.TabContentBody').children('.PopupContainerContent');
                                var tab_content=$(this).parents('.TabContent');
				$(this).bind('mouseover',function(){
					if (!playscript.hasClass('dock_show') || $(this).hasClass('turned_off')) {
						return;
					}
					if (glossary_timeout) {
						clearTimeout(glossary_timeout);
					}
					glossary_timeout=setTimeout(function(){
						if (old_def) {
							old_def.abort();
						}
						old_def=$.get('/ajax_widget?page=book.html&widget=Playscript&functionName=getPopup',{id:tooltip_id,text:tooltip_text,book_id:tab_content.attr('data-book-id'),zone:tab_content.attr('data-zone')},function(data){
							if (data) {
								dock.html(data);
							}
						});
					},500)
				})
				$(this).bind('click',function(){
					if ($(this).hasClass('turned_off')) {
						return;
					}

					var came_from=$(this).parents('.TabContentBody').children().children('.TopHeader:first').text();

					$.get('/ajax_widget?page=book.html&widget=Playscript&functionName=getFullPopup',{id:tooltip_id,from:came_from,text:tooltip_text,book_id:tab_content.attr('data-book-id'),zone:tab_content.attr('data-zone')},function(data){
						footer.hide();
						popup_container_content.html(data);

						playscript.children('.TabContentBody').children().each(function(){
							if (!$(this).hasClass('PopupContainer') && !$(this).hasClass('PopupContainerContent')) {
								$(this).animate({left:(playscript.width())*-1,opacity:0},400);
							}
						})

						popup_container.css('width',(content_body.attr('data-popup-width')*1)+'px');
						popup_container.css('height',(content_body.attr('data-popup-height')*1)+'px');
						popup_container_content.css('top',(content_body.scrollTop())+'px');
						popup_container_content.css('width',content_body.attr('data-popup-width')+'px');
						popup_container_content.css('height',content_body.attr('data-popup-height')+'px');
						popup_container_content.css('left',(playscript.width())+'px')
						popup_container_content.animate({left:0,opacity:1},400)
						//popup_container_content.show();

						popup_container_content.find('.GoBack').click(function(){
							footer.show();
							playscript.children('.TabContentBody').children().each(function(){
								if (!$(this).hasClass('PopupContainer') && !$(this).hasClass('PopupContainerContent')) {
									//$(this).fadeIn('fast')
									$(this).animate({left:0,opacity:1},{duration:400})


								}
							});
							popup_container_content.animate({left:(playscript.width()),opacity:0},{duration:400});

							//popup_container.fadeOut();


						});
						/* for pdfs */
						/*
						popup_container.fadeIn();
						popup_container_content.css('left','-'+(popup_container_content.width()+50)+'px')
						popup_container_content.show();
						popup_container_content.animate({left:40},1000)
						popup_container_content.find('.closeButton').click(function(){
							popup_container_content.animate({left:(popup_container_content.width()+50)*-1},1000)
							popup_container.fadeOut();
						})*/
					});
				})

				$(this).tooltip({
					bodyHandler: function() {
						if ($(this).hasClass('turned_off') || playscript.hasClass('dock_show')) {
							$('#tooltip').addClass('off');
							return '';
						}else{
							$('#tooltip').removeClass('off');
						}

						if (old_def) {
							old_def.abort();
						}
						old_def=$.get('/ajax_widget?page=book.html&widget=Playscript&functionName=getPopup',{id:tooltip_id,text:tooltip_text,book_id:tab_content.attr('data-book-id'),zone:tab_content.attr('data-zone')},function(data){
							$('#tooltip').removeClass('loading');
							$('#tooltip div.body').html(data);
						});
						$('#tooltip').addClass('loading');
						return loading_text;
					},
					showURL: false
				});
			});
		}
	})
	$('.bookmarkBtn').live('click',function(e){
		e.preventDefault();
		var clicked_btn=$(this);
		$.post('/ajax_widget?page=book.html&widget=Notebook&functionName=getPopupTooltip',{data1:$(this).attr('data-note-data1'),data2:$(this).attr('data-note-data2'),data3:$(this).attr('data-note-data3'),type:$(this).attr('data-note-type'),book_id:$(this).closest('.TabContent').attr('data-book-id'),zone:$(this).closest('.TabContent').attr('data-zone')},function(data){
			$('.AddNotebookTooltip').remove();
			$('body').append(data);
			var left_position=clicked_btn.offset().left*1;
			if (left_position>$(window).width()) {
				left_position=$(window).width()-412;
			}
			
			$('.AddNotebookTooltip').css({top:(clicked_btn.offset().top+20)+'px',left:(left_position-5)+'px'});

			//$.refreshNotebookToggles();
		});
	});

	$('#AddPlayscriptTooltip').live('mousedown',function(e){
		$('.AddNotebookTooltip').remove();
		e.preventDefault();
		var clicked_btn=$(this);
		var top_location=clicked_btn.offset().top;
		var left_location=clicked_btn.offset().left;
		clicked_btn.hide();
		$.post('/ajax_widget?page=book.html&widget=Notebook&functionName=getPopupTooltip',{strip_tags:true,data1:$(this).data('data-note-data1'),data2:$(this).attr('data-note-data2'),data3:$(this).attr('data-note-data3'),type:$(this).attr('data-note-type'),book_id:$(this).closest('.TabContent').attr('data-book-id'),zone:$(this).closest('.TabContent').attr('data-zone')},function(data){
			$('body').append(data);
			$('.AddNotebookTooltip').css({top:(top_location+20)+'px',left:(left_location-5)+'px'});

			//$.refreshNotebookToggles();
		});
	});

	$('.AddNotebookTooltip .CloseWindowBtn').live('click',function(){
			$(this).closest('.AddNotebookTooltip').remove();
		})
	$('.AddNotebookTooltip .ListBookmarks li:not(.CloseWindowBtn)').live('click',function(){
		var page_id=$(this).attr('data-page-id');
		var is_new_page=$(this).hasClass('NewPage');
		var folder_id=$(this).attr('data-folder-id');
		$('.AddNotebookTooltip div').animate({ backgroundColor: "#4FFF67" }, 100).parent().fadeOut(function(){$(this).remove()});
		$.post('/ajax_widget?page=book.html&widget=Notebook&functionName=addEntry',{folder_id:folder_id,data1:$(this).attr('data-data1'),data2:$(this).attr('data-data2'),data3:$(this).attr('data-data3'),page_id:page_id,type:$(this).attr('data-type'),book_id:$(this).closest('.AddNotebookTooltip').attr('data-book-id'),zone:$(this).closest('.AddNotebookTooltip').attr('data-zone')},function(data){
			if (page_id==$('.NotebookWrapper').attr('data-current-page') || is_new_page) {
				$('.NotebookWrapper').parent().html(data);
				if (is_new_page) {
					var new_page_value=$('.NotebookWrapper .TopHeader .NotesHead').attr('data-page-id');
					var new_page_name=$('.NotebookWrapper .TopHeader .NotesHead').text();
					//var new_option=$('<option></option>').attr('value',new_page_value).text(new_page_name).attr('selected','selected');
					$('.NotebookWidget .TabContentHead select').append('<option value="'+new_page_value+'" selected="selected">'+new_page_name+'</option>');
				}
			}
			$.refreshNotebookToggles();
		});
		
	})
	

	$('.DockContentToggle').live('click',function(){
		$(this).toggleClass('DockContentToggled');
		$(this).parents('.TabContent').toggleClass('dock_show');
		sizeInterface($('.book_nav_widescreen').hasClass('Selected'));
	})

	

	//todo size selections
	
	//todo master switches
//	$('.MasterSceneSelection').change(function(){
//	});

})
function dock_show(show_on)
{
	show_on.addClass('dock_show');
	sizeInterface($('.book_nav_widescreen').hasClass('Selected'));
}

var new_page = undefined;

function updateDDs(new_val) {
   $('select.MasterSceneSelection option').attr('selected',false);
   $('select.MasterSceneSelection option[data-number='+ new_val +']').attr('selected',true);

   new_page = new_val;
   tocl_id= $('select.MasterSceneSelection').find('option[selected]').attr('value');
   $('a.BookLogo').attr('data-master-page',new_page);
   $('a.BookLogo').attr('data-master-tocl-id',tocl_id);
   //var alert_text = '> updateDDs('+new_val+')\n   tocl_id= '+ tocl_id;
   //alert(alert_text);
   if($('.Multimedia').attr('data-zone')){
       $.get('/ajax_widget?page=book.html&widget=Multimedia&functionName=getContent',{
           master_tocl:tocl_id,
           book_id:$('.Multimedia').attr('data-book-id'),
           zone:$('.Multimedia').attr('data-zone')},
        function(data){
                $('.MultimediaWidget').find('.TabContentHead').next().html(data);
                $('.multimediaPreviousButton').attr('data-page',new_val*1-1);
                $('.multimediaNextButton').attr('data-page',new_val*1+1);
                check_hide_media_nav_buttons();
        });
    }
   
    if($('.Playscript').attr('data-zone')) {
        $.get('/ajax_widget?page=book.html&widget=Playscript&functionName=getContent',{
            master_tocl:tocl_id,
            spine_page:new_val,
            book_id:$('.Playscript').attr('data-book-id'),
            zone:$('.Playscript').attr('data-zone')},
         function(data){
                $('.Playscript').parent().html(data);

                parse_playscript();

                $('.playscriptPreviousButton').attr('data-page',new_val*1-1);
                $('.playscriptNextButton').attr('data-page',new_val*1+1);
                //alert_text += '\n\nNEW VALS:\npage: '+ new_val +'\ntocl:'+tocl_id;
                //alert(alert_text);
                check_hide_playscript_nav_buttons();
        });
    }

    if($('.DiscoveryGuide').attr('data-zone')) {
        $.get('/ajax_widget?page=book.html&widget=Discovery Guide&functionName=getContent',{
            book_id:$('.DiscoveryGuide').attr('data-book-id'),
            master_tocl:tocl_id,
            zone:$('.DiscoveryGuide').attr('data-zone')},
         function(data){
            $('.DiscoveryGuide').parent().html(data);
            //alert('BOOK_ID: '+ $('.DiscoveryGuide').attr('data-book-id') +'\nLEVEL_ID: '+ new_page +'\nDATA: '+ data);
            $('.discoveryPreviousButton').attr('data-page',new_val*1-1);
            $('.discoveryNextButton').attr('data-page',new_val*1+1);
            refreshDiscoveryGuide();
        });
    }
    $('.AddNotebookTooltip').remove();
	$('.TabContentBody').scrollTop(0)
}