/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function(){

  sortDownloads();
});

function sortDownloads(){

    var answer_content=$('.DownloadsWrapper').sortable({
        cursor: 'move',
        items: '.MediaItem',
        handle: '.SortArrow',
        delay: 50,
        revert: false ,
        scroll: false,
        smooth: false,
        opacity: 0.6,
        axis:'y'
    }).bind('sortstart', function(event, ui) {

        }).bind('sortreceive', function(event, ui) {


        }).bind('sortstop', function(event, ui) {
        main=''
        $('.DownloadsWrapper').find('.MediaItem').each(function(){
           
                main=main+$(this).attr('data-item-id')+',';
            

        });


        //
        $.post('/ajax_widget?zone=RightAdminZone&page=admin&widget=Downloads&functionName='
            + 'AjaxSortItems'


            ,{str:main},function(data){


            })

    });
}