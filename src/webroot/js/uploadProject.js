// The procedure here in is adjusted from the plugin https://github.com/Abban/jQuery-Ajax-File-Upload
// available under MIT License
// description on: http://abandon.ie/notebook/simple-file-uploads-using-jquery-ajax

// Upload files on change of file selector
$('#project-fileupload').on('change', startProjectFileUpload);

/* globals FormData */
/**
 * Start upload of selected files to the server
 * @param {event} event
 * @returns {void}
 */
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
        url: WebRoot+'/ajax/upload/Projects?dbversion='+DbVersion,
        type: 'POST',
        data: data,
        cache: false,
        dataType: 'json',
        processData: false, // Don't process the files
        contentType: false, // Set content type to false as jQuery will tell the server its a query string request
        /* jshint unused:vars */
        success: function(data, textStatus, jqXHR)
        {
            var successfulUploads = 0;
            $.each(data.files, function(key, value){
                if(value.error !== null){
                    showMessageDialog("Error uploading "+value.name+": "+value.error, 'alert-danger');
                } else {
                    successfulUploads++;
                }
            });
            if(successfulUploads > 0){
                showMessageDialog(successfulUploads+" project"+(successfulUploads > 1 ? "s" : "")+" uploaded successfully", 'alert-success');
            }
            $('#project-table').DataTable({
                retrieve: true
            }).ajax.reload();
            $('#project-upload-busy-indicator').hide();
        },
        error: function(jqXHR, textStatus, errorThrown)
        {
            showMessageDialog("There was an error: "+textStatus, 'alert-danger');
            $('#project-upload-busy-indicator').hide();
        }
    });
}
