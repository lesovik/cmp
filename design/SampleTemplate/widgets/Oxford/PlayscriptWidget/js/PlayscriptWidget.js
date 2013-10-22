var highlighting_number=[];
var same_line=[];
var used_numbers=[];

function removeArray(arrayName,arrayElement)
 {
	for(var i=0; i<arrayName.length;i++) {
		if(arrayName[i]==arrayElement)
			arrayName.splice(i,1);
	  }
  }

function search_through(element_to_search){
	element_to_search.contents().each(function(){
		if ($(this).hasClass('continue') || $(this).hasClass('exit')) {
			search_through($(this));
			return;
		}

		if ($(this).hasClass('number_start')) {
			if (!used_numbers[$(this).attr('data-rel')]) {
				used_numbers[$(this).attr('data-rel')]=0;
			}
			used_numbers[$(this).attr('data-rel')]++;
			highlighting_number.push($(this).attr('data-rel'));
			same_line.push($(this).attr('data-rel'))
			$(this).remove();
			return;
		}
		if ($(this).hasClass('number_end')) {
			removeArray(highlighting_number,$(this).attr('data-rel'))
			$(this).removeClass('number_end');

			var class_name=$(this).attr('class');
			var use_rel=$(this).attr('data-rel');

			var is_same_line=class_name!='number3_end';
			/*
			var is_same_line=false;
			 *for(var i=0; i<same_line.length;i++) {
				if (same_line[i]==use_rel) {
					is_same_line=true;
				}
			}*/
			if (!is_same_line) {
				$(this).parent().append($('<span class="num_over num_over_'+class_name+'" rel="'+class_name+'" data-id="'+use_rel+'" data-rel="class'+use_rel+'_'+used_numbers[use_rel]+'" data-image="'+class_name+'"><img src="/design/SampleTemplate/widgets/Oxford/Shared/images/blank.gif" width="17" height="17" /></span>'));
				//$(this).remove();
			}else{
				$('.class'+use_rel+'_'+used_numbers[use_rel]).addClass('simple_over');
				$('.class'+use_rel+'_'+used_numbers[use_rel]).attr('data-id',use_rel);
				$('.class'+use_rel+'_'+used_numbers[use_rel]).addClass('simple_'+class_name);
				$('.class'+use_rel+'_'+used_numbers[use_rel]).attr('rel',class_name);
				$(this).remove();
			}
			return;
		}
		if (highlighting_number.length) {
			var new_wrap=$('<span />');
			for (var i=0;i<highlighting_number.length;i++) {
				new_wrap.addClass('class'+highlighting_number[i]+'_'+used_numbers[highlighting_number[i]])
			}
			$(this).wrap(new_wrap);
		}
	});
  }

var has_definition=[];

function parse_playscript()
{

	
	$('.Playscript .AudioPlayer').each(function(){
		var player_width=$(this).parents('.TabContentBody').attr('data-popup-width')*1-80;
		if ($(this).parent().attr('data-audio-location')) {
			$(this).flash({
				swf:'/design/SampleTemplate/widgets/Oxford/MultimediaWidget/swfs/player2.swf',
				width:player_width,
				height:16,
				bgcolor:'#DCDCE1',
				scale:'noscale',
				allowFullscreen:true,
				flashVars:{
					filepath: $(this).parent().attr('data-audio-location'),
					autoplay:0,
					debug:0,
					start:0,
					duration:0/*
					duration: player_duration,
					start:player_start*/
				}
			});
		}
	});

	
//	dock_show($('.PlayscriptWidget .TabContent'));

	$('.Playscript .normal,.Playscript .stage,.Playscript .ecenter,.Playscript .chorus,.Playscript .start_char').each(function(){
		same_line=[];
		search_through($(this));
	});
	$('.simple_over,.num_over').attachTooltip();
	$('.num_over').live('mouseover',function() {
		$('.'+$(this).attr('data-rel')).addClass($(this).attr('data-image').replace('end','over'));
	});
	$('.num_over').live('mouseout',function() {
		$('.'+$(this).attr('data-rel')).removeClass($(this).attr('data-image').replace('end','over'));
	});
	$('.playscriptGlossaryBtn a').each(function(e){
		if ($(this).hasClass('toggled')) {
			$('span[rel="number'+$(this).attr('data-number')+'_end"]').toggleClass('turned_off');
		}
	})
}

function check_hide_playscript_nav_buttons()
{
	$('.playscriptPreviousButton').each(function(){
		if ($(this).attr('data-page')*1<0) {
			$(this).hide();
		}else{
			$(this).show();
		}
	});
	$('.playscriptNextButton').each(function(){
		if ($(this).attr('data-page')*1>=$(this).attr('data-max-page')*1) {
			$(this).hide();
		}else{
			$(this).show();
		}
	});
	$('.playscriptHeadRight .seperator').each(function(){
		if (!$(this).prev().is(':visible') || !$(this).next().is(':visible')) {
			$(this).hide();
		}else{
			$(this).show();
		}
	})
	
}
function bootstrap_playscript()
{

	$(document).ready(function(){
            if(new_page != undefined){
                updateDDs(new_page);
            }
		parse_playscript();

		//toolbar on top
		$('.playscriptNextButton').click(function(e){
			e.preventDefault();

			var clicked_button=$(this);
                        var btnValue = clicked_button.attr('data-page');
                        updateDDs(btnValue);
/*
			$.get('/ajax_widget?page=book.html&widget=Playscript&functionName=getContent',{playscript_page:$(this).attr('data-page'),book_id:$('.Playscript').attr('data-book-id'),zone:$('.Playscript').attr('data-zone')},function(data){
				clicked_button.parents('.TabContentHead').next().html(data);

				clicked_button.attr('data-page',clicked_button.attr('data-page')*1+1);
				clicked_button.prev().prev().attr('data-page',clicked_button.prev().prev().attr('data-page')*1+1);
				check_hide_playscript_nav_buttons();
				parse_playscript();
			});
*/
		})

		$('.Playscript').live("mouseup", function(e){
			var level_id=$(this).attr('data-level-id');
			//remove previous selection
			$('.selectedText').each(function(){
				if ($(this).contents().length>0) {
					$(this).contents().unwrap();
				}else{
					$(this).remove();
				}
			});
			var selected_content=$('.Playscript .textContainer').wrapSelection();
			selected_content.addClass('selectedText');

			//figure out lines and such
			if ($('.selectedText').length>0) {
				$('#AddPlayscriptTooltip').show();
				$('#AddPlayscriptTooltip').remove();
				var clicked_btn=$('.selectedText:first');
				var text_container=$('.selectedText:first').closest('.textContainer');
				var text_children=text_container.children();

				var current_line=0;
				var found_first_line=0;
				var found_last_line=0;
				text_children.each(function(){
					if (($(this).hasClass('chorus') || $(this).hasClass('normal')) && $(this).children(':not(.line_end)').length>0) {
						current_line++;
					}
					if ($(this).find('.selectedText').length>0) {
						if (!found_first_line) {
							found_first_line=current_line;
						}
						found_last_line=current_line;
					}
					
				})

				var out_html='';
				selected_content.each(function() {
					out_html+=$(this).html();
				})
				//alert(out_html);

			   //var out_text=selected_content.text();
			   var lines=found_first_line+'-'+found_last_line;
				//alert(out_html +' on '+found_first_line+'-'+found_last_line);
				/*$.get('/ajax_widget?page=book.html&widget=Notebook&functionName=getPopupTooltip',{data1:out_text,data2:$(this).attr('data-note-data2'),data3:$(this).attr('data-note-data3'),type:$(this).attr('data-note-type'),book_id:$(this).closest('.TabContent').attr('data-book-id'),zone:$(this).closest('.TabContent').attr('data-zone')},function(data){
					$('.AddNotebookTooltip').remove();
					$('body').append(data);
					$('.AddNotebookTooltip').css({top:(clicked_btn.offset().top+20)+'px',left:(clicked_btn.offset().left-5)+'px'});
				});*/

				//$(this).attr('data-note-data1'),data2:$(this).attr('data-note-data2'),data3:$(this).attr('data-note-data3'),type:$(this).attr('data-note-type')
				$('.selectedText:first').append($('<div />').attr('id','AddPlayscriptTooltip').data('data-note-data1',out_html).attr('data-note-data2',lines).attr('data-note-data3',level_id).attr('data-note-type','Quote'));
				var clicked_btn=$('.selectedText');
				//$('#AddPlayscriptTooltip').css({top:(clicked_btn.offset().top+20)+'px',left:(clicked_btn.offset().left-5)+'px'});
			}else{
				$('#AddPlayscriptTooltip').hide();
			}
	  });

		$('.playscriptPreviousButton').click(function(e){
			e.preventDefault();

			var clicked_button=$(this);
                        var btnValue = clicked_button.attr('data-page');
                        updateDDs(btnValue);
/*
			$.get('/ajax_widget?page=book.html&widget=Playscript&functionName=getContent',{playscript_page:$(this).attr('data-page'),book_id:$('.Playscript').attr('data-book-id'),zone:$('.Playscript').attr('data-zone')},function(data){
				clicked_button.parents('.TabContentHead').next().html(data);

				clicked_button.attr('data-page',clicked_button.attr('data-page')*1-1);
				clicked_button.next().next().attr('data-page',clicked_button.next().next().attr('data-page')*1-1);
				check_hide_playscript_nav_buttons();
				parse_playscript();
			});
*/
		})
		$('.PlayscriptSelection').change(function(){
			var new_page=$(this).find('option[selected]').attr('data-number');
			var clicked_button=$(this).prev();
			/*
                        $.get('/ajax_widget?page=book.html&widget=Playscript&functionName=getContent',{playscript_page:new_page,book_id:$('.Playscript').attr('data-book-id'),zone:$('.Playscript').attr('data-zone')},function(data){
				clicked_button.parents('.TabContentHead').next().html(data);

				clicked_button.attr('data-page',new_page*1+1);
				clicked_button.prev().prev().attr('data-page',new_page*1-1);
				check_hide_playscript_nav_buttons();
				parse_playscript();
			});
                        */
                        var btnValue = $(this).find('option[selected]').attr('data-number');
                        updateDDs(btnValue);
                        check_hide_playscript_nav_buttons();
		})

		$('.playscriptGlossaryBtn a').click(function(e){
			e.preventDefault();

			$(this).toggleClass('toggled');
			$('span[rel="number'+$(this).attr('data-number')+'_end"]').toggleClass('turned_off');
		})

		//maybe we can merge this with shared scroll over?
		$('.AudioPlaceholder .intro').live('click',function(){
			var playscript=$(this).parents('.TabContent');
			var footer=playscript.children('.TabContentFooter');
			var came_from=$(this).parents('.TabContentBody').children().children('.TopHeader:first').text();
			var popup_container=playscript.children('.TabContentBody').children('.PopupContainer');
			var popup_container_content=playscript.children('.TabContentBody').children('.PopupContainerContent');
			var content_body=playscript.children('.TabContentBody');

			$.get('/ajax_widget?page=book.html&widget=Playscript&functionName=getSynopsis',{from:came_from,level_id:$(this).attr('data-level-id'),book_id:$('.Playscript').attr('data-book-id'),zone:$('.Playscript').attr('data-zone')},function(data){
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
							$(this).animate({left:0,opacity:1},400)
						}
					});
					popup_container_content.animate({left:(playscript.width()),opacity:0},400)
					//popup_container_content.fadeOut();
					//popup_container.fadeOut();


				});
			});
		})



		check_hide_playscript_nav_buttons();
	});


        
}