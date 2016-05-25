var table = $('#project-table').DataTable( {
    ajax: {
        url: ServicePath+'/listing/projects?dbversion='+DbVersion,
        dataSrc: 'data',
        complete: function(){
            addProjectTableActionButtonFunctionality();
        }
    },
    columns: [
        { data: 'id' },
        { data: 'import_date' },
        { data: 'rows' },
        { data: 'columns' },
        { data: null }
    ],
    columnDefs: [ 
        {
            "targets": -1,
            "data": null,
            "defaultContent": "<a class=\"btn fa fa-trash project-remove-button\" data-toggle=\"confirmation\"></a>"
        }
    ]
} );
        
function addProjectTableActionButtonFunctionality(){
    $('.project-remove-button').confirmation({
        onConfirm: function(event, element){
            var table = $('#project-table').DataTable({
                retrieve: true
            });
            var data = table.row( element.parents('tr') ).data();
            $.ajax({
                url: WebRoot+'/ajax/manage/ProjectRemove',
                type: 'POST',
                data: {
                    'dbversion': DbVersion,
                    'ids': [data.internal_project_id]
                },
                cache: false,
                dataType: 'json',
                /* jshint unused:vars */
                success: function(data, textStatus, jqXHR)
                {
                    var removed = data.removedProjects;
                    showMessageDialog(removed+" project"+(removed > 1 ? "s" : "")+" removed successfully", 'alert-success');
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
}