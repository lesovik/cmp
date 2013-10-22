/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function(){

    buildMultimediaAdminAccordion('.LibraryFoldersList','.CategoryName');
    buildMultimediaAdminAccordion('.MediaModuleWrapper','.CategoryName');
    buildMultimediaAdminAccordion('.AddMediaList','.ItemName');
});

function buildMultimediaAdminAccordion(main_tag, click_area) {
    main_tag = 'ul'+ main_tag;
    $(main_tag +' li '+ click_area).click(function() {
        //alert('!!!');
//        switch(main_tag) {
//            case 'AddMediaList': {
//                break;
//            }
//            default: {
//                $(this).parent().parent().toggleClass('Open');
//            }
//        }
        $(this).parent().parent().toggleClass('Open');
    })
	
}
