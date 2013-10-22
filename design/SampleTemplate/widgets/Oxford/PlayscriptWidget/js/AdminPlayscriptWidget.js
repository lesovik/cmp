var highlighting_number=[];
var same_line=[];
var used_numbers=[];
var old_def;

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

$(document).ready(function(){


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

				$(this).bind('mouseover',function(){



					if (!playscript.hasClass('dock_show') || $(this).hasClass('turned_off')) {
						return;
					}

					if (old_def) {
						old_def.abort();
					}
					old_def=$.get('/ajax_widget?page=book.html&widget=Playscript&functionName=getPopup',{id:tooltip_id,text:tooltip_text,book_id:$('.Playscript').attr('data-book-id'),zone:'BookLeftZone'},function(data){
						if (data) {
							dock.html(data);
						}
					});
				})
				$(this).click(function(){

					if ($(this).hasClass('turned_off')) {
						return;
					}

					var came_from=$(this).parents('.TabContentBody').children().children('.TopHeader:first').text();

					$.get('/ajax_widget?page=book.html&widget=Playscript&functionName=getFullPopup',{id:tooltip_id,from:came_from,popup:true,text:tooltip_text,book_id:$('.Playscript').attr('data-book-id'),zone:'BookLeftZone'},function(data){
						$.facebox(data);
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
						old_def=$.get('/ajax_widget?page=book.html&widget=Playscript&functionName=getPopup',{id:tooltip_id,text:tooltip_text,book_id:$('.Playscript').attr('data-book-id'),zone:'BookLeftZone'},function(data){
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



	parse_playscript();

});