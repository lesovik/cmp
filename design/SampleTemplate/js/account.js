
$(function(){

    initFieldDivs();
    activateContentAreaButtons();
    
    if($('#slider').length > 0){
        $('#slider').nivoSlider({effect:'random', slices:13, pauseTime:5000,controlNav:false});
    }
    
});

function initFieldDivs() {
    $('.FieldDiv.HoverValue input').focus(function(){
        if($(this).val()==$(this).attr('data-default-value')){
            $(this).val('');
        }
        if($(this).hasClass('invalid')) {
            $(this).removeClass('invalid');
        }
    })
    $('.FieldDiv.HoverValue input').blur(function(){
        if($(this).val()==''){
            $(this).val($(this).attr('data-default-value'));
        }
    })
}

function initHelpSubmit(){
    $('#FieldDivButton_form_submit_help').click(function(e){
        e.preventDefault();
        $.post('/ajax_widget?page=my_account.html&widget=AccountContentWidget&functionName=AjaxHelpForm&zone=OxfordhelpZone'
                , $("#facebox form").serialize(), function(data){
                   $.facebox(data);
                   initHelpSubmit();
                })

    });
}
function initUserEditSubmit(){
     
    $('#FieldDivButton_submit').closest('form').submit(function(e){
        e.preventDefault();
        $.post('/ajax_widget?zone=BottomLeftZone&page=admin&widget=AccountContentWidget&functionName=AjaxContent&dataFunctionName=SaveInformation'
                , $("#facebox form").serialize(), function(data){
                    if (!data) {
                        $.facebox.close()
                    }else{
                        alert(data);
                    }
                })

    });
}
function activateContentAreaButtons(){
    $('.ContentAreaButton').click(function(){

        functionName=$(this).attr('data-function-name');
        page=$(this).attr('data-page');
        zone=$(this).attr('data-zone');
        extraData=$(this).attr('data-extra-data');
        contentArea=$(this).parents('body').find('.PageContentSwapper');
        contentArea.find('.PageContentLoader').remove();
        padding=Math.floor(contentArea.height()/2)-30;
        height=contentArea.height()-padding;
        loader="<div class='PageContentLoader Loading' style='height:"
        + height +"px;padding-top:"
        + padding +"px;width:" + contentArea.width() +"px'>"+$(this).attr('data-loader-text')+"</div>";
        contentArea.prepend(loader);

        $.get('/ajax_widget?zone=' + zone + '&page=admin&widget=AccountContentWidget&functionName=AjaxContent',{
            dataFunctionName:functionName,
            extraData:extraData
        },function(data){
            loaderDiv=contentArea.find('.PageContentLoader');
//            loaderDiv.removeClass('Loading')
//            loaderDiv.attr('style','height:'
//                + contentArea.height() +"px;padding-top:0px;width:" + contentArea.width() +'px');
            loaderDiv.remove();
            $.facebox(data);


            // Added to preform area specific JS actions
            switch(functionName) {
                case 'AjaxForgotPassword': {
                    initFieldDivs();
                    initRetrievePassword();
                }
                case 'AjaxHelpForm': {
                    initHelpSubmit();
                }
                case 'AjaxCreateAccount':
                case 'AjaxEditAccount':
                    {
                    initUserEditSubmit();
                }
            }
        })
    });

    function initRetrievePassword() {
        $('.PasswordRecoveryWindow .LaunchBtn').click(function(){

            var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            var address = $('.PasswordRecoveryWindow input[name=email]').val();

            if(reg.test(address) == false) {
                $('.PasswordRecoveryWindow input[name=email]').addClass('invalid');
                alert('invalid email: '+address);
            }else {
                //alert('clean pass');
                $.get('/ajax_widget?widget=AccountContentWidget&functionName=recoverPassword',{
                    zone:'OxfordLoginZone',
                    page:'index.html',
                    email:address
                },function(data){
                    $('.PasswordRecoveryWindow').html(data);
                })
            }

        })
    }
}
