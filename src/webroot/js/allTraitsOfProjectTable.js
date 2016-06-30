$('#trait-table').DataTable( {
//    ajax: {
//        url: ServicePath+'/listing/projects?dbversion='+DbVersion,
//        dataSrc: 'data',
//        complete: function(){
//            addProjectTableActionButtonFunctionality();
//        }
//    },
    columns: [
        { data: 'trait' },
        { data: 'count' },
        { data: 'range' }
    ]
} );


