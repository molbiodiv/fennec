function initTraitsOfProjectTable(){
    $('#trait-table').DataTable( {
        data: traits,
        columns: [
            { data: 'trait' },
            { data: 'count' },
            { data: 'range' }
        ],
        order: [ 2, "desc" ],
        columnDefs: [
             {
                targets: 2,
                render: function (data, type, full, meta) {
                    return '<span title="'+data/100+'"></span><div class="progress"><div class="progress-bar progress-bar-trait" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: '+data+'%">'+Math.round(data)+'%</div></div>';
                },
                 type: 'title-numeric'
             },
             {
                targets: 0,
                render: function (data, type, full, meta) {
                    return '<a href="'+WebRoot+"/"+DbVersion+"/trait/details/byid/"+full.id+'">'+full.trait+'</a>';
                }
            }
        ]
    });
}

