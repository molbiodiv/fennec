// This is the underscore.js template, compiled once and called from showMessageDialog later
var dialogTemplate = '<div class="alert <%= type %> alert-dismissable" role="alert" style="margin-top: 10px;">';
dialogTemplate += '<button type="button" class="close" data-dismiss="alert" aria-label="Close">';
dialogTemplate += '<span aria-hidden="true">&times;</span>';
dialogTemplate += '</button>';
dialogTemplate += '<%= message %>';
dialogTemplate += '</div>';
dialogTemplate = _.template(dialogTemplate);

/**
 * This function appends a bootstrap dialog to the message area with the given message and type
 * @param {type} message - The text that should be shown in the dialog
 * @param {type} type - The type (color) of the dialog. Possible values: alert-success, alert-warning, alert-danger, alert-info (default)
 * @returns {void}
 */
function showMessageDialog(message, type){
    var knownTypes = ['alert-success', 'alert-warning', 'alert-danger', 'alert-info'];
    if(knownTypes.indexOf(type) === -1){
        var shortTypes = ['success', 'warning', 'danger', 'info'];
        if(shortTypes.indexOf(type) === -1){
            type = 'alert-info';
        } else {
            type = "alert-" + type;
        }
    }
    $('#global-message-area').append(dialogTemplate({type: type, message: message}));
}