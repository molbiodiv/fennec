/* global dbversion */
/* global internalProjectId */

const _ = require('lodash')
const $ = require('jquery')
const biomPromise = require('./biom')
const saveAs = require('file-saver').saveAs
const Papa = require('papaparse')

$('document').ready(async function () {
    biom = await biomPromise;
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

    $('#project-export-trait-citation-otus').click(()=>exportTraitCitationsTable('rows'));
    $('#project-export-trait-citation-samples').click(()=>exportTraitCitationsTable('columns'));

    $('#project-add-metadata-sample').on("change", addMetadataSample);
    $('#project-add-metadata-observation').on("change", addMetadataObservation);

    $('#metadata-overview-sample').append(getMetadataKeys(biom, 'columns').map((text) => $("<li>").text(text)));
    $('#metadata-overview-observation').append(getMetadataKeys(biom, 'rows').map((text) => $("<li>").text(text)));

    $('#project-transpose').click(() => {
        biom.transpose();
        saveBiomToDB();
    });
});

/**
 * Saves the current value of the global biom variable to the postgres database
 */
function saveBiomToDB() {
    biom.write().then(function (biomJson) {
        var webserviceUrl = Routing.generate('api_edit_update_project', {'dbversion': dbversion});
        $.ajax({
            url: webserviceUrl,
            data: {
                'biom': biomJson,
                'projectId': internalProjectId
            },
            type: 'POST',
            success: function () {
                location.reload();
            }
        });
    }, function (failure) {
        console.log(failure);
    });
}

// export globally
window.saveBiomToDB = saveBiomToDB;

/**
 * Opens a file download dialog of the current project in biom format
 * @param {boolean} asHdf5
 */
function exportProjectAsBiom(asHdf5) {
    let conversionServerURL = Routing.generate('biomcs_convert', {'dbversion': dbversion});
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
    tax = tax.map(x => x === null ? [] : x);
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
function exportTraitCitationsTable(dimension) {
    const contentType = "text/plain";
    let out = _.join([(dimension==="rows" ? '#OTUId' : '#SampleId'), 'fennec_id', 'scientific_name', 'traitType', 'citation', 'value'], "\t")+"\n";
    let entries = biom[dimension]
    for(let entry of entries){
        let id = entry.id;
        let fennec_id = _.get(entry, ['metadata', 'fennec', dbversion, 'fennec_id']) || '';
        let scientific_name = _.get(entry, ['metadata', 'fennec', dbversion, 'scientific_name']) || '';
        for(let traitType of Object.keys(_.get(entry, ['metadata', 'trait_citations'])||{})){
            for(let tc of _.get(entry, ['metadata', 'trait_citations', traitType])){
                out += _.join([id, fennec_id, scientific_name, traitType, tc['citation'], tc['value']], "\t")+"\n";
            }
        }
    }
    const blob = new Blob([out], {type: contentType});
    saveAs(blob, biom.id+(dimension==="rows" ? ".OTU" : ".sample")+".citations.tsv");
}

/**
 * Add sample metadata from selected files
 * @param {event} event
 * @returns {void}
 */
function addMetadataSample(event)
{
    let files = event.target.files;
    let fr = new FileReader()
    fr.onload = () => addMetadataToFile(fr.result, updateProject, 'columns')
    fr.readAsText(files[0]);
}

/**
 * Add observation metadata from selected files
 * @param {event} event
 * @returns {void}
 */
function addMetadataObservation(event)
{
    let files = event.target.files;
    let fr = new FileReader()
    fr.onload = () => addMetadataToFile(fr.result, updateProject, 'rows')
    fr.readAsText(files[0]);
}

function updateProject() {
    let webserviceUrl = Routing.generate('api_edit_update_project', {'dbversion': dbversion});
    $.ajax(webserviceUrl, {
        data: {
            "projectId": internalProjectId,
            "biom": biom.toString()
        },
        method: "POST",
        success: () => showMessageDialog('Successfully added metadata.', 'success'),
        error: (error) => showMessageDialog(error, 'danger')
    });
}

/**
 * Add sample metadata content to file
 * @param {String} result
 * @param {Function} callback
 * @param {String} dimension
 */
function addMetadataToFile(result, callback, dimension='columns'){
    let csvData = Papa.parse(result, {header: true, skipEmptyLines: true})
    if(csvData.errors.length > 0){
        showMessageDialog(csvData.errors[0].message+' line: '+csvData.errors[0].row, 'danger');
        return;
    }
    if(csvData.data.length === 0){
        showMessageDialog("Could not parse file. No data found.", 'danger');
        return;
    }
    let sampleMetadata = {}
    let metadataKeys = Object.keys(csvData.data[0]);
    let idKey = metadataKeys.splice(0,1)[0];
    for(let key of metadataKeys){
        sampleMetadata[key] = {}
    }
    for(let row of csvData.data){
        $.each(row, (key, value) => {
            if(key !== idKey){
                sampleMetadata[key][row[idKey]] = value
            }
        })
    }
    $.each(sampleMetadata, (key,value)=>{
        biom.addMetadata({'dimension': dimension, 'attribute': key, 'values': value})
    })
    callback();
}
