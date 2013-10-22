function bootstrap_graphic_novel()
{
	$(function(){
		$('.GraphicNovels .flash_placeholder').flash({
			swf:'/design/SampleTemplate/widgets/Oxford/GraphicNovelWidget/swfs/'+ $('.GraphicNovels').attr('data-book-id') +'/preview.swf',
			width:478,
			height:392,
			base:'/design/SampleTemplate/widgets/Oxford/GraphicNovelWidget/swfs/'+ $('.GraphicNovels').attr('data-book-id'),
			bgcolor:'#DCDCE1'
		});
		$(window).resize(resize_graphic_novels)
		resize_graphic_novels();
	});
}


function resize_graphic_novels()
{
	$('.GraphicNovels .flash_placeholder').each(function(){
		var new_width=$(this).parents('.TabContent').width();
		var new_height=$(this).parents('.TabContent').height()-35;
		$(this).children().attr('width',new_width);
		$(this).children().attr('height',new_height);
	})
}
function openPageFlip(current_page_number,current_chapter_number)
{
	$.facebox('<div class="large_book" style="width:1000px;height:800px;"></div>');
	$('.large_book').flash({
		swf:'/design/SampleTemplate/widgets/Oxford/GraphicNovelWidget/swfs/'+ $('.GraphicNovels').attr('data-book-id')+'/Megazine/megazine.swf',
		width:1000,
		height:800,
		base:'/design/SampleTemplate/widgets/Oxford/GraphicNovelWidget/swfs/'+ $('.GraphicNovels').attr('data-book-id'),
		bgcolor:'#DCDCE1',
		flashvars: {
			page_number:current_page_number,
			chapter_number:current_chapter_number
		}
	});
}