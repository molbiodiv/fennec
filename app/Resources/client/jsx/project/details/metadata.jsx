const biomPromise = require('./biom')
let biom
let getBiom = async () => {
    biom = await biomPromise
}
getBiom()
const BootstrapDialog = require('bootstrap3-dialog')

$('document').ready(() => {
    $('#project-explore-otu-metadata').click(() => {
        initTable('rows', 'observation-metadata-table')
    })
    $('#project-explore-sample-metadata').click(() => {
        initTable('columns', 'sample-metadata-table')
    })
});

const tableConfig = {
    order: [2, "desc"],
    dom: "<'row'<'col-sm-3'l><'col-sm-6 text-center'B><'col-sm-3'f>>" +
         "<'row'<'col-sm-12'rt>>" +
		 "<'row'<'col-sm-5'i><'col-sm-7'p>>",
    buttons: [
        'colvis'
    ],
    scrollX: true,
}

const getTableData = (dimension) => {
    if(dimension !== 'columns' && dimension !== 'rows'){
        return [[],[]]
    }
    let dimMetadata = biom[dimension].map(x => {
        let key = (dimension === 'columns' ? 'Sample ID' : 'OTU ID')
        let metadata = {}
        metadata[key] =  x.id
        let fennec = _.get(x.metadata,["fennec", dbversion], null);
        if(fennec === null){
            metadata["fennec"] = "unmapped";
        } else {
            let href = Routing.generate('organism_details', {'dbversion': dbversion, 'fennec_id': fennec["fennec_id"]});
            metadata["fennec"] = `<a href='${href}'>${fennec["scientific_name"]}</a>`;
        }
        if(dimension === 'columns'){
            metadata["Total Count"] = _.sum(biom.getDataColumn(x.id))
        } else {
            metadata["Total Count"] = _.sum(biom.getDataRow(x.id))
        }
        metadata["Total Count"] += `<i class="fa fa-bar-chart project-metadata-count-icon" aria-hidden="true" onclick="showDistributionPopup('${dimension}','${x.id}')"  data-toggle="tooltip" title="Distribution"></i>`
        let traitCitations = x.metadata["trait_citations"] || {};
        for(let m of Object.keys(x.metadata)){
            if(m === 'fennec' || m === 'trait_citations'){
                continue;
            }
            metadata[m] = x.metadata[m]
            if(metadata[m] !== null && traitCitations.hasOwnProperty(m)){
                metadata[m] += `<i class="fa fa-quote-right project-metadata-reference-icon" aria-hidden="true" onclick="showCitationPopup('${dimension}','${x.id}','${m}')"  data-toggle="tooltip" title="References"></i>`;
            }
        }
        return metadata
    })
    let columns = Object.keys(dimMetadata[0]).map(x => ({data: x, title: x}))
    return [dimMetadata, columns]
}

const initTable = (dimension, id) => {
    $('#metadata-table-progress').show()
    // The timeout is used to make the busy indicator show up before the heavy computation starts
    // Web workers are a better solution to achieve this goal and avoid hanging of the interface in the future
    window.setTimeout(() => {
        let [metadata, columns] = getTableData(dimension)
        $(`#${id}`).DataTable(Object.assign({}, tableConfig, {
            data: metadata,
            columns: columns,
        }));
        $('#metadata-table-progress').hide()
    }, 5)
}

const showCitationPopup = (dimension, id, traitName) => {
    let entries = (dimension === 'rows' ? biom.rows : biom.columns);
    let citations = entries.filter(x => x.id === id)[0].metadata.trait_citations[traitName];
    let table = $('<table class="table table-striped"><thead><tr><th>Value</th><th>Citation</th></tr></thead></table>');
    let tbody = $('<tbody></tbody>');
    table.append(tbody);
    for (c of citations){
        tbody.append($(`<tr><td>${c.value}</td><td>${c.citation}</td></tr>`))
    }
    BootstrapDialog.show({
        message: $('<div></div>').append(table),
        title: `References for "${traitName}" of ${id}`,
        size: BootstrapDialog.SIZE_WIDE
    })
};

global.showCitationPopup = showCitationPopup;

const showDistributionPopup = (dimension, id) => {
    let counts;
    let [primary, secondary] = ['OTU', 'Sample'];
    if(dimension === 'rows'){
        counts = _.reverse(_.sortBy(_.zip(biom.columns.map(x => x.id),biom.getDataRow(id)),1))
    } else {
        counts = _.reverse(_.sortBy(_.zip(biom.rows.map(x => x.id),biom.getDataColumn(id)),1));
        primary = 'Sample';
        secondary = 'OTU';
    }
    let total = _.sum(counts.map(x => x[1]));
    let table = $(`<table class="table table-striped"><thead><tr><th>${secondary}</th><th>Count</th><th>Relative Amount (highest count)</th></tr></thead></table>`);
    let tbody = $('<tbody></tbody>');
    table.append(tbody);
    let barTemplate = _.template('<div class="progress"><div class="progress-bar" role="progressbar" style="width: <%= percent %>%;"></div></div>');
    for (c of counts){
        tbody.append($(`<tr><td>${c[0]}</td><td>${c[1]}</td><td>${barTemplate({value: c[1], percent: 100*c[1]/counts[0][1]})}</td></tr>`))
    }
    BootstrapDialog.show({
        message: $('<div></div>').append(table),
        title: `Distribution of ${primary} ${id} (Total: ${total})`,
        //size: BootstrapDialog.SIZE_WIDE
    })
};

global.showDistributionPopup = showDistributionPopup;