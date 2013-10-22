var old_def;
function bootstrap_glossary_guide()
{
	$(function(){
		$('.GlossaryFilterList input').click(function(){
		   refresh_glossary_list();
		})
		$('.GlossarySearch form').submit(function(){
			var glossary=$(this).parents('.GlossaryWidget');
			var glossary_container=glossary.find('.Glossary');
                        $('.glossaryAlphabet a').attr('class','');
			$.get('/ajax_widget?page=book.html&widget=Glossary&functionName=getByLetter',{search:$(this).find('input[name="glossary_search_term"]').val(),book_id:glossary_container.attr('data-book-id'),zone:glossary_container.attr('data-zone')},function(data) {
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
				$.get('/ajax_widget?page=book.html&widget=Glossary&functionName=getByLetter',{letter:$(this).attr('rel'),book_id:glossary_container.attr('data-book-id'),zone:glossary_container.attr('data-zone')},function(data) {
					refresh_glossary(data,glossary_container);
				});



			})
		});
	})
}
function refresh_glossary(data,glossary_container)
{
    glossary_container.find('.WidgetContent').html(data);

	 glossary_container.children('.WidgetContent').find('span').attachTooltip();
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
          var checkboxes=$(this).parents('.Glossary').find('.container-list').children('span[data-term-type-id="'+$(this).val()+'"]');
            if (!$(this).is(':checked')) {
                checkboxes.hide();
            }else{
                checkboxes.show();
            }
     });
}