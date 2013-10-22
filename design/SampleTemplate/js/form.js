var nav_data;
$(function(){
    if ($.cookie('nav_data')) {
        nav_data=$.evalJSON($.cookie('nav_data'));
    }
    if (!nav_data) {
        nav_data=[];
    }
    // Datepicker
    $('.FieldDiv.Timestamp input').datepicker({
        inline: true,
        dateFormat: 'yy-mm-dd'
    });

    //library
    $('.PlayscriptSelection').change(function(){
        window.location.href='/admin?obj='+$(this).attr('data-obj')+'&action='+$(this).attr('data-action')+'&id='+$(this).val();
    })
    $('.MediaPlayscriptSelection').change(function(){
        if ($(this).val()) {
            window.location.href='/admin?obj='+$(this).attr('data-obj')+'&action='+$(this).attr('data-action')+'&id='+$(this).attr('data-id')+'&tocl_id='+$(this).val();
        }
    })
    $('.DownloadsSelection').change(function(){
        if ($(this).val()) {
            window.location.href='/admin?obj='+$(this).attr('data-obj')+'&action='+$(this).attr('data-action')+'&id='+$(this).attr('data-id')+'&tocl_id='+$(this).val();
        }
    })

    $('.Special_Check_Under').live('click',function(){
		
        if ($(this).is(':checked')) {
			
            $(this).parent().parent().find('input').attr('checked','checked')
        }else{
            $(this).parent().parent().find('input').removeAttr('checked');
        }
    })
        

    $('.LibraryFolderWrapper .add_subfolderLi a,.LibraryFolder_New').click(function(e){
        e.preventDefault();
        $.post(window.location.href,{
            sub_action:'add_subfolder',
            parent_id:$(this).parents('.folder_row').attr('data-parent-id')
            },function(data){
            $.facebox(data);
            $('.AddSubfolder').ajaxForm({
                success:function(data){
                    window.location.reload();
                }
            })
        });
    });

$('.DeleteRelMediaItem').click(function(e) {
    e.preventDefault();
    var item_to_remove=$(this);
    $.post(window.location.href,{
        sub_action:'delete_related',
        data_media_id:$(this).attr('data-media-id'),
        data_library_id:$(this).attr('data-library-id')
        },function(){
        item_to_remove.parent().parent().fadeOut();
    })
});
$('.DuplicateRow').live('click',function(){
	$(this).closest('li').clone().insertAfter($(this).closest('li'));
})
$('.RemoveRow').live('click',function(){
	$(this).closest('li').remove();
})

$('.AddMoreMedia').click(function(e) {
    e.preventDefault();

    $.post(window.location.href,{
        sub_action:'get_media_form',
        media_item_id:$(this).find('a').attr('data-media-item-id')
        },function(data){
        $.facebox(data);
        buildMultimediaAdminAccordion('.AddMediaList','.ItemName');
		
        $('.AddMediaForm').ajaxForm({
            success:function(data){
                window.location.reload();

            }
        })
    })
});
$('.AddFile').click(function(e) {
    e.preventDefault();
    var clicked_btn=$(this);

                
    $.post(window.location.href,{
        sub_action:'get_file_form',
        item_id:clicked_btn.find('a').attr('data-item-id')
        },function(data){
        $.facebox(data);
                        
        $('.SaveAddFile').live('click',function(e){
            e.preventDefault();
            
            $('.AddFileForm').ajaxSubmit({iframe:1,url:'/admin/?obj=OxBookModuleDownloadsItemFile&action=create',success:function(data){
                    //window.location.reload();
                    alert('ku');

            }});
            
        })
                      
    //			$('.AddFileForm').ajaxForm({success:function(data){
    //				window.location.reload();
    //
    //			}})
    })
});


$.fn.extend({
    //tooltips
    basicEditor:function(){
        return this.each(function(){
            if (!$(this).hasClass('hasEditor')) {
                $(this).addClass('hasEditor');

                var instance = CKEDITOR.instances[$(this).attr('id')];
                if(instance)
                {
                    CKEDITOR.remove(instance);
                }

                 
                CKEDITOR.replace( $(this).attr('id'), {
                    //filebrowserBrowseUrl : '/browser/browse.php',
                    //filebrowserImageBrowseUrl : '/browser/browse.php?type=Images',
                    filebrowserUploadUrl : '/ajax',
                    filebrowserImageUploadUrl : '/ajax?type=Images',

                    height:230,
					forcePasteAsPlainText:true,
                    toolbar :
                    [
                    [ 'Bold', 'Italic', '-','JustifyLeft','JustifyCenter','JustifyRight', '-', 'NumberedList', 'BulletedList', '-', 'Link', 'Unlink','Superscript','Image' ],
                    [ 'Source' ]
                    ]
                });
            }
        });
    }
});

//handle files
$('.right_controls .remove_file').live('click',function(e){
    e.preventDefault();
    var file_to_hide=$(this);
    $.post($(this).attr('data-remove-path'),{
        delete_file:$(this).attr('data-remove-file')
        },function(){
        file_to_hide.parent().fadeOut();
    })
});

$('.FieldDiv.Clob textarea.has_editor').basicEditor();

if($('#CKEditorOne').length){
    CKEDITOR.replace( 'CKEditorOne',
    {
        height:550,
        hidden_id_value:$('#book_id_value').val(),
        toolbar :
        [

        ['InsertNumber1Start','InsertNumber2Start','InsertNumber3Start','-','InsertNumber1End','InsertNumber2End','InsertNumber3End','-','Source']
        ],
        on :
        {
            instanceReady : function( ev )
            {
                var tags = ['p', 'ol', 'ul', 'li','div']; // etc.

                for (var key in tags) {
                    ev.editor.dataProcessor.writer.setRules(tags[key],
                    {
                        indent : false,
                        breakBeforeOpen : false,
                        breakAfterOpen : false,
                        breakBeforeClose : false,
                        breakAfterClose : false
                    });
                }
            }
        }

    });
}


if($('#CKEditorTwo').length){
    CKEDITOR.replace( 'CKEditorTwo',
    {
        height:550,
        toolbar :
        [

        ['InsertLineNumber','InsertCharacterStart','InsertCharacterStartSample','InsertExit','InsertContinue','InsertChorus','-', 'InsertCharacter','InsertStage','-','Source']
        ],
        on :
        {
            instanceReady : function( ev )
            {
                var tags = ['p', 'ol', 'ul', 'li','div']; // etc.

                for (var key in tags) {
                    ev.editor.dataProcessor.writer.setRules(tags[key],
                    {
                        indent : false,
                        breakBeforeOpen : false,
                        breakAfterOpen : false,
                        breakBeforeClose : false,
                        breakAfterClose : false
                    });
                }
            }
        }

    });
}

// Hide all lists except the outermost.
$('.CoreBaseMenuWidget ul ul').hide();
$('.CoreBaseMenuWidget li > ul').each(function(i) {
    // Find this list's parent list item.
    var parent_li = $(this).parent('li');

    //$.cookie('nav_data',$.toJSON(nav_data));

    // Style the list item as folder.
    parent_li.addClass('folder');

    // Temporarily remove the list from the
    // parent list item, wrap the remaining
    // text in an anchor, then reattach it.
    var sub_ul = $(this).remove();
    var rel_try;

    //show items
    rel_try=parent_li.attr('rel');
    $.each(nav_data,function(index,value) {
        if (value==rel_try) {
            sub_ul.show();
            parent_li.addClass('open');
        }
    });

    parent_li.wrapInner('<a/>').find('a').click(function() {
        // Make the anchor toggle the leaf display.
        parent_li.toggleClass('open');
        if (!sub_ul.toggle().is(':visible')) {
            nav_data=jQuery.grep(nav_data, function(value) {
                return value != rel_try;
            });
        }else{
            if ($.inArray(rel_try,nav_data)<0) {
                nav_data.push(rel_try);
            }
        }
        $.cookie('nav_data',$.trim($.toJSON(nav_data)));
    });
    parent_li.append(sub_ul);
});



});