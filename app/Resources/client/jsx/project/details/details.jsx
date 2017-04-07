/* global dbversion */
/* global biom */
/* global _ */
/* global $ */
/* global internalProjectId */
$('document').ready(function () {
    // Set header of page to project-id
    $('.page-header').text(biom.id);

    // Fill overview table with values
    $('#project-overview-table-id').text(biom.id);
    $('#project-overview-table-comment').text(biom.comment);
    $('#project-overview-table-rows').text(biom.shape[0]);
    $('#project-overview-table-cols').text(biom.shape[1]);
    $('#project-overview-table-nnz').text(biom.nnz + " (" + (100 * biom.nnz / (biom.shape[0] * biom.shape[1])).toFixed(2) + "%)");

    // Set action if edit dialog is shown
    $('#editProjectDialog').on('shown.bs.modal', function () {
        $('#editProjectDialogProjectID').val(biom.id);
        $('#editProjectDialogComment').val(biom.comment);
        $('#editProjectDialogProjectID').focus();
    });

    // Set action if edit dialog is saved
    $('#editProjectDialogSaveButton').click(function () {
        biom.id = $('#editProjectDialogProjectID').val();
        biom.comment = $('#editProjectDialogComment').val();
        saveBiomToDB();
    });

    $('#project-export-as-biom-v1').click(() => {
        exportProjectAsBiom(false);
    });

    $('#project-export-as-biom-v2').click(() => {
        exportProjectAsBiom(true);
    });

    $('#project-export-pseudo-tax-biom').click(exportPseudoTaxTable);

    $('#project-export-trait-citation').click(exportTraitCitationsTable);

    $('#project-add-metadata-sample').on("change", addMetadataSample);
});

/**
 * Saves the current value of the global biom variable to the postgres database
 */
function saveBiomToDB() {
    biom.write().then(function (biomJson) {
        var webserviceUrl = Routing.generate('api', {'namespace': 'edit', 'classname': 'updateProject'});
        $.ajax(webserviceUrl, {
            data: {
                "dbversion": dbversion,
                "project_id": internalProjectId,
                "biom": biomJson
            },
            method: "POST",
            success: function () {
                location.reload();
            }
        });
    }, function (failure) {
        console.log(failure);
    });
}

/**
 * Opens a file download dialog of the current project in biom format
 * @param {boolean} asHdf5
 */
function exportProjectAsBiom(asHdf5) {
    let conversionServerURL = Routing.generate('biomcs_convert');
    let contentType = asHdf5 ? "application/octet-stream" : "text/plain";
    biom.write({conversionServer: conversionServerURL, asHdf5: asHdf5}).then(function (biomContent) {
        var blob = new Blob([biomContent], {type: contentType});
        saveAs(blob, biom.id+".biom");
    }, function (failure) {
        showMessageDialog(failure+"", 'danger');
    });
}

/**
 * Opens a file download dialog of the current project in tsv format (pseudo taxonomy)
 */
function exportPseudoTaxTable() {
    let contentType = "text/plain";
    let tax = _.cloneDeep(biom.getMetadata({dimension: 'rows', attribute: 'taxonomy'}));
    let header = ['OTUID', 'kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'];
    let nextLevel = _.max(tax.map(elem => elem.length));
    let otuids = biom.rows.map(r => r.id);
    tax.map((v,i) => v.unshift(otuids[i]));
    nextLevel++;
    header = header.slice(0, nextLevel);
    for(let trait of Object.keys(biom.rows[0].metadata)){
        if(trait === 'taxonomy'){
            continue;
        }
        let traitValues = biom.getMetadata({dimension: 'rows', attribute: trait});
        header[nextLevel] = trait;
        tax.map((v,i) => v[nextLevel] = traitValues[i]);
        nextLevel++;
    }
    let out = _.join(header, "\t");
    out += "\n";
    out += _.join(tax.map(v => _.join(v,"\t")), "\n");
    const blob = new Blob([out], {type: contentType});
    saveAs(blob, biom.id+".tsv");
}

/**
 * Opens a file download dialog of all trait citations for this project
 */
function exportTraitCitationsTable() {
    const contentType = "text/plain";
    let out = _.join(['#OTUId', 'fennec_id', 'traitType', 'citation', 'value'], "\t")+"\n";
    for(let otu of biom.rows){
        let id = otu.id;
        let fennec_id = _.get(otu, ['metadata', 'fennec', dbversion, 'fennec_id']) || '';
        for(let traitType of Object.keys(_.get(otu, ['metadata', 'trait_citations'])||{})){
            for(let tc of _.get(otu, ['metadata', 'trait_citations', traitType])){
                out += _.join([id, fennec_id, traitType, tc['citation'], tc['value']], "\t")+"\n";
            }
        }
    }
    const blob = new Blob([out], {type: contentType});
    saveAs(blob, biom.id+".citations.tsv");
}

/**
 * Add sample metadata from selected files
 * @param {event} event
 * @returns {void}
 */
function addMetadataSample(event)
{
    let files = event.target.files;
    $.each(files, function(key, value){
        let fr = new FileReader(value)
        fr.onload((data) => console.log(data))
        console.log(key, value)
    });

    /*let webserviceUrl = Routing.generate('api', {'namespace': 'edit', 'classname': 'updateProject'});
    $.ajax(webserviceUrl, {
        data: {
            "dbversion": dbversion,
            "project_id": internalProjectId,
            "biom": biom.toString()
        },
        method: "POST",
        success: () => showMessageDialog('Successfully added sample metadata.', 'success'),
        error: (error) => showMessageDialog(error, 'danger')
    });*/
}
