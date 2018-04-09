$('document').ready(function () {
    let dbversion = $('#globals').data('dbversion');

    $('#trait-file-upload-table').DataTable( {
        ajax: {
            method: 'POST',
            url: Routing.generate('api_listing_trait_files', {'dbversion': dbversion}),
            dataSrc: 'data',
            complete: function(){
                addProjectTableActionButtonFunctionality();
            }
        },
        columns: [
            { data: 'filename' },
            { data: 'importDate' },
            { data: 'traitType' },
            { data: 'format' },
            { data: 'entries'},
            { data: null }
        ],
        columnDefs: [
            {
                targets: 0,
                render: function (data, type, full, meta) {
                    // var href = Routing.generate('trait_file_details', {'dbversion': dbversion, 'traitFile_id': full.traitFileId});
                    return '<a href="#">'+full.traitFileId+'</a>';
                }
            },
            {
                targets: -1,
                render: function(data, type, full, meta){
                    let actions = "<a class='btn fa fa-trash project-remove-button' data-toggle='confirFeditation' " +
                    "data-btn-ok-label='Continue' data-btn-ok-icon='glyphicon glyphicon-share-alt' " +
                    "data-btn-ok-class='btn-success' data-btn-cancel-label='Stop' data-btn-cancel-icon='glyphicon glyphicon-ban-circle' " +
                    "data-btn-cancel-class='btn-danger' data-title='This might be dangerous' data-content='Beware you could delete a shared project. If you continue, all permissions on this project will also be deleted.'></a>";
                    return actions;
                }
            }
        ],
        drawCallback: function( settings ) {
            addProjectTableActionButtonFunctionality();
        }
    } );

    function addProjectTableActionButtonFunctionality() {
        $('.project-remove-button').confirmation({
            onConfirm: function (event, element) {
                var table = $('#project-table').DataTable({
                    retrieve: true
                });
                var data = table.row($(this).parents('tr')).data();
                var url = Routing.generate('api_delete_projects', {
                    'projectId': data.internal_project_id,
                    'dbversion': dbversion
                });
                $.ajax({
                    url: url,
                    type: 'GET',
                    cache: false,
                    dataType: 'json',
                    /* jshint unused:vars */
                    success: function (data, textStatus, jqXHR) {
                        var deleted = data.deletedProjects;
                        showMessageDialog(deleted + " project" + (deleted > 1 ? "s" : "") + " deleted successfully", 'alert-success');
                        $('#project-table').DataTable({
                            retrieve: true
                        }).ajax.reload();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        showMessageDialog("There was an error: " + textStatus, 'alert-danger');
                    }
                });
            }
        });
    });
});
