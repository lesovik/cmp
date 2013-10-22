var notebook_timeout;
function bootstrap_notebook()
{
    $(function(){

		$('.EntryFolder dt.Icon').live('click',function(){
			$(this).next().toggleClass('Toggled');
		})

        $('.EntryWrapper').live('mouseover',function(){
			if ($(this).closest('.NotebookWrapper').hasClass('StartedSort')) {
				return;
			}
            $(this).addClass('Hover').removeClass('NoHover');
			$(this).children('.control').addClass('Hover').removeClass('NoHover');
        })
        $('.EntryWrapper').live('mouseout',function(){
            $(this).removeClass('Hover').addClass('NoHover');
			$(this).children('.control').removeClass('Hover').addClass('NoHover');

        })
		
        $('.NotebookAddPage').live('click',function(){

            var tab_content=$(this).closest('.TabContentHead').next();
            $.post('/ajax_widget?page=book.html&widget=Notebook&functionName=addPage',{
                book_id:$(this).closest('.TabContent').attr('data-book-id'),
                zone:$(this).closest('.TabContent').attr('data-zone')
                },function(data){
                tab_content.html(data);
                var new_page_title=tab_content.children('.NotebookWrapper').attr('data-page-title');
                var new_page_id=tab_content.children('.NotebookWrapper').attr('data-current-page');
                var select_box=tab_content.prev().children('select');
                tab_content.prev().children('.NotebookRemovePageDisabled').show();

                select_box.append($("<option/>").
                    attr("value",new_page_id).
                    text(new_page_title).attr('selected','selected'));

				$.refreshNotebookToggles();
            });
        })

        $('.NotebookRemovePage').live('click',function(){
            if (confirm('Are you sure you want to delete this page?')) {
                var tab_head=$(this).closest('.TabContentHead');
                var tab_content=$(this).closest('.TabContentHead').next();
                var current_page=tab_content.children('.NotebookWrapper').attr('data-current-page');
                $.post('/ajax_widget?page=book.html&widget=Notebook&functionName=removePage',{
                    delete_page_id:current_page,
                    book_id:$(this).closest('.TabContent').attr('data-book-id'),
                    zone:$(this).closest('.TabContent').attr('data-zone')
                    },function(data){
                    //update select
                    var select_box=tab_head.children('select');
                    select_box.children('option[value='+current_page+']').remove();
                    select_box.children('option:first').attr('selected','selected');
                    if (select_box.children('option').length==0) {
                        tab_head.children('.NotebookRemovePage').addClass('NotebookRemovePageDisabled');
                    }

                    tab_content.html(data);

					$.refreshNotebookToggles();
                });

				
            }
        })
		
        $('.NotebookSplit').live('mouseover',function(){
            if (notebook_timeout) {
                clearTimeout(notebook_timeout);
            }
            var over_item=$(this);
            notebook_timeout=setTimeout(function(){
                //				if (over_item.closest('.NotebookWrapper').hasClass('ui-sortable')) {
                //					return;
                //				}
                if (over_item.hasClass('AddActive')) {
                    over_item.children(':last').stop(true,true).show();
                }else{
                    over_item.children(':first').stop(true,true).show();
                }

                over_item.addClass('Over');
            },50)
        });
        $('.NotebookSplit').live('mouseout',function(){
            if (notebook_timeout) {
                clearTimeout(notebook_timeout);
            }
            if (!$(this).hasClass('AddActive')) {
                $(this).removeClass('Over');
                $(this).children().stop(true,true).fadeOut('fast');
            }
        });
        $('.NotebookWrapper .EntryNote .edit,.NotebookWrapper .EntryTitle .edit').live('click',function(){
            $(this).parent().next().next().children().trigger('click');
        });

        $('.EntryWrapper .delete').live('click',function(){
            if (confirm('Are you sure you want to delete this item?')) {
                var entry_item=$(this).closest('.EntryWrapper');
                var item_id=entry_item.attr('data-entry-id');
                entry_item.fadeOut('fast',function(){$(this).remove();});
                $.post('/ajax_widget?page=book.html&widget=Notebook&functionName=deleteItem',{
                    item_id:item_id,
                    book_id:$(this).closest('.TabContent').attr('data-book-id'),
                    zone:$(this).closest('.TabContent').attr('data-zone')
                    },function(data){

                    });
            }
        })

        $('.NotebookWidget .TabContent select').change(function(){
            var page_id=$(this).val();
            var tab_content=$(this).closest('.TabContentHead').next();
            $.post('/ajax_widget?page=book.html&widget=Notebook&functionName=getContent',{
                page_id:page_id,
                book_id:$(this).closest('.TabContent').attr('data-book-id'),
                zone:$(this).closest('.TabContent').attr('data-zone')
                },function(data){
                tab_content.html(data);

				$.refreshNotebookToggles();
            });
        })
		
        $('.NotebookWrapper .EntryNote p, .NotebookWrapper .EntryTitle h1,.NotebookWrapper .NotesHead,.NotebookWrapper .FolderHead').live('click',function(){
            var item_id=$(this).closest('dd').attr('data-id');
            var entry_type=$(this).closest('.EntryWrapper').hasClass('EntryTitle')?'Title':'Note';
			var page_id;
			if ($(this).hasClass('NotesHead')) {
				entry_type='PageHeader';
			}
			page_id=$(this).attr('data-page-id');
			if ($(this).hasClass('FolderHead')) {
				entry_type='FolderHead';
			}
            if (!$(this).hasClass('editable')) {
                $(this).addClass('editable')

                $(this).editable('/ajax_widget?page=book.html&widget=Notebook&functionName=saveEntryText', {
                    name : 'newvalue',
                    submitdata : {
                        item_id:item_id,
                        type:entry_type,
						
						page_id:page_id,
                        book_id:$(this).closest('.TabContent').attr('data-book-id'),
                        zone:$(this).closest('.TabContent').attr('data-zone')
                    },
					type: entry_type=='Note'?'textarea':'text',
					height: entry_type=='Note'?220:(entry_type=='PageHeader'?29:15),
					submit  : entry_type=='Note'?'Save':null,
					cancel    : entry_type=='Note'?'Cancel':null,
					onblur: entry_type=='Note'?'ignore':'cancel',
					callback : function(value, settings) {
						$('.NotebookWidget .TabContentHead select option[value="'+page_id+'"]').text($('<div />').html(value).text());
						return value;
				   }

                });
                $(this).trigger('click.editable');
            }else{
                $(this).find('input:first').focus()
            }

			 
        })
		
        $('.NotebookTypes li').live('click',function(){
            $(this).toggleClass('Toggled');
            $.refreshNotebookToggles();
        })
        $('.NotebookSplit .SplitFull .CloseBtn').live('click',function(){
            $(this).parent().hide();
            $(this).parent().prev().show();
            $(this).closest('.NotebookSplit').removeClass('AddActive');
        })
        $('.NotebookSplit .SplitFull .NoteBtn,.NotebookSplit .SplitFull .TitleBtn,.NotebookSplit .SplitFull .FolderBtn').live('click',function(){
            var data_id=$(this).closest('.NotebookSplit').prev().attr('data-id');
            var page_id=$(this).closest('.NotebookSplit').prev().attr('data-page-id');
			var folder_id=$(this).closest('.NotebookSplit').prev().attr('data-folder-id');

            var entry_type=$(this).hasClass('NoteBtn')?'Note':'Title';
			if ($(this).hasClass('FolderBtn')) {
				entry_type='Folder';
			}

            var tab_content=$(this).closest('.TabContentBody');
            $.post('/ajax_widget?page=book.html&widget=Notebook&functionName=addEntry',{
                after_id:data_id,
                page_id:page_id,
				in_folder_id:folder_id,
                type:entry_type,
                book_id:$(this).closest('.TabContent').attr('data-book-id'),
                zone:$(this).closest('.TabContent').attr('data-zone')
                },function(data){
                tab_content.html(data);

				$.refreshNotebookToggles();
            });
        })
        $('.NotebookSplit .SplitAdd').live('click',function(){
            $('.NotebookSplit .SplitFull').fadeOut('fast').parent().removeClass('AddActive').removeClass('Over');

            $(this).hide();
            $(this).next().show();
            $(this).parent().addClass('AddActive');
        })
		$('.NotebookWrapper .EntryBookmark dt,.NotebookWrapper .EntryBookmark a,.NotebookWrapper .EntryQuote dt,.NotebookWrapper .EntryQuote a').live('click',function(e){
			e.preventDefault();
			updateDDs($(this).closest('dl').find('a').attr('data-bookmark-id'));

		})


		$.refreshNotebookToggles();
        
    //		$('.NotebookSort').live('click',function(){
    //			var list_of_items=$(this).next();
    //			if (list_of_items.hasClass('ui-sortable')) {
    //				var sort_data=list_of_items.sortable("toArray", {attribute: "data-entry-id",expression:'(.+)'});
    //				list_of_items.sortable('destroy');
    //				$.post('/ajax_widget?page=book.html&widget=Notebook&functionName=sortEntries',{book_id:$(this).closest('.TabContent').attr('data-book-id'),zone:$(this).closest('.TabContent').attr('data-zone'),entries:sort_data},function(data){
    //				});
    //			}else{
    //				list_of_items.sortable();
    //			}
    //		})
    })
}
