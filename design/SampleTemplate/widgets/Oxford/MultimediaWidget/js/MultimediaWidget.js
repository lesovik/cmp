function bootstrap_multimedia()
{
	$(function(){
            if(new_page != undefined){
                updateDDs(new_page);
            }
            initMultimediaNav();
		$.fn.extend({
			//tooltips
			refreshTileVideos:function(){
				$(this).each(function(){
					var small_preview=$(this).children('.small_preview');
					var player_width=small_preview.width()-10;
					
					switch ($(this).attr('data-type')) {
						case 'Audio':
							var player_height=16;
							var player_type='AUDIO';
							var player_file_path=$(this).attr('data-file');
							var player_color='#FFFFFF';
							var player_start=$(this).attr('data-start');
							var player_duration=$(this).attr('data-duration');
							break;
						case 'Video':
							var player_height=Math.round(player_width/1.77777);
							var player_type='VIDEO';
							var player_color='#000000';
							//var player_file_path='rtmp://69.90.78.228/fEThawR2c9Ak2kathEswuYusPAXEYuJe/videos/MBvidCOLpolanski2.flv';
							var player_file_path=$(this).attr('data-file');
							var player_start=$(this).attr('data-start');
							var player_duration=$(this).attr('data-duration');

							break;
					}
					switch ($(this).attr('data-type')) {
						case 'Audio':
						case 'Video':
							/*small_preview.flash({
								swf:'/design/SampleTemplate/widgets/Oxford/MultimediaWidget/swfs/player.swf',
								width:player_width,
								height:player_height,
								bgcolor:player_color,
								scale:'noscale',
								allowFullscreen:true,
								flashVars:{
									playerFilePath: player_file_path,
									playerType: player_type,
									playerWidth:player_width,
									playerHeight:player_height,
									playerAutoPlay:'false'
								}
							});*/
							small_preview.flash({
								swf:'/design/SampleTemplate/widgets/Oxford/MultimediaWidget/swfs/player2.swf',
								width:player_width,
								height:player_height,
								bgcolor:player_color,
								//scale:'exactfit',
								allowFullscreen:true,
								flashVars:{
									duration: player_duration,
									filepath: player_file_path,
									start:player_start,
									autoplay:0,
									debug:0
								}
							});
							break;
						default:
							small_preview.html($('<img />').attr('src',$(this).attr('data-file')))
					}
				});
			}
		});

		$('.Multimedia .Folder').live('click',function(){
			var update_content=$(this).parents('.Multimedia');
			$.get('/ajax_widget?page=book.html&widget=Multimedia&functionName=getFolderContents',{
                            folder_id:$(this).attr('data-folder-id'),
                            master_tocl:$(this).parents('.Multimedia').attr('data-scene-id'),
                            level_id:$(this).parents('.Multimedia').attr('data-scene-id'),
                            book_id:$(this).parents('.Multimedia').attr('data-book-id'),
                            zone:$(this).parents('.Multimedia').attr('data-zone')},
                        function(data){
				update_content.html(data);


				//bind the content
				update_content.find('.SimpleGalleryContainer').find('li:first').click();
				update_content.find('.TileContainer li').refreshTileVideos();
				update_content.find('.ListContainer li').refreshTileVideos();
                                check_hide_media_nav_buttons();
			});
		})

		$('.Multimedia .view_type li').live('click',function(){
			$(this).parent().children().removeClass('current');
			$(this).addClass('current');
			var folder_id=$(this).parents('.MultimediaContainer').attr('data-folder-id');
			var update_content=$(this).parents('.Multimedia');
			$.get('/ajax_widget?page=book.html&widget=Multimedia&functionName=getFolderContents',{display:$(this).attr('data-view-type'),folder_id:folder_id,level_id:$(this).parents('.Multimedia').attr('data-scene-id'),book_id:$(this).parents('.Multimedia').attr('data-book-id'),zone:$(this).parents('.Multimedia').attr('data-zone')},function(data){
				update_content.html(data);

				//bind the content

				if (update_content.data('item-id')) {
					update_content.find('.SimpleGalleryContainer').find('li[data-item-id="'+update_content.data('item-id')+'"]').click()
				}else{
					update_content.find('.SimpleGalleryContainer').find('li:first').click();
				}
				update_content.find('.TileContainer li').refreshTileVideos();
				update_content.find('.ListContainer li').refreshTileVideos();
                                check_hide_media_nav_buttons();
			});
		})

		$('.MultimediaWidget .MultimediaSceneSelection').live('change',function(){
			var update_content=$(this).parents('.TabContentHead').next();
			var data_zone=$(this).parents('.TabContentHead').next().children();

/*
			$.get('/ajax_widget?page=book.html&widget=Multimedia&functionName=getContent',{level_id:$(this).val(),book_id:data_zone.attr('data-book-id'),zone:data_zone.attr('data-zone')},function(data){
				update_content.html(data);
                                check_hide_media_nav_buttons();
			});*/
                        var btnValue = $(this).find('option[selected]').attr('data-number');
                        updateDDs(btnValue);
                        //alert('NEW btnValue: '+ btnValue);
                        
		})


		$('.Multimedia .ListContainer .small_preview img,.Multimedia .LeftColumn .SimpleGalleryContainer .large_preview img,.Multimedia .TileContainer .small_preview img,.Multimedia .RightColumn .SimpleGalleryContainer .large_preview img').live('click',function(){
			$(this).parents('.Multimedia').data('item-id',$(this).attr('data-item-id'));
			$(this).parents('.Multimedia').data('item-id',$(this).closest('li').attr('data-item-id'));
			$('.Multimedia .view_type li[data-view-type="slides"]').click();
			//large_preview
			//'item-id'
		});
		$('.Multimedia .SimpleGalleryContainer li').live('click',function(){
			$(this).parent().children().removeClass('current');
			$(this).addClass('current');

			var large_preview=$(this).parents('.SimpleGalleryContainer').children('.large_preview');

			var player_width=large_preview.width()-10;
			
			switch ($(this).attr('data-type')) {
				case 'Audio':
					var player_height=16;
					var player_type='AUDIO';
					var player_file_path=$(this).attr('data-file');
					var player_color='#FFFFFF';
					var player_start=$(this).attr('data-start');
					var player_duration=$(this).attr('data-duration');
					break;
				case 'Video':
					var player_height=Math.round(player_width/1.77777);
					var player_type='VIDEO';
					var player_color='#000000';
					//var player_file_path='rtmp://69.90.78.228/fEThawR2c9Ak2kathEswuYusPAXEYuJe/videos/MBvidCOLpolanski2.flv';
					var player_file_path=$(this).attr('data-file');
					var player_start=$(this).attr('data-start');
					var player_duration=$(this).attr('data-duration');
					break;
			}
			var bookmark_item=$(this).parents('.SimpleGalleryContainer').children('.ContentPlaceholder').children('.Bookmark');
			var bookmark_btn=$(this).children('.bookmarkBtn');
			bookmark_item.html(bookmark_btn.html()).attr('data-note-data1',bookmark_btn.attr('data-note-data1')).attr('data-note-data2',bookmark_btn.attr('data-note-data2')).attr('data-note-type',bookmark_btn.attr('data-note-type')).addClass('bookmarkBtn');

			$(this).parents('.Multimedia').data('item-id',$(this).attr('data-item-id'));
			$(this).parents('.SimpleGalleryContainer').children('.ContentPlaceholder').children('.Header').html($(this).children('.title').html())
			$(this).parents('.SimpleGalleryContainer').children('.ContentPlaceholder').children('.Content').html($(this).children('.description').html())
			$(this).parents('.SimpleGalleryContainer').children('.ContentPlaceholder').children('.Credits').html($(this).children('.CreditLine').html())
			//$(this).parents('.SimpleGalleryContainer').children('.ContentPlaceholder').children('.Licensor').html($(this).children('.Licensor').html())

			switch ($(this).attr('data-type')) {
				case 'Audio':
				case 'Video':
					/*large_preview.flash({
						swf:'/design/SampleTemplate/widgets/Oxford/MultimediaWidget/swfs/player.swf',
						width:player_width,
						height:player_height,
						bgcolor:player_color,
						scale:'noscale',
						allowFullscreen:true,
						flashVars:{
							playerFilePath: player_file_path,
							playerType: player_type,
							playerWidth:player_width,
							playerHeight:player_height,
							playerAutoPlay:'false'
						}
					});*/
						large_preview.flash({
							swf:'/design/SampleTemplate/widgets/Oxford/MultimediaWidget/swfs/player2.swf',
							width:player_width,
							height:player_height,
							bgcolor:player_color,
							//scale:'exactfit',
							allowFullscreen:true,
							flashVars:{
								duration: player_duration,
								filepath: player_file_path,
								start:player_start,
								autoplay:0,
								debug:0
							}
						});
					break;
				default:
					large_preview.html($('<img />').attr('src',$(this).attr('data-file')))
			}


		})

		//by type

	})

        
}

function initGoBack() {
    $('.GoBack').click(function(e){
        e.preventDefault();
        
        var clicked_button=$(this);
        var tocl_id= $('select.MasterSceneSelection').find('option[selected]').attr('value');
        /*
        alert('level_id:'+$('.Multimedia').attr('data-scene-id')+'\n'+
              'book_id:'+$('.Multimedia').attr('data-book-id')+'\n'+
              'zone:'+ $('.Multimedia').attr('data-zone'));
        */
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

    })
}

function swapSelectedOption(new_page) {
    $('.MultimediaWidget .MultimediaSceneSelection option').each(function(){
       if($(this).attr('data-number')==new_page)  {
           $(this).attr('seleceted','seleceted');
       } else {
           $(this).attr('selected', false);
       }
    });
}

function initMultimediaNav() {
    $('.multimediaNextButton').click(function(e){
		e.preventDefault();

		var clicked_button=$(this);
                var new_page = $(this).attr('data-page');
                //swapSelectedOption(new_page);
                var btnValue = clicked_button.attr('data-page');
                updateDDs(btnValue);
                /*
                new_page = $('select.MultimediaSceneSelection option[data-number='+ new_page +']').attr('value');

		$.get('/ajax_widget?page=book.html&widget=Multimedia&functionName=getContent',{
                  level_id:new_page,
                  book_id:$('.Multimedia').attr('data-book-id'),
                  zone:$('.Multimedia').attr('data-zone')
                },function(data){
			clicked_button.parents('.TabContent').find('.TabContentBody').html(data);
                        //alert('CHAPTER ID: '+ new_page);
			clicked_button.attr('data-page',btnValue*1+1);
			clicked_button.prev().prev().attr('data-page',btnValue*1-1);
                        check_hide_media_nav_buttons();
		});
*/
	})

	$('.multimediaPreviousButton').click(function(e){
		e.preventDefault();

		var clicked_button=$(this);
                
                var new_page = $(this).attr('data-page');
                //swapSelectedOption(new_page);
                new_page = $('select.MultimediaSceneSelection option[data-number='+ new_page +']').attr('value');

                var btnValue = clicked_button.attr('data-page');
                updateDDs(btnValue);
                /*
		$.get('/ajax_widget?page=book.html&widget=Multimedia&functionName=getContent',{
                  level_id:new_page,
                  book_id:$('.Multimedia').attr('data-book-id'),
                  zone:$('.Multimedia').attr('data-zone')
                },function(data){
			clicked_button.parents('.TabContent').find('.TabContentBody').html(data);

			clicked_button.attr('data-page',btnValue*1-1);
			clicked_button.next().next().attr('data-page',btnValue*1+1);
                        check_hide_media_nav_buttons();
		});
*/
	})
        check_hide_media_nav_buttons();
}
function check_hide_media_nav_buttons()
{
    initGoBack();
	$('.multimediaPreviousButton').each(function(){
		if ($(this).attr('data-page')*1<0) {
			$(this).hide();
		}else{
			$(this).show();
		}
	});
	$('.multimediaNextButton').each(function(){
		if ($(this).attr('data-page')*1>=$(this).attr('data-max-page')*1) {
			$(this).hide();
		}else{
			$(this).show();
		}
	});
	$('.multimediaSeperator').each(function(){
		if (!$(this).prev().is(':visible') || !$(this).next().is(':visible')) {
			$(this).hide();
		}else{
			$(this).show();
		}
	})

}