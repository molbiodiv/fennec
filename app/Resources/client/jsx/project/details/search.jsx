$('document').ready(() => {
    let tableConfig = {
        order: [1, "desc"],
        dom: 'Bfrtip',
        buttons: [
            'colvis'
        ],
        scrollX: true,
    }
    let [sampleMetadata, sampleColumns] = getTableData('columns')
    $('#sample-metadata-table').DataTable(Object.assign({}, tableConfig, {
        data: sampleMetadata,
        columns: sampleColumns,

    });
    let [observationMetadata, observationColumns] = getTableData('rows')
    $('#observation-metadata-table').DataTable(Object.assign({}, tableConfig, {
        data: observationMetadata,
        columns: observationColumns,
    }));
});

const getTableData = (dimension) => {
    if(dimension !== 'columns' && dimension !== 'rows'){
        return [[],[]]
    }
    let dimMetadata = biom[dimension].map(x => {
        let key = (dimension === 'columns' ? 'Sample ID' : 'OTU ID')
        let metadata = {}
        metadata[key] =  x.id,
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