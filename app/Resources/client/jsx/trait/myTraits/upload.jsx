$('document').ready(function () {
    // The procedure here in is adjusted from the plugin https://github.com/Abban/jQuery-Ajax-File-Upload
    // available under MIT License
    // description on: http://abandon.ie/notebook/simple-file-uploads-using-jquery-ajax

    // Upload files on change of file selector
    var currentFile;
    $('#trait-fileupload').on('change', function (e) {
        currentFile = e.target.files[0];
        $('#trait-upload-filename').text(currentFile.name);
    });
    $('#trait-upload-submit-button').on('click', startTraitFileUpload);

    /* globals FormData */
    /**
     * Start upload of selected file to the server
     * @returns {void}
     */
    function startTraitFileUpload()
    {
        $('#trait-upload-busy-indicator').show();
        var data = new FormData();
        data.append(0, currentFile);
        data.append('traitType', $('#trait-upload-traitType').val());
        data.append('defaultCitation', $('#trait-upload-defaultCitation').val());
        let mapping = $('#trait-upload-mapping').val();
        if(mapping != 'none'){
            data.append('mapping', mapping);
        }
        data.append('skipUnmapped', $('#trait-upload-skipUnmapped').prop( "checked" ));
        var url = Routing.generate('api_upload_traits', { 'dbversion': dbversion });
        $.ajax({
            url: url,
            type: 'POST',
            data: data,
            cache: false,
            dataType: 'json',
            processData: false, // Don't process the files
            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            /* jshint unused:vars */
            success: function(data, textStatus, jqXHR)
            {
                let imported = data["result"]["Imported entries"];
                let skipped = parseInt(data["result"]["Skipped (no hit)"]) + parseInt(data["result"]["Skipped (multiple hits)"]);
                showMessageDialog("Imported: "+imported+"\nSkipped: "+skipped, 'alert-success')
                // $('#project-table').DataTable({
                //     retrieve: true
                // }).ajax.reload();
                $('#trait-upload-busy-indicator').hide();
            },
            error: function(jqXHR, textStatus, errorThrown)
            {
                showMessageDialog("There was an error: "+errorThrown+"\n"+jqXHR.responseText, 'alert-danger');
                $('#project-upload-busy-indicator').hide();
            }
        });
    }

    $.ajax({
        url: Routing.generate('api_listing_traits', {'dbversion': dbversion, 'limit': 500, 'search': ''}),
        dataType: "json",
        success: function (data) {
            let allTraitTypes = data.map(x => x.type);
            $("#trait-upload-traitType").autocomplete({
                source: allTraitTypes
            });
        }
    });

    let methods = {none: "no mapping", ncbi_taxonomy: "NCBI taxid", scientific_name: "Scientific name", iucn_redlist: "IUCN id", EOL: "EOL id"};
    $.each(methods, (key, value) => {
        addOptionToSelectpicker(key, value, 'trait-upload-mapping');
    })

    $('.selectpicker').selectpicker('refresh')
    function addOptionToSelectpicker(value, text, id) {
        let option = $('<option>').prop('value', value).text(text)
        $('#'+id).append(option)
    }
});
