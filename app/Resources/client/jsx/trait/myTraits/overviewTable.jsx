$('document').ready(function () {
    let dbversion = $('#globals').data('dbversion');

    $('#trait-file-upload-table').DataTable( {
        ajax: {
            method: 'POST',
            url: Routing.generate('api_listing_trait_files', {'dbversion': dbversion}),
            dataSrc: 'data',
            complete: function(){
                addTraitFileTableActionButtonFunctionality();
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
                    return '<a href="#">'+full.filename+'</a>';
                }
            },
            {
                targets: -1,
                render: function(data, type, full, meta){
                    let actions = "<a class='btn fa fa-trash trait-file-remove-button' data-toggle='confirFeditation' " +
                    "data-btn-ok-label='Continue' data-btn-ok-icon='glyphicon glyphicon-share-alt' " +
                    "data-btn-ok-class='btn-success' data-btn-cancel-label='Stop' data-btn-cancel-icon='glyphicon glyphicon-ban-circle' " +
                    "data-btn-cancel-class='btn-danger' data-title='This might be dangerous' data-content='Attention: If you continue, all trait entries of this file will be removed from the database.'></a>";
                    return actions;
                }
            }
        ],
        drawCallback: function( settings ) {
            addTraitFileTableActionButtonFunctionality();
        }
    } );

    function addTraitFileTableActionButtonFunctionality() {
        $('.trait-file-remove-button').confirmation({
            onConfirm: function (event, element) {
                var table = $('#trait-file-upload-table').DataTable({
                    retrieve: true
                });
                var data = table.row($(this).parents('tr')).data();
                var url = Routing.generate('api_delete_trait_file', {
                    'traitFileId': data.traitFileId,
                    'dbversion': dbversion
                });
                $.ajax({
                    url: url,
                    type: 'GET',
                    cache: false,
                    dataType: 'json',
                    /* jshint unused:vars */
                    success: function (data, textStatus, jqXHR) {
                        showMessageDialog(data.success, 'alert-success');
                        $('#trait-file-upload-table').DataTable({
                            retrieve: true
                        }).ajax.reload();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        showMessageDialog("There was an error: " + textStatus, 'alert-danger');
                    }
                });
            }
        });
    }
});
