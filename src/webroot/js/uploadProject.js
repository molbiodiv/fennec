// The procedure here in is adjusted from the plugin https://github.com/Abban/jQuery-Ajax-File-Upload
// available under MIT License
// description on: http://abandon.ie/notebook/simple-file-uploads-using-jquery-ajax

// Upload files on change of file selector
$('#project-fileupload').on('change', startProjectFileUpload);

// Grab the files and set them to our variable
function startProjectFileUpload(event)
{
    // START LOADING SPINNER
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
            console.log(data);
            // STOP LOADING SPINNER
        },
        error: function(jqXHR, textStatus, errorThrown)
        {
            // Handle errors here
            console.log('ERRORS: ' + textStatus);
            // STOP LOADING SPINNER
        }
    });
}
