$('document').ready(() => {
    let sampleMetadata = biom.columns.map(x => {
        let metadata = {
            "sample": x.id,
            "count": _.sum(biom.getDataColumn(x.id))
        }
        return metadata
    })
    $('#sample-metadata-table').DataTable({
        data: sampleMetadata,
        columns: [
            {data: 'sample', title: 'Sample ID'},
            {data: 'count', title: 'Total Count'}
        ],
        order: [1, "desc"],
        columnDefs: []
    });
});