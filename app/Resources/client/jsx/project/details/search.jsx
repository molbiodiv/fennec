$('document').ready(() => {
    let [sampleMetadata, sampleColumns] = getTableData('columns')
    $('#sample-metadata-table').DataTable({
        data: sampleMetadata,
        columns: sampleColumns,
        order: [1, "desc"],
        dom: 'Bfrtip',
        buttons: [
            'colvis'
        ]
    });
});

const getTableData = (dimension) => {
    if(dimension !== 'columns' && dimension !== 'rows'){
        return [[],[]]
    }
    let dimMetadata = biom[dimension].map(x => {
        let metadata = {
            "Sample ID": x.id,
        }
        if(dimension === 'columns'){
            metadata["Total Count"] = _.sum(biom.getDataColumn(x.id))
        } else {
            metadata["Total Count"] = _.sum(biom.getDataRow(x.id))
        }
        for(let m of Object.keys(x.metadata)){
            metadata[m] = x.metadata[m]
        }
        return metadata
    })
    let columns = Object.keys(dimMetadata[0]).map(x => ({data: x, title: x}))
    return [dimMetadata, columns]
}