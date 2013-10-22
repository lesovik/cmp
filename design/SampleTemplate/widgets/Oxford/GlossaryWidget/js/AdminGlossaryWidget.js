var old_def;

$(function(){
	$('.GlossaryFilterList input').click(function(){
	   refresh_glossary_list();
	})
	$('.GlossarySearch form').submit(function(){
		var glossary=$(this).parents('.GlossaryWidget');
		var glossary_container=glossary.find('.Glossary');
					$('.glossaryAlphabet a').attr('class','');
		$.get('/ajax_widget?page=book.html&widget=Glossary&functionName=getByLetter',{search:$(this).find('input[name="glossary_search_term"]').val(),book_id:glossary_container.attr('data-book-id'),zone:'BookLeftZone'},function(data) {
			refresh_glossary(data,glossary_container);
		});
		return false;
	})
	$('.GlossaryWidget').each(function(){
		var glossary=$(this);
		var glossary_container=glossary.find('.Glossary');
		glossary.find('.GlossaryFilterList input').attr('checked', true);
		glossary.find('.glossaryAlphabet a').click(function(e){
			e.preventDefault();
							$('.GlossarySearch form').find('input[name="glossary_search_term"]').val('');
			$('.glossaryAlphabet a').attr('class','');
			$(this).attr('class', 'currentLetter');
			$.post(window.location.href,{letter:$(this).attr('rel'),sub_action:"show_glossary"},function(data) {
				refresh_glossary(data,glossary_container);
			});



		})
	});

	$('.GlossaryCheckAll').live('click',function(e){
		e.preventDefault();

		$(this).parents('form').children('.container-list').find('input').attr('checked','checked');
	})

	$('.GlossaryAdminForm').live('submit',function(e) {
		var letter_value=$(this).attr('data-letter');
		var book_module_glossary_id=$(this).attr('data-book-module-glossary-id')
		$('.GlossaryAdminForm').ajaxSubmit({data:{sub_action:'save_glossary',letter:letter_value,book_module_glossary_id:book_module_glossary_id}});
		return false;
	})
})
function refresh_glossary(data,glossary_container)
{
    glossary_container.find('.WidgetContent').html(data);

	 glossary_container.children('.WidgetContent').find('span.GlossaryListTermItemName').attachTooltip();
/*
     glossary_container.find('span').tooltip({
        bodyHandler: function() {
                if ($(this).hasClass('turned_off')) {
                        $('#tooltip').addClass('off');
                        return '';
                }else{
                        $('#tooltip').removeClass('off');
                }

                    if (old_def) {
                            old_def.abort();
                    }
                    old_def=$.get('/ajax_widget?page=book.html&widget=Playscript&functionName=getPopup',{id:$(this).attr('data-term-id'),text:$(this).text(),book_id:$('.Glossary').attr('data-book-id'),zone:$('.Glossary').attr('data-zone')},function(data){
                            $('#tooltip').removeClass('loading');
                            //has_definition[tooltip_id]=data;
                            $('#tooltip div.body').html(data);
                    });
                $('#tooltip').addClass('loading');
                return '<img src="/design/SampleTemplate/images/loader-tooltip.gif" alt="" /> Loading definition...';
        },
        showURL: false
    */
    refresh_glossary_list();
}
function refresh_glossary_list()
{
	
     $('.GlossaryFilterList input').each(function(){
          var checkboxes=$(this).parents('.Glossary').find('.container-list').find('span[data-term-type-id="'+$(this).val()+'"]');
            if (!$(this).is(':checked')) {
                checkboxes.parent().hide();
            }else{
                checkboxes.parent().show();
            }
     });
}