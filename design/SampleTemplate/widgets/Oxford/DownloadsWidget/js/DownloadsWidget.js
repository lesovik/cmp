function bootstrap_downloads()
{
    $(function(){
           
        initDownloadsNav();
        $('.DownloadsWidget .DownloadsSceneSelection').live('change',function(){
            var update_content=$(this).parents('.TabContentHead').next();
            var data_zone=$(this).parents('.TabContentHead').next().children();


            $.get('/ajax_widget?page=book.html&widget=Downloads&functionName=getContent',{
                level_id:$(this).val(),
                book_id:data_zone.attr('data-book-id'),
                zone:data_zone.attr('data-zone')
                },function(data){
                update_content.html(data);
                check_hide_downloads_nav_buttons();
                InitTrigger();
                
            });
            var btnValue = $(this).find('option[selected]').attr('data-number');


        })
       
        InitTrigger();
    })

        
}

function InitTrigger(){
     $('.DownloadTrigger').live('click',function(){
            $(this).parents('.DownloadTriggerWrap').toggleClass('Open');
        })

}


function initDownloadsNav() {
    $('.DownloadsNextButton').click(function(e){
        e.preventDefault();

        var clicked_button=$(this);
        var new_page = $(this).attr('data-page');
        //swapSelectedOption(new_page);
        var btnValue = clicked_button.attr('data-page');

               
        var level= $('select.DownloadsSceneSelection option[data-number='+ new_page +']').attr('value');

        $.get('/ajax_widget?page=book.html&widget=Downloads&functionName=getContent',{
            level_id:level,
            book_id:$('.Downloads').attr('data-book-id'),
            zone:$('.Downloads').attr('data-zone')
        },function(data){
            clicked_button.parents('.TabContent').find('.TabContentBody').html(data);
            //alert('CHAPTER ID: '+ new_page);
            clicked_button.attr('data-page',btnValue*1+1);
            clicked_button.prev().prev().attr('data-page',btnValue*1-1);
            check_hide_downloads_nav_buttons();
        });
               
        swapDownloadsSelectedOption(new_page);

    })

    $('.DownloadsPreviousButton').click(function(e){
        e.preventDefault();

        var clicked_button=$(this);
                
        var new_page = $(this).attr('data-page');

        level = $('select.DownloadsSceneSelection option[data-number='+ new_page +']').attr('value');

        var btnValue = clicked_button.attr('data-page');
            
        $.get('/ajax_widget?page=book.html&widget=Downloads&functionName=getContent',{
            level_id:level,
            book_id:$('.Downloads').attr('data-book-id'),
            zone:$('.Downloads').attr('data-zone')
        },function(data){
            clicked_button.parents('.TabContent').find('.TabContentBody').html(data);

            clicked_button.attr('data-page',btnValue*1-1);
            clicked_button.next().next().attr('data-page',btnValue*1+1);
            check_hide_downloads_nav_buttons();
        });
        check_hide_downloads_nav_buttons();
        swapDownloadsSelectedOption(new_page);

    })
    check_hide_downloads_nav_buttons();
        
}
function swapDownloadsSelectedOption(new_page) {
    $('.DownloadsWidget .DownloadsSceneSelection option').each(function(){
        
        if($(this).attr('data-number')==new_page)  {
            $(this).attr('selected','selected');
        } else {
            $(this).attr('selected', false);
        }
    });
}
function check_hide_downloads_nav_buttons(){

    $('.DownloadsPreviousButton').each(function(){
        if ($(this).attr('data-page')*1<0) {
            $(this).hide();
        }else{
            $(this).show();
        }
    });
    $('.DownloadsNextButton').each(function(){
        if ($(this).attr('data-page')*1>=$(this).attr('data-max-page')*1) {
            $(this).hide();
        }else{
            $(this).show();
        }
    });
    $('.DownloadsSeperator').each(function(){
        if (!$(this).prev().is(':visible') || !$(this).next().is(':visible')) {
            $(this).hide();
        }else{
            $(this).show();
        }
    })

}