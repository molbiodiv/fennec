$('document').ready(function () {
    $('#trait-file-upload-table').DataTable( {
            ajax: {
                method: 'POST',
                url: '{{ path('api_listing_trait_files', {'dbversion': dbversion}) }}',
                dataSrc: 'data',
                complete: function(){
                    addProjectTableActionButtonFunctionality();
                }
            },
            columns: [
                { data: 'filename' },
                { data: 'import_date' },
                { data: 'traitFormat' },
                { data: 'traitType' },
                { data: 'entries'},
                { data: null }
            ],
            drawCallback: function( settings ) {
                addProjectTableActionButtonFunctionality();
            }
        } );
});
