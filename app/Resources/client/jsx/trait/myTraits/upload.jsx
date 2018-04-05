$('document').ready(function () {
    let dbversion = $('#globals').data('dbversion');

    $('#project-table').DataTable( {
        ajax: {
            method: 'POST',
            url: Routing.generate('api_listing_projects', {'dbversion': dbversion}),
            dataSrc: 'data',
            complete: function(){
                addProjectTableActionButtonFunctionality();
            }
        },
        columns: [
            { data: 'id' },
            { data: 'import_filename' },
            { data: 'import_date' },
            { data: 'rows' },
            { data: 'columns' },
            { data: 'permissionStatus'},
            { data: null }
        ],
        columnDefs: [
            {
                targets: 0,
                render: function (data, type, full, meta) {
                    var href = Routing.generate('project_details', {'dbversion': dbversion, 'project_id': full.internal_project_id, 'attribute': full.permissionStatus});
                    return '<a href="'+href+'">'+full.id+'</a>';
                }
            },
            {
                targets: -1,
                render: function(data, type, full, meta){
                    var actions = "<a class='btn fa fa-trash project-remove-button' data-toggle='confirFeditation' data-btn-ok-label='Yes' data-btn-ok-icon='glyphicon glyphicon-share-alt' " +
                        "data-btn-ok-class='btn-success' data-btn-cancel-label='Stop' data-btn-cancel-icon='glyphicon glyphicon-ban-circle' data-btn-cancel-class='btn-danger' " +
                        "data-title='Are you sure?'></a>";
                    if(full.permissionStatus === 'owner'){
                        actions = "<a class='btn fa fa-trash project-remove-button' data-toggle='confirFeditation' " +
                            "data-btn-ok-label='Continue' data-btn-ok-icon='glyphicon glyphicon-share-alt' " +
                            "data-btn-ok-class='btn-success' data-btn-cancel-label='Stop' data-btn-cancel-icon='glyphicon glyphicon-ban-circle' " +
                            "data-btn-cancel-class='btn-danger' data-title='This might be dangerous' data-content='Beware you could delete a shared project. If you continue, all permissions on this project will also be deleted.'></a>";
                        actions += "<a class='btn fa fa-share-alt project-share-button' data-toggle='confirFeditation'></a>"
                    }
                    return actions;
                }
            }
        ],
        drawCallback: function( settings ) {
            addProjectTableActionButtonFunctionality();
        }
    } );

    function addProjectTableActionButtonFunctionality(){
        $('.project-remove-button').confirmation({
            onConfirm: function(event, element){
                var table = $('#project-table').DataTable({
                    retrieve: true
                });
                var data = table.row( $(this).parents('tr') ).data();
                var url = Routing.generate('api_delete_projects', {'projectId': data.internal_project_id, 'dbversion': dbversion });
                $.ajax({
                    url: url,
                    type: 'GET',
                    cache: false,
                    dataType: 'json',
                    /* jshint unused:vars */
                    success: function(data, textStatus, jqXHR)
                    {
                        var deleted = data.deletedProjects;
                        showMessageDialog(deleted+" project"+(deleted > 1 ? "s" : "")+" deleted successfully", 'alert-success');
                        $('#project-table').DataTable({
                            retrieve: true
                        }).ajax.reload();
                    },
                    error: function(jqXHR, textStatus, errorThrown)
                    {
                        showMessageDialog("There was an error: "+textStatus, 'alert-danger');
                    }
                });
            }
        });
        $('.project-share-button').on("click", function(){
            var table = $('#project-table').DataTable({
                retrieve: true
            });
            var projectId = table.row( $(this).parents('tr') ).data().internal_project_id;
            bootbox.hideAll();
            bootbox.dialog({
                message: '<form action="" class="formName"><div class="form-group projects">' +
                '<label>Enter the email of the user you want to share the project with</label>' +
                '<input style="margin-bottom: 15px;" type="text" placeholder="email address" id="emailAddress" class="email form-control" required />' +
                '<select class="form-control" style="width: 100%" id="sharingOptions"><option value="edit" >edit</option><option value="view">view</option></select>' +
                '</div>' +
                '</form>',
                buttons: {
                    submit: {
                        label: "Share",
                        callback: function(){
                            var email = $('#emailAddress').val();
                            var attribute = $('#sharingOptions').val();
                            var url = Routing.generate('api_sharing_projects', {'projectId': projectId, 'dbversion': dbversion, 'email': email, 'attribute': attribute });
                            if(!email){
                                return false;
                            }
                            $.ajax({
                                url: url,
                                type: 'GET',
                                cache: false,
                                dataType: 'json',
                                /* jshint unused:vars */
                                success: function(data, textStatus, jqXHR)
                                {
                                    if(data.error){
                                        showMessageDialog(data.message, 'alert-danger');
                                    } else {
                                        showMessageDialog(data.message, 'alert-success');
                                    }
                                    $('#project-table').DataTable({
                                        retrieve: true
                                    }).ajax.reload();
                                }
                            });
                        }
                    }
                }
            });
        });

    }

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
            console.log(allTraitTypes);
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
