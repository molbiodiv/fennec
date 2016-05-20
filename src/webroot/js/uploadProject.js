// The procedure here in is adjusted from the plugin https://github.com/Abban/jQuery-Ajax-File-Upload
// available under MIT License
// description on: http://abandon.ie/notebook/simple-file-uploads-using-jquery-ajax

// Upload files on change of file selector
$('#project-fileupload').on('change', startProjectFileUpload);

// Grab the files and set them to our variable
function startProjectFileUpload(event)
{
    $('#project-upload-busy-indicator').show();
    var files = event.target.files;
    var data = new FormData();
    $.each(files, function(key, value)
    {
        data.append(key, value);
    });

    $.ajax({
        url: WebRoot+'/ajax/upload/Project?dbversion='+DbVersion,
        type: 'POST',
        data: data,
        cache: false,
        dataType: 'json',
        processData: false, // Don't process the files
        contentType: false, // Set content type to false as jQuery will tell the server its a query string request
        success: function(data, textStatus, jqXHR)
        {
            var successfulUploads = 0;
            $.each(data.files, function(key, value){
                if(value.error !== null){
                    showProjectUploadDialog("Error uploading "+value.name+": "+value.error, 'alert-danger');
                } else {
                    successfulUploads++;
                }
            });
            if(successfulUploads > 0){
                showProjectUploadDialog(successfulUploads+" project"+(successfulUploads > 1 ? "s" : "")+" uploaded successfully", 'alert-success');
            }
            $('#project-upload-busy-indicator').hide();
        },
        error: function(jqXHR, textStatus, errorThrown)
        {
            showProjectUploadDialog("There was an error: "+textStatus, 'alert-danger');
            $('#project-upload-busy-indicator').hide();
        }
    });
}

/**
 * This function appends a bootstrap dialog to the project message area with the given message and type
 * @param {type} message - The text that should be shown in the dialog
 * @param {type} type - The type (color) of the dialog. Possible values: alert-success, alert-warning, alert-danger, alert-info (default)
 * @returns {void}
 */
function showProjectUploadDialog(message, type){
    var knownTypes = ['alert-success', 'alert-warning', 'alert-danger', 'alert-info'];
    if(knownTypes.indexOf(type) === -1){
        type = 'alert-info';
    }
    var dialogTemplate = '<div class="alert <%= type %> alert-dismissable" role="alert" style="margin-top: 10px;">';
    dialogTemplate += '<button type="button" class="close" data-dismiss="alert" aria-label="Close">';
    dialogTemplate += '<span aria-hidden="true">&times;</span>';
    dialogTemplate += '</button>';
    dialogTemplate += '<%= message %>';
    dialogTemplate += '</div>';
    dialogTemplate = _.template(dialogTemplate);
    $('#project-upload-message-area').append(dialogTemplate({type: type, message: message}));
}