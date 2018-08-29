var debug = true;
var onlyfirsterror = true;
function waitingSubmit(button)
{
    button.attr('disabled','disabled');
    if(button.data('waiting') && button.data('text'))
        button.html('<i class="fa fa-spinner fa-spin"></i> '+ button.data('waiting'));
    else
        button.html('<i class="fa fa-spinner fa-spin"></i> '+button.text());
}

function restoreButton(button)
{
    button.prop('disabled',false);

    if(button.data('waiting') && button.data('text'))
        button.html(button.data('text'));
    else
        button.find('i').first().remove();
}

function validateForm(event,ajaxSave,ajaxError,withIndex=false){
    let button = $(event.target);
    event.preventDefault();
    button.closest('form').ajaxSubmit({
        dataType: 'json',
        success: data => { ajaxSave(data); },
        error: data => { ajaxError(data.responseJSON, withIndex); }

    });
}

function destroyRow(event, route){
    $.post(route,{
       _token: $('[name="csrf-token"]').prop('content'),
        _method: 'DELETE'
    }).done(function () {
        $(event.target).closest('tr').remove();
    }).fail(function (error) {
        if(debug) console.log(error);
    });
}

//RESPONSES
function routeResponse(data){
    window.location.replace(data.route);
}


//SHOW ERRORS
function showBootstrapErrors(data, withIndex=false)
{
    $('.help-block').remove();
    $('.has-error').removeClass('has-error');

    $.each(data.errors,function(name, error){
        if(debug)console.log(name);
        var selector = "[name='" + name + "']";
        if(name.split('.').length > 1 && withIndex)
            selector = getArraySelector(name);
        if($(selector).length == 0)
            selector ="[name='" + name.replace(/\.(.*)/,'') + "[]']";
        if(debug)console.log(selector);
        $(selector).closest('.form-group:not(.has-error)').addClass('has-error')
            .append($('<small class="help-block text-danger">'+ error[0] + '</small>'));
        $('.has-error').first().find('input , select').first().focus();
    });
}

function showTechTransferTemplateErrors(data){
    $('.help-block').remove();
    $('.has-error').removeClass('has-error');
    $.each(data.errors,function(name, error){
        if(debug)console.log(name);
        var selector = "[name='" + name + "']";
        var selector_array = name.split('.');
        if(selector_array.length > 1)
            selector = getArraySelector(name, selector_array[1]);

        console.log(selector)
        if($(selector).length == 0)
            selector ="[name='" + name.replace(/\.(.*)/,'') + "[]']";
        if(debug)console.log(selector);

        $(selector).closest('.form-group:not(.has-error)').addClass('has-error')
            .append($('<small class="help-block text-danger">'+ error[0] + '</small>'));
        $('.has-error').first().find('input , select').first().focus();
    });
}

function getArraySelector(name, index) {
    name = name.replace(/\.(.*)/,'') +"[]";
    return "[name*='" + name + "']:eq("+index+")";
}

(function ( $ ) {

    let default_options = {
        show_errors: showBootstrapErrors,
        response: routeResponse,
        array_inputs: []
    };
    $.fn.alv = function (options) {

        options_merged = {};
        $.extend(options_merged, default_options, options);
        let button = this.find('[type="submit"]');
        button.on('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
             validateForm(event,options_merged.response,options_merged.show_errors)
        });
    };

}( jQuery ));