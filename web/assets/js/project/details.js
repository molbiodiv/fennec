webpackJsonp([1],{

/***/ "./app/Resources/client/jsx/project/details.jsx":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("./app/Resources/client/jsx/project/details/details.jsx");
__webpack_require__("./app/Resources/client/jsx/project/details/mapping.jsx");
__webpack_require__("./app/Resources/client/jsx/project/details/metadata.jsx");
__webpack_require__("./app/Resources/client/jsx/project/details/phinch.jsx");
__webpack_require__("./app/Resources/client/jsx/project/details/trait.jsx");

/***/ }),

/***/ "./app/Resources/client/jsx/project/details/details.jsx":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {/* global dbversion */
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

    $('#project-export-trait-citation-otus').click(() => exportTraitCitationsTable('rows'));
    $('#project-export-trait-citation-samples').click(() => exportTraitCitationsTable('columns'));

    $('#project-add-metadata-sample').on("change", addMetadataSample);
    $('#project-add-metadata-observation').on("change", addMetadataObservation);

    $('#metadata-overview-sample').append(getMetadataKeys(biom, 'columns').map(text => $("<li>").text(text)));
    $('#metadata-overview-observation').append(getMetadataKeys(biom, 'rows').map(text => $("<li>").text(text)));

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
        var webserviceUrl = Routing.generate('api', { 'namespace': 'edit', 'classname': 'updateProject' });
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

// export globally
window.saveBiomToDB = saveBiomToDB;

/**
 * Opens a file download dialog of the current project in biom format
 * @param {boolean} asHdf5
 */
function exportProjectAsBiom(asHdf5) {
    let conversionServerURL = Routing.generate('biomcs_convert');
    let contentType = asHdf5 ? "application/octet-stream" : "text/plain";
    biom.write({ conversionServer: conversionServerURL, asHdf5: asHdf5 }).then(function (biomContent) {
        var blob = new Blob([biomContent], { type: contentType });
        saveAs(blob, biom.id + ".biom");
    }, function (failure) {
        showMessageDialog(failure + "", 'danger');
    });
}

/**
 * Opens a file download dialog of the current project in tsv format (pseudo taxonomy)
 */
function exportPseudoTaxTable() {
    let contentType = "text/plain";
    let tax = _.cloneDeep(biom.getMetadata({ dimension: 'rows', attribute: 'taxonomy' }));
    let header = ['OTUID', 'kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'];
    let nextLevel = _.max(tax.map(elem => elem.length));
    let otuids = biom.rows.map(r => r.id);
    tax.map((v, i) => v.unshift(otuids[i]));
    nextLevel++;
    header = header.slice(0, nextLevel);
    for (let trait of Object.keys(biom.rows[0].metadata)) {
        if (trait === 'taxonomy') {
            continue;
        }
        let traitValues = biom.getMetadata({ dimension: 'rows', attribute: trait });
        header[nextLevel] = trait;
        tax.map((v, i) => v[nextLevel] = traitValues[i]);
        nextLevel++;
    }
    let out = _.join(header, "\t");
    out += "\n";
    out += _.join(tax.map(v => _.join(v, "\t")), "\n");
    const blob = new Blob([out], { type: contentType });
    saveAs(blob, biom.id + ".tsv");
}

/**
 * Opens a file download dialog of all trait citations for this project
 */
function exportTraitCitationsTable(dimension) {
    const contentType = "text/plain";
    let out = _.join([dimension === "rows" ? '#OTUId' : '#SampleId', 'fennec_id', 'traitType', 'citation', 'value'], "\t") + "\n";
    let entries = biom[dimension];
    for (let entry of entries) {
        let id = entry.id;
        let fennec_id = _.get(entry, ['metadata', 'fennec', dbversion, 'fennec_id']) || '';
        for (let traitType of Object.keys(_.get(entry, ['metadata', 'trait_citations']) || {})) {
            for (let tc of _.get(entry, ['metadata', 'trait_citations', traitType])) {
                out += _.join([id, fennec_id, traitType, tc['citation'], tc['value']], "\t") + "\n";
            }
        }
    }
    const blob = new Blob([out], { type: contentType });
    saveAs(blob, biom.id + (dimension === "rows" ? ".OTU" : ".sample") + ".citations.tsv");
}

/**
 * Add sample metadata from selected files
 * @param {event} event
 * @returns {void}
 */
function addMetadataSample(event) {
    let files = event.target.files;
    let fr = new FileReader();
    fr.onload = () => addMetadataToFile(fr.result, updateProject, 'columns');
    fr.readAsText(files[0]);
}

/**
 * Add observation metadata from selected files
 * @param {event} event
 * @returns {void}
 */
function addMetadataObservation(event) {
    let files = event.target.files;
    let fr = new FileReader();
    fr.onload = () => addMetadataToFile(fr.result, updateProject, 'rows');
    fr.readAsText(files[0]);
}

function updateProject() {
    let webserviceUrl = Routing.generate('api', { 'namespace': 'edit', 'classname': 'updateProject' });
    $.ajax(webserviceUrl, {
        data: {
            "dbversion": dbversion,
            "project_id": internalProjectId,
            "biom": biom.toString()
        },
        method: "POST",
        success: () => showMessageDialog('Successfully added metadata.', 'success'),
        error: error => showMessageDialog(error, 'danger')
    });
}

/**
 * Add sample metadata content to file
 * @param {String} result
 * @param {Function} callback
 * @param {String} dimension
 */
function addMetadataToFile(result, callback, dimension = 'columns') {
    let csvData = Papa.parse(result, { header: true, skipEmptyLines: true });
    if (csvData.errors.length > 0) {
        showMessageDialog(csvData.errors[0].message + ' line: ' + csvData.errors[0].row, 'danger');
        return;
    }
    if (csvData.data.length === 0) {
        showMessageDialog("Could not parse file. No data found.", 'danger');
        return;
    }
    let sampleMetadata = {};
    let metadataKeys = Object.keys(csvData.data[0]);
    let idKey = metadataKeys.splice(0, 1)[0];
    for (let key of metadataKeys) {
        sampleMetadata[key] = {};
    }
    for (let row of csvData.data) {
        $.each(row, (key, value) => {
            if (key !== idKey) {
                sampleMetadata[key][row[idKey]] = value;
            }
        });
    }
    $.each(sampleMetadata, (key, value) => {
        biom.addMetadata({ 'dimension': dimension, 'attribute': key, 'values': value });
    });
    callback();
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ "./app/Resources/client/jsx/project/details/mapping.jsx":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/* global dbversion */
/* global biom */
/* global _ */

$('document').ready(() => {

    /**
     * Create the results component from the returned mapping and store result in global biom object
     * @param {string} dimension
     * @param {Array} idsFromBiom those are the ids used for mapping in the order they appear in the biom file
     * @param {Array} mapping from ids to fennec_ids as returned by webservice
     * @param {string} method of mapping
     */
    let handleMappingResult = (() => {
        var _ref = _asyncToGenerator(function* (dimension, idsFromBiom, mapping, method) {
            try {
                let fennec_ids = new Array(idsFromBiom.length).fill(null);
                let fennecIds2scinames = yield getScinames(Object.values(mapping));
                let scinames = new Array(idsFromBiom.length).fill('unmapped');
                var idsFromBiomNotNullCount = 0;
                var idsFromBiomMappedCount = 0;
                for (let i = 0; i < idsFromBiom.length; i++) {
                    if (idsFromBiom[i] !== null) {
                        idsFromBiomNotNullCount++;
                        if (idsFromBiom[i] in mapping && mapping[idsFromBiom[i]] !== null && !Array.isArray(mapping[idsFromBiom[i]])) {
                            idsFromBiomMappedCount++;
                            fennec_ids[i] = mapping[idsFromBiom[i]];
                            scinames[i] = fennecIds2scinames[fennec_ids[i]];
                        }
                    }
                }
                biom.addMetadata({ dimension: dimension, attribute: ['fennec', dbversion, 'fennec_id'], values: fennec_ids });
                biom.addMetadata({ dimension: dimension, attribute: ['fennec', dbversion, 'assignment_method'], defaultValue: method });
                biom.addMetadata({ dimension: dimension, attribute: ['fennec', dbversion, 'scientific_name'], values: scinames });
                var idString = getIdStringForMethod(method);
                $('#mapping-results-section').show();
                $('#mapping-results').text(`From a total of ${idsFromBiom.length} organisms:  ${idsFromBiomNotNullCount} have a ${idString}, of which ${idsFromBiomMappedCount} could be mapped to fennec_ids.`);
            } catch (e) {
                showMessageDialog('There was an error: ' + e.message, 'danger');
                console.log(e);
            }
            $('#mapping-action-busy-indicator').hide();
        });

        return function handleMappingResult(_x, _x2, _x3, _x4) {
            return _ref.apply(this, arguments);
        };
    })();

    /**
     * Get map from fennec_id to scientific name
     * @param fennec_ids (array of ids, may contain sub-arrays and null: [1,2,[3,4],null,5])
     * @return {Promise.<void>}
     */


    // Calculate values for mapping overview table
    let sampleOrganismIDs = biom.getMetadata({ dimension: 'columns', attribute: ['fennec', dbversion, 'fennec_id'] }).filter(element => element !== null);
    let otuOrganismIDs = biom.getMetadata({ dimension: 'rows', attribute: ['fennec', dbversion, 'fennec_id'] }).filter(element => element !== null);
    var mappedSamples = sampleOrganismIDs.length;
    var percentageMappedSamples = 100 * mappedSamples / biom.shape[1];
    var mappedOTUs = otuOrganismIDs.length;
    var percentageMappedOTUs = 100 * mappedOTUs / biom.shape[0];

    // Add values to mapping overview table
    $('#mapping-otu').text(mappedOTUs);
    $('#progress-bar-mapping-otu').css('width', percentageMappedOTUs + '%').attr('aria-valuenow', percentageMappedOTUs);
    $('#progress-bar-mapping-otu').text(percentageMappedOTUs.toFixed(0) + '%');
    $('#mapping-sample').text(mappedSamples);
    $('#progress-bar-mapping-sample').css('width', percentageMappedSamples + '%').attr('aria-valuenow', percentageMappedSamples);
    $('#progress-bar-mapping-sample').text(percentageMappedSamples.toFixed(0) + '%');

    let methods = { ncbi_taxonomy: "NCBI taxid", organism_name: "Scientific name", iucn_redlist: "IUCN id", EOL: "EOL id" };
    $.each(methods, (key, value) => {
        addOptionToSelectpicker(key, value, 'mapping-method-select');
    });

    let sampleMetadataKeys = getMetadataKeys(biom, 'columns');
    addOptionToSelectpicker('ID', 'ID', 'mapping-metadata-sample-select');
    $.each(sampleMetadataKeys, (key, value) => {
        addOptionToSelectpicker('md:' + value, value, 'mapping-metadata-sample-select');
    });

    let observationMetadataKeys = getMetadataKeys(biom, 'rows');
    addOptionToSelectpicker('ID', 'ID', 'mapping-metadata-observation-select');
    $.each(observationMetadataKeys, (key, value) => {
        addOptionToSelectpicker('md:' + value, value, 'mapping-metadata-observation-select');
    });

    $('#mapping-dimension-select').on('change', () => {
        if ($('#mapping-dimension-select').val() === 'rows') {
            $('#mapping-metadata-sample-select').selectpicker('hide');
            $('#mapping-metadata-observation-select').selectpicker('show');
        } else {
            $('#mapping-metadata-sample-select').selectpicker('show');
            $('#mapping-metadata-observation-select').selectpicker('hide');
        }
    });

    $('.selectpicker').selectpicker('refresh');
    $('#mapping-dimension-select').change();

    // Add semi-global dimension variable (stores last mapped dimension)
    var dimension = 'rows';
    var method = 'ncbi_taxonomy';
    var attribute = '';

    // Set action for click on mapping "GO" button
    $('#mapping-action-button').on('click', function () {
        dimension = $('#mapping-dimension-select').val();
        method = $('#mapping-method-select').val();
        if (dimension === 'rows') {
            attribute = $('#mapping-metadata-observation-select').val();
        } else {
            attribute = $('#mapping-metadata-sample-select').val();
        }
        let ids = getIdsForAttribute(dimension, attribute);
        let uniq_ids = ids.filter(value => value !== null);
        uniq_ids = _.uniq(uniq_ids);
        $('#mapping-action-busy-indicator').show();
        $('#mapping-results-section').hide();
        if (uniq_ids.length === 0) {
            handleMappingResult(dimension, ids, [], method);
        } else {
            var webserviceUrl = getWebserviceUrlForMethod(method);
            $.ajax(webserviceUrl, {
                data: {
                    dbversion: dbversion,
                    ids: uniq_ids,
                    db: method
                },
                method: 'POST',
                success: function (data) {
                    handleMappingResult(dimension, ids, data, method);
                },
                error: function (error, status, text) {
                    showMessageDialog('There was a mapping error: ' + text, 'danger');
                    console.log(error);
                },
                complete: () => {
                    $('#mapping-action-busy-indicator').hide();
                }
            });
        }
    });

    function addOptionToSelectpicker(value, text, id) {
        let option = $('<option>').prop('value', value).text(text);
        $('#' + id).append(option);
    }

    /**
     * Returns the array with search id for the respective method in the given dimension
     * @param dimension
     * @param attribute
     * @return {Array}
     */
    function getIdsForAttribute(dimension, attribute) {
        let ids = [];
        if (attribute.substr(0, 3) === 'md:') {
            ids = biom.getMetadata({ dimension: dimension, attribute: attribute.substr(3) });
        } else {
            ids = biom[dimension].map(element => element.id);
        }
        return ids;
    }

    /**
     * Returns the webserviceUrl for the given mapping method
     * @param method
     * @return {string}
     */
    function getWebserviceUrlForMethod(method) {
        let method2service = {
            'ncbi_taxonomy': 'byDbxrefId',
            'EOL': 'byDbxrefId',
            'iucn_redlist': 'byDbxrefId',
            'organism_name': 'byOrganismName'
        };
        let webserviceUrl = Routing.generate('api', { 'namespace': 'mapping', 'classname': method2service[method] });
        return webserviceUrl;
    }

    /**
     * Returns a string representation for the IDs used for mapping in the chosen method
     * @param method
     * @return {string}
     */
    function getIdStringForMethod(method) {
        return methods[method];
    }function getScinames(fennec_ids) {
        let webserviceUrl = Routing.generate('api', { 'namespace': 'listing', 'classname': 'scinames' });
        return $.ajax(webserviceUrl, {
            data: {
                dbversion: dbversion,
                ids: _.flatten(fennec_ids).filter(x => x !== null),
                db: method
            },
            method: 'POST'
        });
    }

    // Set action for click on mapping "Save to database" button
    $('#mapping-save-button').on('click', function () {
        saveBiomToDB();
    });

    // Set action for click on mapping "Download as csv" button
    $('#mapping-download-csv-button').on('click', function () {
        let ids = biom[dimension].map(function (element) {
            return element.id;
        });
        let mappingIds = getIdsForAttribute(dimension, attribute);
        let fennecIds = biom.getMetadata({ dimension: dimension, attribute: ['fennec', dbversion, 'fennec_id'] });
        let idHeader = dimension === 'rows' ? 'OTU_ID' : 'Sample_ID';
        let idString = getIdStringForMethod(method);
        var csv = `${idHeader}\t${idString}\tFennec_ID\n`;
        for (var i = 0; i < ids.length; i++) {
            csv += ids[i] + "\t" + mappingIds[i] + "\t" + fennecIds[i] + "\n";
        }
        var blob = new Blob([csv], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "mapping.csv");
    });
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ "./app/Resources/client/jsx/project/details/metadata.jsx":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {$('document').ready(() => {
    $('#project-explore-otu-metadata').click(() => {
        initTable('rows', 'observation-metadata-table');
    });
    $('#project-explore-sample-metadata').click(() => {
        initTable('columns', 'sample-metadata-table');
    });
});

const tableConfig = {
    order: [1, "desc"],
    dom: 'Bfrtip',
    buttons: ['colvis'],
    scrollX: true
};

const getTableData = dimension => {
    if (dimension !== 'columns' && dimension !== 'rows') {
        return [[], []];
    }
    let dimMetadata = biom[dimension].map(x => {
        let key = dimension === 'columns' ? 'Sample ID' : 'OTU ID';
        let metadata = {};
        metadata[key] = x.id;
        if (dimension === 'columns') {
            metadata["Total Count"] = _.sum(biom.getDataColumn(x.id));
        } else {
            metadata["Total Count"] = _.sum(biom.getDataRow(x.id));
        }
        for (let m of Object.keys(x.metadata)) {
            if (m === 'fennec') {
                continue;
            }
            metadata[m] = x.metadata[m];
        }
        return metadata;
    });
    let columns = Object.keys(dimMetadata[0]).map(x => ({ data: x, title: x }));
    return [dimMetadata, columns];
};

const initTable = (dimension, id) => {
    $('#metadata-table-progress').show();
    // The timeout is used to make the busy indicator show up before the heavy computation starts
    // Web workers are a better solution to achieve this goal and avoid hanging of the interface in the future
    window.setTimeout(() => {
        let [metadata, columns] = getTableData(dimension);
        $(`#${id}`).DataTable(Object.assign({}, tableConfig, {
            data: metadata,
            columns: columns
        }));
        $('#metadata-table-progress').hide();
    }, 5);
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ "./app/Resources/client/jsx/project/details/phinch.jsx":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {/* global biom */
/* global phinchPreviewPath */
const db = __webpack_require__("./web/assets/Phinch/lib/db.js");

function adjustIframeHeight() {
    setTimeout(() => {
        $('#inspect-with-phinch-iframe').attr('height', $('#inspect-with-phinch-iframe').contents().height() + 20);
    }, 100);
}

$('document').ready(() => {
    // Set action for click on inspect with Phinch
    // db is the browser webstorage
    db.open({
        server: "BiomData",
        version: 1,
        schema: {
            "biom": {
                key: {
                    keyPath: 'id',
                    autoIncrement: true
                }
            }
        }
    }).done(function (server) {
        var biomToStore = {};
        biomToStore.name = biom.id;
        let biomString = biom.toString();
        biomToStore.size = biomString.length;
        biomToStore.data = biomString;
        let d = new Date();
        biomToStore.date = d.getUTCFullYear() + "-" + (d.getUTCMonth() + 1) + "-" + d.getUTCDate() + "T" + d.getUTCHours() + ":" + d.getUTCMinutes() + ":" + d.getUTCSeconds() + " UTC";
        server.biom.add(biomToStore).done(function (item) {
            $('#inspect-with-phinch-iframe').show();
            $('#inspect-with-phinch-iframe').attr('src', phinchPreviewPath);
        });
    });

    // Adjust size of iframe after loading of Phinch
    $('#inspect-with-phinch-iframe').on("load", function () {
        setTimeout(adjustIframeHeight, 1000);
    });

    $('#inspect-with-phinch-tab').on('click', adjustIframeHeight);
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ "./app/Resources/client/jsx/project/details/trait.jsx":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {/* global internalProjectId */
/* global dbversion */

$('document').ready(() => {
    getAndShowTraits('#trait-table', 'rows');
    getAndShowTraits('#trait-table-sample', 'columns');

    function getAndShowTraits(id, dimension) {
        var webserviceUrl = Routing.generate('api', { 'namespace': 'details', 'classname': 'traitsOfOrganisms' });
        // Extract row fennec_ids from biom
        var fennec_ids = biom.getMetadata({ dimension: dimension, attribute: ['fennec', dbversion, 'fennec_id'] }).filter(element => element !== null);

        // Get traits for rows
        $.ajax(webserviceUrl, {
            data: {
                "dbversion": dbversion,
                "fennec_ids": fennec_ids
            },
            method: "POST",
            success: function (data) {
                let traits = [];
                $.each(data, function (key, value) {
                    var thisTrait = {
                        id: key,
                        trait: value['trait_type'],
                        count: value['trait_entry_ids'].length,
                        range: 100 * value['fennec_ids'].length / fennec_ids.length
                    };
                    traits.push(thisTrait);
                });
                initTraitsOfProjectTable(id, dimension, traits);
            }
        });
    }

    // Init traits of project table with values
    function initTraitsOfProjectTable(tableId, dimension, traits) {
        let metadataKeys = getMetadataKeys(biom, dimension);
        $(tableId).DataTable({
            data: traits,
            columns: [{ data: 'trait' }, { data: 'count' }, { data: 'range' }, { data: null }, { data: null }, { data: null }],
            order: [2, "desc"],
            columnDefs: [{
                targets: 2,
                render: data => '<span title="' + data / 100 + '"></span>' + '<div class="progress">' + '<div class="progress-bar progress-bar-trait" role="progressbar" style="width: ' + data + '%">' + Math.round(data) + '%</div></div>',
                type: 'title-numeric'
            }, {
                targets: 0,
                render: (data, type, full) => {
                    var href = Routing.generate('trait_details', {
                        'dbversion': dbversion,
                        'trait_type_id': full.id
                    });
                    return '<a href="' + href + '">' + full.trait + '</a>';
                }
            }, {
                targets: 3,
                render: (data, type, full) => {
                    var href = Routing.generate('project_trait_details', {
                        'dbversion': dbversion,
                        'trait_type_id': full.id,
                        'project_id': internalProjectId,
                        'dimension': dimension
                    });
                    return '<a href="' + href + '"><i class="fa fa-search"></i></a>';
                }
            }, {
                targets: 4,
                render: (data, type, full) => {
                    return _.indexOf(metadataKeys, full.trait) != -1 ? '<i class="fa fa-check"></i>' : '';
                }
            }, {
                targets: 5,
                render: (data, type, full) => {
                    return _.indexOf(metadataKeys, full.trait) != -1 ? '<a onclick="removeTraitFromProjectTableAction(' + "'" + full.trait + "','" + dimension + "'" + ')"><i class="fa fa-trash"></i></a>' : '<a onclick="addTraitToProjectTableAction(' + full.id + ',' + "'" + dimension + "'" + ')"><i class="fa fa-plus"></i></a>';
                }
            }]
        });
    }
});

function addTraitToProjectTableAction(traitTypeId, dimension) {
    $.ajax({
        url: Routing.generate('api', { 'namespace': 'details', 'classname': 'TraitOfProject' }),
        data: {
            "dbversion": dbversion,
            "internal_project_id": internalProjectId,
            "trait_type_id": traitTypeId,
            "include_citations": true
        },
        method: "POST",
        success: function (data) {
            var traitValues;
            if (data.trait_format === 'numerical') {
                traitValues = condenseNumericalTraitValues(data.values);
            } else {
                traitValues = condenseCategoricalTraitValues(data.values);
            }
            addTraitToProject(data.name, traitValues, data.citations, biom, dimension, dbversion, internalProjectId, () => window.location.reload());
        }
    });
}

function removeTraitFromProjectTableAction(traitName, dimension) {
    removeTraitFromProject(traitName, biom, dimension, dbversion, internalProjectId, () => window.location.reload());
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ "./web/assets/Phinch/lib/db.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;(function (window, undefined) {
    'use strict';

    var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.oIndexedDB || window.msIndexedDB,
        IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange,
        transactionModes = {
        readonly: 'readonly',
        readwrite: 'readwrite'
    };

    var hasOwn = Object.prototype.hasOwnProperty;

    if (!indexedDB) {
        throw 'IndexedDB required';
    }

    var defaultMapper = function (value) {
        return value;
    };

    var CallbackList = function () {
        var state,
            list = [];

        var exec = function (context, args) {
            if (list) {
                args = args || [];
                state = state || [context, args];

                for (var i = 0, il = list.length; i < il; i++) {
                    list[i].apply(state[0], state[1]);
                }

                list = [];
            }
        };

        this.add = function () {
            for (var i = 0, il = arguments.length; i < il; i++) {
                list.push(arguments[i]);
            }

            if (state) {
                exec();
            }

            return this;
        };

        this.execute = function () {
            exec(this, arguments);
            return this;
        };
    };

    var Deferred = function (func) {
        var state = 'progress',
            actions = [['resolve', 'done', new CallbackList(), 'resolved'], ['reject', 'fail', new CallbackList(), 'rejected'], ['notify', 'progress', new CallbackList()]],
            deferred = {},
            promise = {
            state: function () {
                return state;
            },
            then: function () /* doneHandler , failedHandler , progressHandler */{
                var handlers = arguments;

                return Deferred(function (newDefer) {
                    actions.forEach(function (action, i) {
                        var handler = handlers[i];

                        deferred[action[1]](typeof handler === 'function' ? function () {
                            var returned = handler.apply(this, arguments);

                            if (returned && typeof returned.promise === 'function') {
                                returned.promise().done(newDefer.resolve).fail(newDefer.reject).progress(newDefer.notify);
                            }
                        } : newDefer[action[0]]);
                    });
                }).promise();
            },
            promise: function (obj) {
                if (obj) {
                    Object.keys(promise).forEach(function (key) {
                        obj[key] = promise[key];
                    });

                    return obj;
                }
                return promise;
            }
        };

        actions.forEach(function (action, i) {
            var list = action[2],
                actionState = action[3];

            promise[action[1]] = list.add;

            if (actionState) {
                list.add(function () {
                    state = actionState;
                });
            }

            deferred[action[0]] = list.execute;
        });

        promise.promise(deferred);

        if (func) {
            func.call(deferred, deferred);
        }

        return deferred;
    };

    var Server = function (db, name) {
        var that = this,
            closed = false;

        this.add = function (table) {
            if (closed) {
                throw 'Database has been closed';
            }

            var records = [];
            for (var i = 0; i < arguments.length - 1; i++) {
                records[i] = arguments[i + 1];
            }

            var transaction = db.transaction(table, transactionModes.readwrite),
                store = transaction.objectStore(table),
                deferred = Deferred();

            records.forEach(function (record) {
                var req;
                if (record.item && record.key) {
                    var key = record.key;
                    record = record.item;
                    req = store.add(record, key);
                } else {
                    req = store.add(record);
                }

                req.onsuccess = function (e) {
                    var target = e.target;
                    var keyPath = target.source.keyPath;
                    if (keyPath === null) {
                        keyPath = '__id__';
                    }
                    Object.defineProperty(record, keyPath, {
                        value: target.result,
                        enumerable: true
                    });
                    deferred.notify();
                };
            });

            transaction.oncomplete = function () {
                deferred.resolve(records, that);
            };
            transaction.onerror = function (e) {
                deferred.reject(records, e);
            };
            transaction.onabort = function (e) {
                deferred.reject(records, e);
            };
            return deferred.promise();
        };

        this.update = function (table) {
            if (closed) {
                throw 'Database has been closed';
            }

            var records = [];
            for (var i = 0; i < arguments.length - 1; i++) {
                records[i] = arguments[i + 1];
            }

            var transaction = db.transaction(table, transactionModes.readwrite),
                store = transaction.objectStore(table),
                keyPath = store.keyPath,
                deferred = Deferred();

            records.forEach(function (record) {
                var req;
                if (record.item && record.key) {
                    var key = record.key;
                    record = record.item;
                    req = store.put(record, key);
                } else {
                    req = store.put(record);
                }

                req.onsuccess = function (e) {
                    deferred.notify();
                };
            });

            transaction.oncomplete = function () {
                deferred.resolve(records, that);
            };
            transaction.onerror = function (e) {
                deferred.reject(records, e);
            };
            transaction.onabort = function (e) {
                deferred.reject(records, e);
            };
            return deferred.promise();
        };

        this.remove = function (table, key) {
            if (closed) {
                throw 'Database has been closed';
            }
            var transaction = db.transaction(table, transactionModes.readwrite),
                store = transaction.objectStore(table),
                deferred = Deferred();

            var req = store.delete(key);
            transaction.oncomplete = function () {
                deferred.resolve(key);
            };
            transaction.onerror = function (e) {
                deferred.reject(e);
            };
            return deferred.promise();
        };

        this.clear = function (table) {
            if (closed) {
                throw 'Database has been closed';
            }
            var transaction = db.transaction(table, transactionModes.readwrite),
                store = transaction.objectStore(table),
                deferred = Deferred();

            var req = store.clear();
            transaction.oncomplete = function () {
                deferred.resolve();
            };
            transaction.onerror = function (e) {
                deferred.reject(e);
            };
            return deferred.promise();
        };

        this.close = function () {
            if (closed) {
                throw 'Database has been closed';
            }
            db.close();
            closed = true;
            delete dbCache[name];
        };

        this.get = function (table, id) {
            if (closed) {
                throw 'Database has been closed';
            }
            var transaction = db.transaction(table),
                store = transaction.objectStore(table),
                deferred = Deferred();

            var req = store.get(id);
            req.onsuccess = function (e) {
                deferred.resolve(e.target.result);
            };
            transaction.onerror = function (e) {
                deferred.reject(e);
            };
            return deferred.promise();
        };

        this.query = function (table, index) {
            if (closed) {
                throw 'Database has been closed';
            }
            return new IndexQuery(table, db, index);
        };

        for (var i = 0, il = db.objectStoreNames.length; i < il; i++) {
            (function (storeName) {
                that[storeName] = {};
                for (var i in that) {
                    if (!hasOwn.call(that, i) || i === 'close') {
                        continue;
                    }
                    that[storeName][i] = function (i) {
                        return function () {
                            var args = [storeName].concat([].slice.call(arguments, 0));
                            return that[i].apply(that, args);
                        };
                    }(i);
                }
            })(db.objectStoreNames[i]);
        }
    };

    var IndexQuery = function (table, db, indexName) {
        var that = this;
        var modifyObj = false;

        var runQuery = function (type, args, cursorType, direction, limitRange, filters, mapper) {
            var transaction = db.transaction(table, modifyObj ? transactionModes.readwrite : transactionModes.readonly),
                store = transaction.objectStore(table),
                index = indexName ? store.index(indexName) : store,
                keyRange = type ? IDBKeyRange[type].apply(null, args) : null,
                results = [],
                deferred = Deferred(),
                indexArgs = [keyRange],
                limitRange = limitRange ? limitRange : null,
                filters = filters ? filters : [],
                counter = 0;

            if (cursorType !== 'count') {
                indexArgs.push(direction || 'next');
            };

            // create a function that will set in the modifyObj properties into
            // the passed record.
            var modifyKeys = modifyObj ? Object.keys(modifyObj) : false;
            var modifyRecord = function (record) {
                for (var i = 0; i < modifyKeys.length; i++) {
                    var key = modifyKeys[i];
                    var val = modifyObj[key];
                    if (val instanceof Function) val = val(record);
                    record[key] = val;
                }
                return record;
            };

            index[cursorType].apply(index, indexArgs).onsuccess = function (e) {
                var cursor = e.target.result;
                if (typeof cursor === typeof 0) {
                    results = cursor;
                } else if (cursor) {
                    if (limitRange !== null && limitRange[0] > counter) {
                        counter = limitRange[0];
                        cursor.advance(limitRange[0]);
                    } else if (limitRange !== null && counter >= limitRange[0] + limitRange[1]) {
                        //out of limit range... skip
                    } else {
                        var matchFilter = true;
                        var result = 'value' in cursor ? cursor.value : cursor.key;

                        filters.forEach(function (filter) {
                            if (!filter || !filter.length) {
                                //Invalid filter do nothing
                            } else if (filter.length === 2) {
                                matchFilter = result[filter[0]] === filter[1];
                            } else {
                                matchFilter = filter[0].apply(undefined, [result]);
                            }
                        });

                        if (matchFilter) {
                            counter++;
                            results.push(mapper(result));
                            // if we're doing a modify, run it now
                            if (modifyObj) {
                                result = modifyRecord(result);
                                cursor.update(result);
                            }
                        }
                        cursor.continue();
                    }
                }
            };

            transaction.oncomplete = function () {
                deferred.resolve(results);
            };
            transaction.onerror = function (e) {
                deferred.reject(e);
            };
            transaction.onabort = function (e) {
                deferred.reject(e);
            };
            return deferred.promise();
        };

        var Query = function (type, args) {
            var direction = 'next',
                cursorType = 'openCursor',
                filters = [],
                limitRange = null,
                mapper = defaultMapper,
                unique = false;

            var execute = function () {
                return runQuery(type, args, cursorType, unique ? direction + 'unique' : direction, limitRange, filters, mapper);
            };

            var limit = function () {
                limitRange = Array.prototype.slice.call(arguments, 0, 2);
                if (limitRange.length == 1) {
                    limitRange.unshift(0);
                }

                return {
                    execute: execute
                };
            };
            var count = function () {
                direction = null;
                cursorType = 'count';

                return {
                    execute: execute
                };
            };
            var keys = function () {
                cursorType = 'openKeyCursor';

                return {
                    desc: desc,
                    execute: execute,
                    filter: filter,
                    distinct: distinct,
                    map: map
                };
            };
            var filter = function () {
                filters.push(Array.prototype.slice.call(arguments, 0, 2));

                return {
                    keys: keys,
                    execute: execute,
                    filter: filter,
                    desc: desc,
                    distinct: distinct,
                    modify: modify,
                    limit: limit,
                    map: map
                };
            };
            var desc = function () {
                direction = 'prev';

                return {
                    keys: keys,
                    execute: execute,
                    filter: filter,
                    distinct: distinct,
                    modify: modify,
                    map: map
                };
            };
            var distinct = function () {
                unique = true;
                return {
                    keys: keys,
                    count: count,
                    execute: execute,
                    filter: filter,
                    desc: desc,
                    modify: modify,
                    map: map
                };
            };
            var modify = function (update) {
                modifyObj = update;
                return {
                    execute: execute
                };
            };
            var map = function (fn) {
                mapper = fn;

                return {
                    execute: execute,
                    count: count,
                    keys: keys,
                    filter: filter,
                    desc: desc,
                    distinct: distinct,
                    modify: modify,
                    limit: limit,
                    map: map
                };
            };

            return {
                execute: execute,
                count: count,
                keys: keys,
                filter: filter,
                desc: desc,
                distinct: distinct,
                modify: modify,
                limit: limit,
                map: map
            };
        };

        'only bound upperBound lowerBound'.split(' ').forEach(function (name) {
            that[name] = function () {
                return new Query(name, arguments);
            };
        });

        this.filter = function () {
            var query = new Query(null, null);
            return query.filter.apply(query, arguments);
        };

        this.all = function () {
            return this.filter();
        };
    };

    var createSchema = function (e, schema, db) {
        if (typeof schema === 'function') {
            schema = schema();
        }

        for (var tableName in schema) {
            var table = schema[tableName];
            var store;
            if (!hasOwn.call(schema, tableName) || db.objectStoreNames.contains(tableName)) {
                store = e.currentTarget.transaction.objectStore(tableName);
            } else {
                store = db.createObjectStore(tableName, table.key);
            }

            for (var indexKey in table.indexes) {
                var index = table.indexes[indexKey];
                store.createIndex(indexKey, index.key || indexKey, Object.keys(index).length ? index : { unique: false });
            }
        }
    };

    var open = function (e, server, version, schema) {
        var db = e.target.result;
        var s = new Server(db, server);
        var upgrade;

        var deferred = Deferred();
        deferred.resolve(s);
        dbCache[server] = db;

        return deferred.promise();
    };

    var dbCache = {};

    var db = {
        version: '0.9.0',
        open: function (options) {
            var request;

            var deferred = Deferred();

            if (dbCache[options.server]) {
                open({
                    target: {
                        result: dbCache[options.server]
                    }
                }, options.server, options.version, options.schema).done(deferred.resolve).fail(deferred.reject).progress(deferred.notify);
            } else {
                request = indexedDB.open(options.server, options.version);

                request.onsuccess = function (e) {
                    open(e, options.server, options.version, options.schema).done(deferred.resolve).fail(deferred.reject).progress(deferred.notify);
                };

                request.onupgradeneeded = function (e) {
                    createSchema(e, options.schema, e.target.result);
                };
                request.onerror = function (e) {
                    deferred.reject(e);
                };
            }

            return deferred.promise();
        }
    };

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = db;
    } else if (true) {
        !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
            return db;
        }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {
        window.db = db;
    }
})(window);

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./app/Resources/client/jsx/project/details.jsx");


/***/ })

},[0]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvcHJvamVjdC9kZXRhaWxzLmpzeCIsIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvcHJvamVjdC9kZXRhaWxzL2RldGFpbHMuanN4Iiwid2VicGFjazovLy8uL2FwcC9SZXNvdXJjZXMvY2xpZW50L2pzeC9wcm9qZWN0L2RldGFpbHMvbWFwcGluZy5qc3giLCJ3ZWJwYWNrOi8vLy4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L3Byb2plY3QvZGV0YWlscy9tZXRhZGF0YS5qc3giLCJ3ZWJwYWNrOi8vLy4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L3Byb2plY3QvZGV0YWlscy9waGluY2guanN4Iiwid2VicGFjazovLy8uL2FwcC9SZXNvdXJjZXMvY2xpZW50L2pzeC9wcm9qZWN0L2RldGFpbHMvdHJhaXQuanN4Iiwid2VicGFjazovLy8uL3dlYi9hc3NldHMvUGhpbmNoL2xpYi9kYi5qcyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiJCIsInJlYWR5IiwidGV4dCIsImJpb20iLCJpZCIsImNvbW1lbnQiLCJzaGFwZSIsIm5ueiIsInRvRml4ZWQiLCJvbiIsInZhbCIsImZvY3VzIiwiY2xpY2siLCJzYXZlQmlvbVRvREIiLCJleHBvcnRQcm9qZWN0QXNCaW9tIiwiZXhwb3J0UHNldWRvVGF4VGFibGUiLCJleHBvcnRUcmFpdENpdGF0aW9uc1RhYmxlIiwiYWRkTWV0YWRhdGFTYW1wbGUiLCJhZGRNZXRhZGF0YU9ic2VydmF0aW9uIiwiYXBwZW5kIiwiZ2V0TWV0YWRhdGFLZXlzIiwibWFwIiwidHJhbnNwb3NlIiwid3JpdGUiLCJ0aGVuIiwiYmlvbUpzb24iLCJ3ZWJzZXJ2aWNlVXJsIiwiUm91dGluZyIsImdlbmVyYXRlIiwiYWpheCIsImRhdGEiLCJkYnZlcnNpb24iLCJpbnRlcm5hbFByb2plY3RJZCIsIm1ldGhvZCIsInN1Y2Nlc3MiLCJsb2NhdGlvbiIsInJlbG9hZCIsImZhaWx1cmUiLCJjb25zb2xlIiwibG9nIiwid2luZG93IiwiYXNIZGY1IiwiY29udmVyc2lvblNlcnZlclVSTCIsImNvbnRlbnRUeXBlIiwiY29udmVyc2lvblNlcnZlciIsImJpb21Db250ZW50IiwiYmxvYiIsIkJsb2IiLCJ0eXBlIiwic2F2ZUFzIiwic2hvd01lc3NhZ2VEaWFsb2ciLCJ0YXgiLCJfIiwiY2xvbmVEZWVwIiwiZ2V0TWV0YWRhdGEiLCJkaW1lbnNpb24iLCJhdHRyaWJ1dGUiLCJoZWFkZXIiLCJuZXh0TGV2ZWwiLCJtYXgiLCJlbGVtIiwibGVuZ3RoIiwib3R1aWRzIiwicm93cyIsInIiLCJ2IiwiaSIsInVuc2hpZnQiLCJzbGljZSIsInRyYWl0IiwiT2JqZWN0Iiwia2V5cyIsIm1ldGFkYXRhIiwidHJhaXRWYWx1ZXMiLCJvdXQiLCJqb2luIiwiZW50cmllcyIsImVudHJ5IiwiZmVubmVjX2lkIiwiZ2V0IiwidHJhaXRUeXBlIiwidGMiLCJldmVudCIsImZpbGVzIiwidGFyZ2V0IiwiZnIiLCJGaWxlUmVhZGVyIiwib25sb2FkIiwiYWRkTWV0YWRhdGFUb0ZpbGUiLCJyZXN1bHQiLCJ1cGRhdGVQcm9qZWN0IiwicmVhZEFzVGV4dCIsInRvU3RyaW5nIiwiZXJyb3IiLCJjYWxsYmFjayIsImNzdkRhdGEiLCJQYXBhIiwicGFyc2UiLCJza2lwRW1wdHlMaW5lcyIsImVycm9ycyIsIm1lc3NhZ2UiLCJyb3ciLCJzYW1wbGVNZXRhZGF0YSIsIm1ldGFkYXRhS2V5cyIsImlkS2V5Iiwic3BsaWNlIiwia2V5IiwiZWFjaCIsInZhbHVlIiwiYWRkTWV0YWRhdGEiLCJpZHNGcm9tQmlvbSIsIm1hcHBpbmciLCJmZW5uZWNfaWRzIiwiQXJyYXkiLCJmaWxsIiwiZmVubmVjSWRzMnNjaW5hbWVzIiwiZ2V0U2NpbmFtZXMiLCJ2YWx1ZXMiLCJzY2luYW1lcyIsImlkc0Zyb21CaW9tTm90TnVsbENvdW50IiwiaWRzRnJvbUJpb21NYXBwZWRDb3VudCIsImlzQXJyYXkiLCJkZWZhdWx0VmFsdWUiLCJpZFN0cmluZyIsImdldElkU3RyaW5nRm9yTWV0aG9kIiwic2hvdyIsImUiLCJoaWRlIiwiaGFuZGxlTWFwcGluZ1Jlc3VsdCIsInNhbXBsZU9yZ2FuaXNtSURzIiwiZmlsdGVyIiwiZWxlbWVudCIsIm90dU9yZ2FuaXNtSURzIiwibWFwcGVkU2FtcGxlcyIsInBlcmNlbnRhZ2VNYXBwZWRTYW1wbGVzIiwibWFwcGVkT1RVcyIsInBlcmNlbnRhZ2VNYXBwZWRPVFVzIiwiY3NzIiwiYXR0ciIsIm1ldGhvZHMiLCJuY2JpX3RheG9ub215Iiwib3JnYW5pc21fbmFtZSIsIml1Y25fcmVkbGlzdCIsIkVPTCIsImFkZE9wdGlvblRvU2VsZWN0cGlja2VyIiwic2FtcGxlTWV0YWRhdGFLZXlzIiwib2JzZXJ2YXRpb25NZXRhZGF0YUtleXMiLCJzZWxlY3RwaWNrZXIiLCJjaGFuZ2UiLCJpZHMiLCJnZXRJZHNGb3JBdHRyaWJ1dGUiLCJ1bmlxX2lkcyIsInVuaXEiLCJnZXRXZWJzZXJ2aWNlVXJsRm9yTWV0aG9kIiwiZGIiLCJzdGF0dXMiLCJjb21wbGV0ZSIsIm9wdGlvbiIsInByb3AiLCJzdWJzdHIiLCJtZXRob2Qyc2VydmljZSIsImZsYXR0ZW4iLCJ4IiwibWFwcGluZ0lkcyIsImZlbm5lY0lkcyIsImlkSGVhZGVyIiwiY3N2IiwiaW5pdFRhYmxlIiwidGFibGVDb25maWciLCJvcmRlciIsImRvbSIsImJ1dHRvbnMiLCJzY3JvbGxYIiwiZ2V0VGFibGVEYXRhIiwiZGltTWV0YWRhdGEiLCJzdW0iLCJnZXREYXRhQ29sdW1uIiwiZ2V0RGF0YVJvdyIsIm0iLCJjb2x1bW5zIiwidGl0bGUiLCJzZXRUaW1lb3V0IiwiRGF0YVRhYmxlIiwiYXNzaWduIiwiYWRqdXN0SWZyYW1lSGVpZ2h0IiwiY29udGVudHMiLCJoZWlnaHQiLCJvcGVuIiwic2VydmVyIiwidmVyc2lvbiIsInNjaGVtYSIsImtleVBhdGgiLCJhdXRvSW5jcmVtZW50IiwiZG9uZSIsImJpb21Ub1N0b3JlIiwibmFtZSIsImJpb21TdHJpbmciLCJzaXplIiwiZCIsIkRhdGUiLCJkYXRlIiwiZ2V0VVRDRnVsbFllYXIiLCJnZXRVVENNb250aCIsImdldFVUQ0RhdGUiLCJnZXRVVENIb3VycyIsImdldFVUQ01pbnV0ZXMiLCJnZXRVVENTZWNvbmRzIiwiYWRkIiwiaXRlbSIsInBoaW5jaFByZXZpZXdQYXRoIiwiZ2V0QW5kU2hvd1RyYWl0cyIsInRyYWl0cyIsInRoaXNUcmFpdCIsImNvdW50IiwicmFuZ2UiLCJwdXNoIiwiaW5pdFRyYWl0c09mUHJvamVjdFRhYmxlIiwidGFibGVJZCIsImNvbHVtbkRlZnMiLCJ0YXJnZXRzIiwicmVuZGVyIiwiTWF0aCIsInJvdW5kIiwiZnVsbCIsImhyZWYiLCJpbmRleE9mIiwiYWRkVHJhaXRUb1Byb2plY3RUYWJsZUFjdGlvbiIsInRyYWl0VHlwZUlkIiwidXJsIiwidHJhaXRfZm9ybWF0IiwiY29uZGVuc2VOdW1lcmljYWxUcmFpdFZhbHVlcyIsImNvbmRlbnNlQ2F0ZWdvcmljYWxUcmFpdFZhbHVlcyIsImFkZFRyYWl0VG9Qcm9qZWN0IiwiY2l0YXRpb25zIiwicmVtb3ZlVHJhaXRGcm9tUHJvamVjdFRhYmxlQWN0aW9uIiwidHJhaXROYW1lIiwicmVtb3ZlVHJhaXRGcm9tUHJvamVjdCIsInVuZGVmaW5lZCIsImluZGV4ZWREQiIsIndlYmtpdEluZGV4ZWREQiIsIm1vekluZGV4ZWREQiIsIm9JbmRleGVkREIiLCJtc0luZGV4ZWREQiIsIklEQktleVJhbmdlIiwid2Via2l0SURCS2V5UmFuZ2UiLCJ0cmFuc2FjdGlvbk1vZGVzIiwicmVhZG9ubHkiLCJyZWFkd3JpdGUiLCJoYXNPd24iLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImRlZmF1bHRNYXBwZXIiLCJDYWxsYmFja0xpc3QiLCJzdGF0ZSIsImxpc3QiLCJleGVjIiwiY29udGV4dCIsImFyZ3MiLCJpbCIsImFwcGx5IiwiYXJndW1lbnRzIiwiZXhlY3V0ZSIsIkRlZmVycmVkIiwiZnVuYyIsImFjdGlvbnMiLCJkZWZlcnJlZCIsInByb21pc2UiLCJoYW5kbGVycyIsIm5ld0RlZmVyIiwiZm9yRWFjaCIsImFjdGlvbiIsImhhbmRsZXIiLCJyZXR1cm5lZCIsInJlc29sdmUiLCJmYWlsIiwicmVqZWN0IiwicHJvZ3Jlc3MiLCJub3RpZnkiLCJvYmoiLCJhY3Rpb25TdGF0ZSIsImNhbGwiLCJTZXJ2ZXIiLCJ0aGF0IiwiY2xvc2VkIiwidGFibGUiLCJyZWNvcmRzIiwidHJhbnNhY3Rpb24iLCJzdG9yZSIsIm9iamVjdFN0b3JlIiwicmVjb3JkIiwicmVxIiwib25zdWNjZXNzIiwic291cmNlIiwiZGVmaW5lUHJvcGVydHkiLCJlbnVtZXJhYmxlIiwib25jb21wbGV0ZSIsIm9uZXJyb3IiLCJvbmFib3J0IiwidXBkYXRlIiwicHV0IiwicmVtb3ZlIiwiZGVsZXRlIiwiY2xlYXIiLCJjbG9zZSIsImRiQ2FjaGUiLCJxdWVyeSIsImluZGV4IiwiSW5kZXhRdWVyeSIsIm9iamVjdFN0b3JlTmFtZXMiLCJzdG9yZU5hbWUiLCJjb25jYXQiLCJpbmRleE5hbWUiLCJtb2RpZnlPYmoiLCJydW5RdWVyeSIsImN1cnNvclR5cGUiLCJkaXJlY3Rpb24iLCJsaW1pdFJhbmdlIiwiZmlsdGVycyIsIm1hcHBlciIsImtleVJhbmdlIiwicmVzdWx0cyIsImluZGV4QXJncyIsImNvdW50ZXIiLCJtb2RpZnlLZXlzIiwibW9kaWZ5UmVjb3JkIiwiRnVuY3Rpb24iLCJjdXJzb3IiLCJhZHZhbmNlIiwibWF0Y2hGaWx0ZXIiLCJjb250aW51ZSIsIlF1ZXJ5IiwidW5pcXVlIiwibGltaXQiLCJkZXNjIiwiZGlzdGluY3QiLCJtb2RpZnkiLCJmbiIsInNwbGl0IiwiYWxsIiwiY3JlYXRlU2NoZW1hIiwidGFibGVOYW1lIiwiY29udGFpbnMiLCJjdXJyZW50VGFyZ2V0IiwiY3JlYXRlT2JqZWN0U3RvcmUiLCJpbmRleEtleSIsImluZGV4ZXMiLCJjcmVhdGVJbmRleCIsInMiLCJ1cGdyYWRlIiwib3B0aW9ucyIsInJlcXVlc3QiLCJvbnVwZ3JhZGVuZWVkZWQi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LENBQ1V3RSxTQUFTUSxPQURuQixFQUVLQyxJQUZMLENBRVVULFNBQVNVLE1BRm5CLEVBR0tDLFFBSEwsQ0FHY1gsU0FBU1ksTUFIdkI7QUFJSCxpQkFMRDs7QUFPQXlFLHdCQUFRQyxlQUFSLEdBQTBCLFVBQVdqTyxDQUFYLEVBQWU7QUFDckNxTixpQ0FBY3JOLENBQWQsRUFBa0IrTixRQUFRL0osTUFBMUIsRUFBbUNoRSxFQUFFMUMsTUFBRixDQUFTSyxNQUE1QztBQUNILGlCQUZEO0FBR0FxUSx3QkFBUXRELE9BQVIsR0FBa0IsVUFBVzFLLENBQVgsRUFBZTtBQUM3QjJJLDZCQUFTVSxNQUFULENBQWlCckosQ0FBakI7QUFDSCxpQkFGRDtBQUdIOztBQUVELG1CQUFPMkksU0FBU0MsT0FBVCxFQUFQO0FBQ0g7QUFuQ0ksS0FBVDs7QUFzQ0EsUUFBSSxPQUFPc0YsTUFBUCxLQUFrQixXQUFsQixJQUFpQyxPQUFPQSxPQUFPQyxPQUFkLEtBQTBCLFdBQS9ELEVBQTRFO0FBQ3hFRCxlQUFPQyxPQUFQLEdBQWlCdk0sRUFBakI7QUFDSCxLQUZELE1BRU8sSUFBSyxJQUFMLEVBQWtEO0FBQ3JEd00sUUFBQSxrQ0FBUSxZQUFXO0FBQUUsbUJBQU94TSxFQUFQO0FBQVksU0FBakM7QUFBQTtBQUNILEtBRk0sTUFFQTtBQUNIbEgsZUFBT2tILEVBQVAsR0FBWUEsRUFBWjtBQUNIO0FBQ0osQ0ExbEJELEVBMGxCSWxILE1BMWxCSixFIiwiZmlsZSI6InByb2plY3QvZGV0YWlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJy4vZGV0YWlscy9kZXRhaWxzLmpzeCcpXG5yZXF1aXJlKCcuL2RldGFpbHMvbWFwcGluZy5qc3gnKVxucmVxdWlyZSgnLi9kZXRhaWxzL21ldGFkYXRhLmpzeCcpXG5yZXF1aXJlKCcuL2RldGFpbHMvcGhpbmNoLmpzeCcpXG5yZXF1aXJlKCcuL2RldGFpbHMvdHJhaXQuanN4JylcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvcHJvamVjdC9kZXRhaWxzLmpzeCIsIi8qIGdsb2JhbCBkYnZlcnNpb24gKi9cbi8qIGdsb2JhbCBiaW9tICovXG4vKiBnbG9iYWwgXyAqL1xuLyogZ2xvYmFsICQgKi9cbi8qIGdsb2JhbCBpbnRlcm5hbFByb2plY3RJZCAqL1xuJCgnZG9jdW1lbnQnKS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgLy8gU2V0IGhlYWRlciBvZiBwYWdlIHRvIHByb2plY3QtaWRcbiAgICAkKCcucGFnZS1oZWFkZXInKS50ZXh0KGJpb20uaWQpO1xuXG4gICAgLy8gRmlsbCBvdmVydmlldyB0YWJsZSB3aXRoIHZhbHVlc1xuICAgICQoJyNwcm9qZWN0LW92ZXJ2aWV3LXRhYmxlLWlkJykudGV4dChiaW9tLmlkKTtcbiAgICAkKCcjcHJvamVjdC1vdmVydmlldy10YWJsZS1jb21tZW50JykudGV4dChiaW9tLmNvbW1lbnQpO1xuICAgICQoJyNwcm9qZWN0LW92ZXJ2aWV3LXRhYmxlLXJvd3MnKS50ZXh0KGJpb20uc2hhcGVbMF0pO1xuICAgICQoJyNwcm9qZWN0LW92ZXJ2aWV3LXRhYmxlLWNvbHMnKS50ZXh0KGJpb20uc2hhcGVbMV0pO1xuICAgICQoJyNwcm9qZWN0LW92ZXJ2aWV3LXRhYmxlLW5ueicpLnRleHQoYmlvbS5ubnogKyBcIiAoXCIgKyAoMTAwICogYmlvbS5ubnogLyAoYmlvbS5zaGFwZVswXSAqIGJpb20uc2hhcGVbMV0pKS50b0ZpeGVkKDIpICsgXCIlKVwiKTtcblxuICAgIC8vIFNldCBhY3Rpb24gaWYgZWRpdCBkaWFsb2cgaXMgc2hvd25cbiAgICAkKCcjZWRpdFByb2plY3REaWFsb2cnKS5vbignc2hvd24uYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoJyNlZGl0UHJvamVjdERpYWxvZ1Byb2plY3RJRCcpLnZhbChiaW9tLmlkKTtcbiAgICAgICAgJCgnI2VkaXRQcm9qZWN0RGlhbG9nQ29tbWVudCcpLnZhbChiaW9tLmNvbW1lbnQpO1xuICAgICAgICAkKCcjZWRpdFByb2plY3REaWFsb2dQcm9qZWN0SUQnKS5mb2N1cygpO1xuICAgIH0pO1xuXG4gICAgLy8gU2V0IGFjdGlvbiBpZiBlZGl0IGRpYWxvZyBpcyBzYXZlZFxuICAgICQoJyNlZGl0UHJvamVjdERpYWxvZ1NhdmVCdXR0b24nKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIGJpb20uaWQgPSAkKCcjZWRpdFByb2plY3REaWFsb2dQcm9qZWN0SUQnKS52YWwoKTtcbiAgICAgICAgYmlvbS5jb21tZW50ID0gJCgnI2VkaXRQcm9qZWN0RGlhbG9nQ29tbWVudCcpLnZhbCgpO1xuICAgICAgICBzYXZlQmlvbVRvREIoKTtcbiAgICB9KTtcblxuICAgICQoJyNwcm9qZWN0LWV4cG9ydC1hcy1iaW9tLXYxJykuY2xpY2soKCkgPT4ge1xuICAgICAgICBleHBvcnRQcm9qZWN0QXNCaW9tKGZhbHNlKTtcbiAgICB9KTtcblxuICAgICQoJyNwcm9qZWN0LWV4cG9ydC1hcy1iaW9tLXYyJykuY2xpY2soKCkgPT4ge1xuICAgICAgICBleHBvcnRQcm9qZWN0QXNCaW9tKHRydWUpO1xuICAgIH0pO1xuXG4gICAgJCgnI3Byb2plY3QtZXhwb3J0LXBzZXVkby10YXgtYmlvbScpLmNsaWNrKGV4cG9ydFBzZXVkb1RheFRhYmxlKTtcblxuICAgICQoJyNwcm9qZWN0LWV4cG9ydC10cmFpdC1jaXRhdGlvbi1vdHVzJykuY2xpY2soKCk9PmV4cG9ydFRyYWl0Q2l0YXRpb25zVGFibGUoJ3Jvd3MnKSk7XG4gICAgJCgnI3Byb2plY3QtZXhwb3J0LXRyYWl0LWNpdGF0aW9uLXNhbXBsZXMnKS5jbGljaygoKT0+ZXhwb3J0VHJhaXRDaXRhdGlvbnNUYWJsZSgnY29sdW1ucycpKTtcblxuICAgICQoJyNwcm9qZWN0LWFkZC1tZXRhZGF0YS1zYW1wbGUnKS5vbihcImNoYW5nZVwiLCBhZGRNZXRhZGF0YVNhbXBsZSk7XG4gICAgJCgnI3Byb2plY3QtYWRkLW1ldGFkYXRhLW9ic2VydmF0aW9uJykub24oXCJjaGFuZ2VcIiwgYWRkTWV0YWRhdGFPYnNlcnZhdGlvbik7XG5cbiAgICAkKCcjbWV0YWRhdGEtb3ZlcnZpZXctc2FtcGxlJykuYXBwZW5kKGdldE1ldGFkYXRhS2V5cyhiaW9tLCAnY29sdW1ucycpLm1hcCgodGV4dCkgPT4gJChcIjxsaT5cIikudGV4dCh0ZXh0KSkpO1xuICAgICQoJyNtZXRhZGF0YS1vdmVydmlldy1vYnNlcnZhdGlvbicpLmFwcGVuZChnZXRNZXRhZGF0YUtleXMoYmlvbSwgJ3Jvd3MnKS5tYXAoKHRleHQpID0+ICQoXCI8bGk+XCIpLnRleHQodGV4dCkpKTtcblxuICAgICQoJyNwcm9qZWN0LXRyYW5zcG9zZScpLmNsaWNrKCgpID0+IHtcbiAgICAgICAgYmlvbS50cmFuc3Bvc2UoKTtcbiAgICAgICAgc2F2ZUJpb21Ub0RCKCk7XG4gICAgfSk7XG59KTtcblxuLyoqXG4gKiBTYXZlcyB0aGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgZ2xvYmFsIGJpb20gdmFyaWFibGUgdG8gdGhlIHBvc3RncmVzIGRhdGFiYXNlXG4gKi9cbmZ1bmN0aW9uIHNhdmVCaW9tVG9EQigpIHtcbiAgICBiaW9tLndyaXRlKCkudGhlbihmdW5jdGlvbiAoYmlvbUpzb24pIHtcbiAgICAgICAgdmFyIHdlYnNlcnZpY2VVcmwgPSBSb3V0aW5nLmdlbmVyYXRlKCdhcGknLCB7J25hbWVzcGFjZSc6ICdlZGl0JywgJ2NsYXNzbmFtZSc6ICd1cGRhdGVQcm9qZWN0J30pO1xuICAgICAgICAkLmFqYXgod2Vic2VydmljZVVybCwge1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIFwiZGJ2ZXJzaW9uXCI6IGRidmVyc2lvbixcbiAgICAgICAgICAgICAgICBcInByb2plY3RfaWRcIjogaW50ZXJuYWxQcm9qZWN0SWQsXG4gICAgICAgICAgICAgICAgXCJiaW9tXCI6IGJpb21Kc29uXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSwgZnVuY3Rpb24gKGZhaWx1cmUpIHtcbiAgICAgICAgY29uc29sZS5sb2coZmFpbHVyZSk7XG4gICAgfSk7XG59XG5cbi8vIGV4cG9ydCBnbG9iYWxseVxud2luZG93LnNhdmVCaW9tVG9EQiA9IHNhdmVCaW9tVG9EQjtcblxuLyoqXG4gKiBPcGVucyBhIGZpbGUgZG93bmxvYWQgZGlhbG9nIG9mIHRoZSBjdXJyZW50IHByb2plY3QgaW4gYmlvbSBmb3JtYXRcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYXNIZGY1XG4gKi9cbmZ1bmN0aW9uIGV4cG9ydFByb2plY3RBc0Jpb20oYXNIZGY1KSB7XG4gICAgbGV0IGNvbnZlcnNpb25TZXJ2ZXJVUkwgPSBSb3V0aW5nLmdlbmVyYXRlKCdiaW9tY3NfY29udmVydCcpO1xuICAgIGxldCBjb250ZW50VHlwZSA9IGFzSGRmNSA/IFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCIgOiBcInRleHQvcGxhaW5cIjtcbiAgICBiaW9tLndyaXRlKHtjb252ZXJzaW9uU2VydmVyOiBjb252ZXJzaW9uU2VydmVyVVJMLCBhc0hkZjU6IGFzSGRmNX0pLnRoZW4oZnVuY3Rpb24gKGJpb21Db250ZW50KSB7XG4gICAgICAgIHZhciBibG9iID0gbmV3IEJsb2IoW2Jpb21Db250ZW50XSwge3R5cGU6IGNvbnRlbnRUeXBlfSk7XG4gICAgICAgIHNhdmVBcyhibG9iLCBiaW9tLmlkK1wiLmJpb21cIik7XG4gICAgfSwgZnVuY3Rpb24gKGZhaWx1cmUpIHtcbiAgICAgICAgc2hvd01lc3NhZ2VEaWFsb2coZmFpbHVyZStcIlwiLCAnZGFuZ2VyJyk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogT3BlbnMgYSBmaWxlIGRvd25sb2FkIGRpYWxvZyBvZiB0aGUgY3VycmVudCBwcm9qZWN0IGluIHRzdiBmb3JtYXQgKHBzZXVkbyB0YXhvbm9teSlcbiAqL1xuZnVuY3Rpb24gZXhwb3J0UHNldWRvVGF4VGFibGUoKSB7XG4gICAgbGV0IGNvbnRlbnRUeXBlID0gXCJ0ZXh0L3BsYWluXCI7XG4gICAgbGV0IHRheCA9IF8uY2xvbmVEZWVwKGJpb20uZ2V0TWV0YWRhdGEoe2RpbWVuc2lvbjogJ3Jvd3MnLCBhdHRyaWJ1dGU6ICd0YXhvbm9teSd9KSk7XG4gICAgbGV0IGhlYWRlciA9IFsnT1RVSUQnLCAna2luZ2RvbScsICdwaHlsdW0nLCAnY2xhc3MnLCAnb3JkZXInLCAnZmFtaWx5JywgJ2dlbnVzJywgJ3NwZWNpZXMnXTtcbiAgICBsZXQgbmV4dExldmVsID0gXy5tYXgodGF4Lm1hcChlbGVtID0+IGVsZW0ubGVuZ3RoKSk7XG4gICAgbGV0IG90dWlkcyA9IGJpb20ucm93cy5tYXAociA9PiByLmlkKTtcbiAgICB0YXgubWFwKCh2LGkpID0+IHYudW5zaGlmdChvdHVpZHNbaV0pKTtcbiAgICBuZXh0TGV2ZWwrKztcbiAgICBoZWFkZXIgPSBoZWFkZXIuc2xpY2UoMCwgbmV4dExldmVsKTtcbiAgICBmb3IobGV0IHRyYWl0IG9mIE9iamVjdC5rZXlzKGJpb20ucm93c1swXS5tZXRhZGF0YSkpe1xuICAgICAgICBpZih0cmFpdCA9PT0gJ3RheG9ub215Jyl7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgdHJhaXRWYWx1ZXMgPSBiaW9tLmdldE1ldGFkYXRhKHtkaW1lbnNpb246ICdyb3dzJywgYXR0cmlidXRlOiB0cmFpdH0pO1xuICAgICAgICBoZWFkZXJbbmV4dExldmVsXSA9IHRyYWl0O1xuICAgICAgICB0YXgubWFwKCh2LGkpID0+IHZbbmV4dExldmVsXSA9IHRyYWl0VmFsdWVzW2ldKTtcbiAgICAgICAgbmV4dExldmVsKys7XG4gICAgfVxuICAgIGxldCBvdXQgPSBfLmpvaW4oaGVhZGVyLCBcIlxcdFwiKTtcbiAgICBvdXQgKz0gXCJcXG5cIjtcbiAgICBvdXQgKz0gXy5qb2luKHRheC5tYXAodiA9PiBfLmpvaW4odixcIlxcdFwiKSksIFwiXFxuXCIpO1xuICAgIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbb3V0XSwge3R5cGU6IGNvbnRlbnRUeXBlfSk7XG4gICAgc2F2ZUFzKGJsb2IsIGJpb20uaWQrXCIudHN2XCIpO1xufVxuXG4vKipcbiAqIE9wZW5zIGEgZmlsZSBkb3dubG9hZCBkaWFsb2cgb2YgYWxsIHRyYWl0IGNpdGF0aW9ucyBmb3IgdGhpcyBwcm9qZWN0XG4gKi9cbmZ1bmN0aW9uIGV4cG9ydFRyYWl0Q2l0YXRpb25zVGFibGUoZGltZW5zaW9uKSB7XG4gICAgY29uc3QgY29udGVudFR5cGUgPSBcInRleHQvcGxhaW5cIjtcbiAgICBsZXQgb3V0ID0gXy5qb2luKFsoZGltZW5zaW9uPT09XCJyb3dzXCIgPyAnI09UVUlkJyA6ICcjU2FtcGxlSWQnKSwgJ2Zlbm5lY19pZCcsICd0cmFpdFR5cGUnLCAnY2l0YXRpb24nLCAndmFsdWUnXSwgXCJcXHRcIikrXCJcXG5cIjtcbiAgICBsZXQgZW50cmllcyA9IGJpb21bZGltZW5zaW9uXVxuICAgIGZvcihsZXQgZW50cnkgb2YgZW50cmllcyl7XG4gICAgICAgIGxldCBpZCA9IGVudHJ5LmlkO1xuICAgICAgICBsZXQgZmVubmVjX2lkID0gXy5nZXQoZW50cnksIFsnbWV0YWRhdGEnLCAnZmVubmVjJywgZGJ2ZXJzaW9uLCAnZmVubmVjX2lkJ10pIHx8ICcnO1xuICAgICAgICBmb3IobGV0IHRyYWl0VHlwZSBvZiBPYmplY3Qua2V5cyhfLmdldChlbnRyeSwgWydtZXRhZGF0YScsICd0cmFpdF9jaXRhdGlvbnMnXSl8fHt9KSl7XG4gICAgICAgICAgICBmb3IobGV0IHRjIG9mIF8uZ2V0KGVudHJ5LCBbJ21ldGFkYXRhJywgJ3RyYWl0X2NpdGF0aW9ucycsIHRyYWl0VHlwZV0pKXtcbiAgICAgICAgICAgICAgICBvdXQgKz0gXy5qb2luKFtpZCwgZmVubmVjX2lkLCB0cmFpdFR5cGUsIHRjWydjaXRhdGlvbiddLCB0Y1sndmFsdWUnXV0sIFwiXFx0XCIpK1wiXFxuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgYmxvYiA9IG5ldyBCbG9iKFtvdXRdLCB7dHlwZTogY29udGVudFR5cGV9KTtcbiAgICBzYXZlQXMoYmxvYiwgYmlvbS5pZCsoZGltZW5zaW9uPT09XCJyb3dzXCIgPyBcIi5PVFVcIiA6IFwiLnNhbXBsZVwiKStcIi5jaXRhdGlvbnMudHN2XCIpO1xufVxuXG4vKipcbiAqIEFkZCBzYW1wbGUgbWV0YWRhdGEgZnJvbSBzZWxlY3RlZCBmaWxlc1xuICogQHBhcmFtIHtldmVudH0gZXZlbnRcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5mdW5jdGlvbiBhZGRNZXRhZGF0YVNhbXBsZShldmVudClcbntcbiAgICBsZXQgZmlsZXMgPSBldmVudC50YXJnZXQuZmlsZXM7XG4gICAgbGV0IGZyID0gbmV3IEZpbGVSZWFkZXIoKVxuICAgIGZyLm9ubG9hZCA9ICgpID0+IGFkZE1ldGFkYXRhVG9GaWxlKGZyLnJlc3VsdCwgdXBkYXRlUHJvamVjdCwgJ2NvbHVtbnMnKVxuICAgIGZyLnJlYWRBc1RleHQoZmlsZXNbMF0pO1xufVxuXG4vKipcbiAqIEFkZCBvYnNlcnZhdGlvbiBtZXRhZGF0YSBmcm9tIHNlbGVjdGVkIGZpbGVzXG4gKiBAcGFyYW0ge2V2ZW50fSBldmVudFxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmZ1bmN0aW9uIGFkZE1ldGFkYXRhT2JzZXJ2YXRpb24oZXZlbnQpXG57XG4gICAgbGV0IGZpbGVzID0gZXZlbnQudGFyZ2V0LmZpbGVzO1xuICAgIGxldCBmciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgICBmci5vbmxvYWQgPSAoKSA9PiBhZGRNZXRhZGF0YVRvRmlsZShmci5yZXN1bHQsIHVwZGF0ZVByb2plY3QsICdyb3dzJylcbiAgICBmci5yZWFkQXNUZXh0KGZpbGVzWzBdKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlUHJvamVjdCgpIHtcbiAgICBsZXQgd2Vic2VydmljZVVybCA9IFJvdXRpbmcuZ2VuZXJhdGUoJ2FwaScsIHsnbmFtZXNwYWNlJzogJ2VkaXQnLCAnY2xhc3NuYW1lJzogJ3VwZGF0ZVByb2plY3QnfSk7XG4gICAgJC5hamF4KHdlYnNlcnZpY2VVcmwsIHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgXCJkYnZlcnNpb25cIjogZGJ2ZXJzaW9uLFxuICAgICAgICAgICAgXCJwcm9qZWN0X2lkXCI6IGludGVybmFsUHJvamVjdElkLFxuICAgICAgICAgICAgXCJiaW9tXCI6IGJpb20udG9TdHJpbmcoKVxuICAgICAgICB9LFxuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICBzdWNjZXNzOiAoKSA9PiBzaG93TWVzc2FnZURpYWxvZygnU3VjY2Vzc2Z1bGx5IGFkZGVkIG1ldGFkYXRhLicsICdzdWNjZXNzJyksXG4gICAgICAgIGVycm9yOiAoZXJyb3IpID0+IHNob3dNZXNzYWdlRGlhbG9nKGVycm9yLCAnZGFuZ2VyJylcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBBZGQgc2FtcGxlIG1ldGFkYXRhIGNvbnRlbnQgdG8gZmlsZVxuICogQHBhcmFtIHtTdHJpbmd9IHJlc3VsdFxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEBwYXJhbSB7U3RyaW5nfSBkaW1lbnNpb25cbiAqL1xuZnVuY3Rpb24gYWRkTWV0YWRhdGFUb0ZpbGUocmVzdWx0LCBjYWxsYmFjaywgZGltZW5zaW9uPSdjb2x1bW5zJyl7XG4gICAgbGV0IGNzdkRhdGEgPSBQYXBhLnBhcnNlKHJlc3VsdCwge2hlYWRlcjogdHJ1ZSwgc2tpcEVtcHR5TGluZXM6IHRydWV9KVxuICAgIGlmKGNzdkRhdGEuZXJyb3JzLmxlbmd0aCA+IDApe1xuICAgICAgICBzaG93TWVzc2FnZURpYWxvZyhjc3ZEYXRhLmVycm9yc1swXS5tZXNzYWdlKycgbGluZTogJytjc3ZEYXRhLmVycm9yc1swXS5yb3csICdkYW5nZXInKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZihjc3ZEYXRhLmRhdGEubGVuZ3RoID09PSAwKXtcbiAgICAgICAgc2hvd01lc3NhZ2VEaWFsb2coXCJDb3VsZCBub3QgcGFyc2UgZmlsZS4gTm8gZGF0YSBmb3VuZC5cIiwgJ2RhbmdlcicpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBzYW1wbGVNZXRhZGF0YSA9IHt9XG4gICAgbGV0IG1ldGFkYXRhS2V5cyA9IE9iamVjdC5rZXlzKGNzdkRhdGEuZGF0YVswXSk7XG4gICAgbGV0IGlkS2V5ID0gbWV0YWRhdGFLZXlzLnNwbGljZSgwLDEpWzBdO1xuICAgIGZvcihsZXQga2V5IG9mIG1ldGFkYXRhS2V5cyl7XG4gICAgICAgIHNhbXBsZU1ldGFkYXRhW2tleV0gPSB7fVxuICAgIH1cbiAgICBmb3IobGV0IHJvdyBvZiBjc3ZEYXRhLmRhdGEpe1xuICAgICAgICAkLmVhY2gocm93LCAoa2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgaWYoa2V5ICE9PSBpZEtleSl7XG4gICAgICAgICAgICAgICAgc2FtcGxlTWV0YWRhdGFba2V5XVtyb3dbaWRLZXldXSA9IHZhbHVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuICAgICQuZWFjaChzYW1wbGVNZXRhZGF0YSwgKGtleSx2YWx1ZSk9PntcbiAgICAgICAgYmlvbS5hZGRNZXRhZGF0YSh7J2RpbWVuc2lvbic6IGRpbWVuc2lvbiwgJ2F0dHJpYnV0ZSc6IGtleSwgJ3ZhbHVlcyc6IHZhbHVlfSlcbiAgICB9KVxuICAgIGNhbGxiYWNrKCk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvcHJvamVjdC9kZXRhaWxzL2RldGFpbHMuanN4IiwiLyogZ2xvYmFsIGRidmVyc2lvbiAqL1xuLyogZ2xvYmFsIGJpb20gKi9cbi8qIGdsb2JhbCBfICovXG5cbiQoJ2RvY3VtZW50JykucmVhZHkoKCkgPT4ge1xuICAgIC8vIENhbGN1bGF0ZSB2YWx1ZXMgZm9yIG1hcHBpbmcgb3ZlcnZpZXcgdGFibGVcbiAgICBsZXQgc2FtcGxlT3JnYW5pc21JRHMgPSBiaW9tLmdldE1ldGFkYXRhKHtkaW1lbnNpb246ICdjb2x1bW5zJywgYXR0cmlidXRlOiBbJ2Zlbm5lYycsIGRidmVyc2lvbiwgJ2Zlbm5lY19pZCddfSkuZmlsdGVyKGVsZW1lbnQgPT4gZWxlbWVudCAhPT0gbnVsbCk7XG4gICAgbGV0IG90dU9yZ2FuaXNtSURzID0gYmlvbS5nZXRNZXRhZGF0YSh7ZGltZW5zaW9uOiAncm93cycsIGF0dHJpYnV0ZTogWydmZW5uZWMnLCBkYnZlcnNpb24sICdmZW5uZWNfaWQnXX0pLmZpbHRlcihlbGVtZW50ID0+IGVsZW1lbnQgIT09IG51bGwpO1xuICAgIHZhciBtYXBwZWRTYW1wbGVzID0gc2FtcGxlT3JnYW5pc21JRHMubGVuZ3RoO1xuICAgIHZhciBwZXJjZW50YWdlTWFwcGVkU2FtcGxlcyA9IDEwMCAqIG1hcHBlZFNhbXBsZXMgLyBiaW9tLnNoYXBlWzFdO1xuICAgIHZhciBtYXBwZWRPVFVzID0gb3R1T3JnYW5pc21JRHMubGVuZ3RoO1xuICAgIHZhciBwZXJjZW50YWdlTWFwcGVkT1RVcyA9IDEwMCAqIG1hcHBlZE9UVXMgLyBiaW9tLnNoYXBlWzBdO1xuXG4gICAgLy8gQWRkIHZhbHVlcyB0byBtYXBwaW5nIG92ZXJ2aWV3IHRhYmxlXG4gICAgJCgnI21hcHBpbmctb3R1JykudGV4dChtYXBwZWRPVFVzKTtcbiAgICAkKCcjcHJvZ3Jlc3MtYmFyLW1hcHBpbmctb3R1JykuY3NzKCd3aWR0aCcsIHBlcmNlbnRhZ2VNYXBwZWRPVFVzICsgJyUnKS5hdHRyKCdhcmlhLXZhbHVlbm93JywgcGVyY2VudGFnZU1hcHBlZE9UVXMpO1xuICAgICQoJyNwcm9ncmVzcy1iYXItbWFwcGluZy1vdHUnKS50ZXh0KHBlcmNlbnRhZ2VNYXBwZWRPVFVzLnRvRml4ZWQoMCkgKyAnJScpO1xuICAgICQoJyNtYXBwaW5nLXNhbXBsZScpLnRleHQobWFwcGVkU2FtcGxlcyk7XG4gICAgJCgnI3Byb2dyZXNzLWJhci1tYXBwaW5nLXNhbXBsZScpLmNzcygnd2lkdGgnLCBwZXJjZW50YWdlTWFwcGVkU2FtcGxlcyArICclJykuYXR0cignYXJpYS12YWx1ZW5vdycsIHBlcmNlbnRhZ2VNYXBwZWRTYW1wbGVzKTtcbiAgICAkKCcjcHJvZ3Jlc3MtYmFyLW1hcHBpbmctc2FtcGxlJykudGV4dChwZXJjZW50YWdlTWFwcGVkU2FtcGxlcy50b0ZpeGVkKDApICsgJyUnKTtcblxuICAgIGxldCBtZXRob2RzID0ge25jYmlfdGF4b25vbXk6IFwiTkNCSSB0YXhpZFwiLCBvcmdhbmlzbV9uYW1lOiBcIlNjaWVudGlmaWMgbmFtZVwiLCBpdWNuX3JlZGxpc3Q6IFwiSVVDTiBpZFwiLCBFT0w6IFwiRU9MIGlkXCJ9O1xuICAgICQuZWFjaChtZXRob2RzLCAoa2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgICBhZGRPcHRpb25Ub1NlbGVjdHBpY2tlcihrZXksIHZhbHVlLCAnbWFwcGluZy1tZXRob2Qtc2VsZWN0Jyk7XG4gICAgfSlcblxuICAgIGxldCBzYW1wbGVNZXRhZGF0YUtleXMgPSBnZXRNZXRhZGF0YUtleXMoYmlvbSwgJ2NvbHVtbnMnKTtcbiAgICBhZGRPcHRpb25Ub1NlbGVjdHBpY2tlcignSUQnLCAnSUQnLCAnbWFwcGluZy1tZXRhZGF0YS1zYW1wbGUtc2VsZWN0JylcbiAgICAkLmVhY2goc2FtcGxlTWV0YWRhdGFLZXlzLCAoa2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgICBhZGRPcHRpb25Ub1NlbGVjdHBpY2tlcignbWQ6Jyt2YWx1ZSwgdmFsdWUsICdtYXBwaW5nLW1ldGFkYXRhLXNhbXBsZS1zZWxlY3QnKVxuICAgIH0pXG5cbiAgICBsZXQgb2JzZXJ2YXRpb25NZXRhZGF0YUtleXMgPSBnZXRNZXRhZGF0YUtleXMoYmlvbSwgJ3Jvd3MnKTtcbiAgICBhZGRPcHRpb25Ub1NlbGVjdHBpY2tlcignSUQnLCAnSUQnLCAnbWFwcGluZy1tZXRhZGF0YS1vYnNlcnZhdGlvbi1zZWxlY3QnKVxuICAgICQuZWFjaChvYnNlcnZhdGlvbk1ldGFkYXRhS2V5cywgKGtleSwgdmFsdWUpID0+IHtcbiAgICAgICAgYWRkT3B0aW9uVG9TZWxlY3RwaWNrZXIoJ21kOicrdmFsdWUsIHZhbHVlLCAnbWFwcGluZy1tZXRhZGF0YS1vYnNlcnZhdGlvbi1zZWxlY3QnKVxuICAgIH0pXG5cbiAgICAkKCcjbWFwcGluZy1kaW1lbnNpb24tc2VsZWN0Jykub24oJ2NoYW5nZScsICgpID0+IHtcbiAgICAgICAgaWYoJCgnI21hcHBpbmctZGltZW5zaW9uLXNlbGVjdCcpLnZhbCgpID09PSAncm93cycpe1xuICAgICAgICAgICAgJCgnI21hcHBpbmctbWV0YWRhdGEtc2FtcGxlLXNlbGVjdCcpLnNlbGVjdHBpY2tlcignaGlkZScpO1xuICAgICAgICAgICAgJCgnI21hcHBpbmctbWV0YWRhdGEtb2JzZXJ2YXRpb24tc2VsZWN0Jykuc2VsZWN0cGlja2VyKCdzaG93Jyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKCcjbWFwcGluZy1tZXRhZGF0YS1zYW1wbGUtc2VsZWN0Jykuc2VsZWN0cGlja2VyKCdzaG93Jyk7XG4gICAgICAgICAgICAkKCcjbWFwcGluZy1tZXRhZGF0YS1vYnNlcnZhdGlvbi1zZWxlY3QnKS5zZWxlY3RwaWNrZXIoJ2hpZGUnKTtcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAkKCcuc2VsZWN0cGlja2VyJykuc2VsZWN0cGlja2VyKCdyZWZyZXNoJylcbiAgICAkKCcjbWFwcGluZy1kaW1lbnNpb24tc2VsZWN0JykuY2hhbmdlKCk7XG5cbiAgICAvLyBBZGQgc2VtaS1nbG9iYWwgZGltZW5zaW9uIHZhcmlhYmxlIChzdG9yZXMgbGFzdCBtYXBwZWQgZGltZW5zaW9uKVxuICAgIHZhciBkaW1lbnNpb24gPSAncm93cyc7XG4gICAgdmFyIG1ldGhvZCA9ICduY2JpX3RheG9ub215JztcbiAgICB2YXIgYXR0cmlidXRlID0gJyc7XG5cbiAgICAvLyBTZXQgYWN0aW9uIGZvciBjbGljayBvbiBtYXBwaW5nIFwiR09cIiBidXR0b25cbiAgICAkKCcjbWFwcGluZy1hY3Rpb24tYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBkaW1lbnNpb24gPSAkKCcjbWFwcGluZy1kaW1lbnNpb24tc2VsZWN0JykudmFsKCk7XG4gICAgICAgIG1ldGhvZCA9ICQoJyNtYXBwaW5nLW1ldGhvZC1zZWxlY3QnKS52YWwoKTtcbiAgICAgICAgaWYoZGltZW5zaW9uID09PSAncm93cycpe1xuICAgICAgICAgICAgYXR0cmlidXRlID0gJCgnI21hcHBpbmctbWV0YWRhdGEtb2JzZXJ2YXRpb24tc2VsZWN0JykudmFsKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhdHRyaWJ1dGUgPSAkKCcjbWFwcGluZy1tZXRhZGF0YS1zYW1wbGUtc2VsZWN0JykudmFsKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGlkcyA9IGdldElkc0ZvckF0dHJpYnV0ZShkaW1lbnNpb24sIGF0dHJpYnV0ZSk7XG4gICAgICAgIGxldCB1bmlxX2lkcyA9IGlkcy5maWx0ZXIodmFsdWUgPT4gdmFsdWUgIT09IG51bGwpO1xuICAgICAgICB1bmlxX2lkcyA9IF8udW5pcSh1bmlxX2lkcyk7XG4gICAgICAgICQoJyNtYXBwaW5nLWFjdGlvbi1idXN5LWluZGljYXRvcicpLnNob3coKTtcbiAgICAgICAgJCgnI21hcHBpbmctcmVzdWx0cy1zZWN0aW9uJykuaGlkZSgpO1xuICAgICAgICBpZiAodW5pcV9pZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBoYW5kbGVNYXBwaW5nUmVzdWx0KGRpbWVuc2lvbiwgaWRzLCBbXSwgbWV0aG9kKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciB3ZWJzZXJ2aWNlVXJsID0gZ2V0V2Vic2VydmljZVVybEZvck1ldGhvZChtZXRob2QpO1xuICAgICAgICAgICAgJC5hamF4KHdlYnNlcnZpY2VVcmwsIHtcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGRidmVyc2lvbjogZGJ2ZXJzaW9uLFxuICAgICAgICAgICAgICAgICAgICBpZHM6IHVuaXFfaWRzLFxuICAgICAgICAgICAgICAgICAgICBkYjogbWV0aG9kXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVNYXBwaW5nUmVzdWx0KGRpbWVuc2lvbiwgaWRzLCBkYXRhLCBtZXRob2QpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChlcnJvciwgc3RhdHVzLCB0ZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIHNob3dNZXNzYWdlRGlhbG9nKCdUaGVyZSB3YXMgYSBtYXBwaW5nIGVycm9yOiAnK3RleHQsICdkYW5nZXInKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY29tcGxldGU6ICgpID0+IHskKCcjbWFwcGluZy1hY3Rpb24tYnVzeS1pbmRpY2F0b3InKS5oaWRlKCk7fVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGFkZE9wdGlvblRvU2VsZWN0cGlja2VyKHZhbHVlLCB0ZXh0LCBpZCkge1xuICAgICAgICBsZXQgb3B0aW9uID0gJCgnPG9wdGlvbj4nKS5wcm9wKCd2YWx1ZScsIHZhbHVlKS50ZXh0KHRleHQpXG4gICAgICAgICQoJyMnK2lkKS5hcHBlbmQob3B0aW9uKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGFycmF5IHdpdGggc2VhcmNoIGlkIGZvciB0aGUgcmVzcGVjdGl2ZSBtZXRob2QgaW4gdGhlIGdpdmVuIGRpbWVuc2lvblxuICAgICAqIEBwYXJhbSBkaW1lbnNpb25cbiAgICAgKiBAcGFyYW0gYXR0cmlidXRlXG4gICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0SWRzRm9yQXR0cmlidXRlKGRpbWVuc2lvbiwgYXR0cmlidXRlKSB7XG4gICAgICAgIGxldCBpZHMgPSBbXTtcbiAgICAgICAgaWYoYXR0cmlidXRlLnN1YnN0cigwLDMpID09PSAnbWQ6Jyl7XG4gICAgICAgICAgICBpZHMgPSBiaW9tLmdldE1ldGFkYXRhKHtkaW1lbnNpb246IGRpbWVuc2lvbiwgYXR0cmlidXRlOiBhdHRyaWJ1dGUuc3Vic3RyKDMpfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZHMgPSBiaW9tW2RpbWVuc2lvbl0ubWFwKChlbGVtZW50KSA9PiBlbGVtZW50LmlkKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaWRzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIHdlYnNlcnZpY2VVcmwgZm9yIHRoZSBnaXZlbiBtYXBwaW5nIG1ldGhvZFxuICAgICAqIEBwYXJhbSBtZXRob2RcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0V2Vic2VydmljZVVybEZvck1ldGhvZChtZXRob2QpIHtcbiAgICAgICAgbGV0IG1ldGhvZDJzZXJ2aWNlID0ge1xuICAgICAgICAgICAgJ25jYmlfdGF4b25vbXknOiAnYnlEYnhyZWZJZCcsXG4gICAgICAgICAgICAnRU9MJzogJ2J5RGJ4cmVmSWQnLFxuICAgICAgICAgICAgJ2l1Y25fcmVkbGlzdCc6ICdieURieHJlZklkJyxcbiAgICAgICAgICAgICdvcmdhbmlzbV9uYW1lJzogJ2J5T3JnYW5pc21OYW1lJ1xuICAgICAgICB9O1xuICAgICAgICBsZXQgd2Vic2VydmljZVVybCA9IFJvdXRpbmcuZ2VuZXJhdGUoJ2FwaScsIHsnbmFtZXNwYWNlJzogJ21hcHBpbmcnLCAnY2xhc3NuYW1lJzogbWV0aG9kMnNlcnZpY2VbbWV0aG9kXX0pO1xuICAgICAgICByZXR1cm4gd2Vic2VydmljZVVybDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIGZvciB0aGUgSURzIHVzZWQgZm9yIG1hcHBpbmcgaW4gdGhlIGNob3NlbiBtZXRob2RcbiAgICAgKiBAcGFyYW0gbWV0aG9kXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldElkU3RyaW5nRm9yTWV0aG9kKG1ldGhvZCkge1xuICAgICAgICByZXR1cm4gbWV0aG9kc1ttZXRob2RdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSB0aGUgcmVzdWx0cyBjb21wb25lbnQgZnJvbSB0aGUgcmV0dXJuZWQgbWFwcGluZyBhbmQgc3RvcmUgcmVzdWx0IGluIGdsb2JhbCBiaW9tIG9iamVjdFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBkaW1lbnNpb25cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBpZHNGcm9tQmlvbSB0aG9zZSBhcmUgdGhlIGlkcyB1c2VkIGZvciBtYXBwaW5nIGluIHRoZSBvcmRlciB0aGV5IGFwcGVhciBpbiB0aGUgYmlvbSBmaWxlXG4gICAgICogQHBhcmFtIHtBcnJheX0gbWFwcGluZyBmcm9tIGlkcyB0byBmZW5uZWNfaWRzIGFzIHJldHVybmVkIGJ5IHdlYnNlcnZpY2VcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kIG9mIG1hcHBpbmdcbiAgICAgKi9cbiAgICBhc3luYyBmdW5jdGlvbiBoYW5kbGVNYXBwaW5nUmVzdWx0KGRpbWVuc2lvbiwgaWRzRnJvbUJpb20sIG1hcHBpbmcsIG1ldGhvZCkge1xuICAgICAgICB0cnl7XG4gICAgICAgICAgICBsZXQgZmVubmVjX2lkcyA9IG5ldyBBcnJheShpZHNGcm9tQmlvbS5sZW5ndGgpLmZpbGwobnVsbCk7XG4gICAgICAgICAgICBsZXQgZmVubmVjSWRzMnNjaW5hbWVzID0gYXdhaXQgZ2V0U2NpbmFtZXMoT2JqZWN0LnZhbHVlcyhtYXBwaW5nKSlcbiAgICAgICAgICAgIGxldCBzY2luYW1lcyA9IG5ldyBBcnJheShpZHNGcm9tQmlvbS5sZW5ndGgpLmZpbGwoJ3VubWFwcGVkJyk7XG4gICAgICAgICAgICB2YXIgaWRzRnJvbUJpb21Ob3ROdWxsQ291bnQgPSAwO1xuICAgICAgICAgICAgdmFyIGlkc0Zyb21CaW9tTWFwcGVkQ291bnQgPSAwO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpZHNGcm9tQmlvbS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChpZHNGcm9tQmlvbVtpXSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBpZHNGcm9tQmlvbU5vdE51bGxDb3VudCsrO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaWRzRnJvbUJpb21baV0gaW4gbWFwcGluZyAmJiBtYXBwaW5nW2lkc0Zyb21CaW9tW2ldXSAhPT0gbnVsbCAmJiAhQXJyYXkuaXNBcnJheShtYXBwaW5nW2lkc0Zyb21CaW9tW2ldXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkc0Zyb21CaW9tTWFwcGVkQ291bnQrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIGZlbm5lY19pZHNbaV0gPSBtYXBwaW5nW2lkc0Zyb21CaW9tW2ldXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjaW5hbWVzW2ldID0gZmVubmVjSWRzMnNjaW5hbWVzW2Zlbm5lY19pZHNbaV1dO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYmlvbS5hZGRNZXRhZGF0YSh7ZGltZW5zaW9uOiBkaW1lbnNpb24sIGF0dHJpYnV0ZTogWydmZW5uZWMnLCBkYnZlcnNpb24sICdmZW5uZWNfaWQnXSwgdmFsdWVzOiBmZW5uZWNfaWRzfSk7XG4gICAgICAgICAgICBiaW9tLmFkZE1ldGFkYXRhKHtkaW1lbnNpb246IGRpbWVuc2lvbiwgYXR0cmlidXRlOiBbJ2Zlbm5lYycsIGRidmVyc2lvbiwgJ2Fzc2lnbm1lbnRfbWV0aG9kJ10sIGRlZmF1bHRWYWx1ZTogbWV0aG9kfSk7XG4gICAgICAgICAgICBiaW9tLmFkZE1ldGFkYXRhKHtkaW1lbnNpb246IGRpbWVuc2lvbiwgYXR0cmlidXRlOiBbJ2Zlbm5lYycsIGRidmVyc2lvbiwgJ3NjaWVudGlmaWNfbmFtZSddLCB2YWx1ZXM6IHNjaW5hbWVzfSk7XG4gICAgICAgICAgICB2YXIgaWRTdHJpbmcgPSBnZXRJZFN0cmluZ0Zvck1ldGhvZChtZXRob2QpO1xuICAgICAgICAgICAgJCgnI21hcHBpbmctcmVzdWx0cy1zZWN0aW9uJykuc2hvdygpO1xuICAgICAgICAgICAgJCgnI21hcHBpbmctcmVzdWx0cycpLnRleHQoYEZyb20gYSB0b3RhbCBvZiAke2lkc0Zyb21CaW9tLmxlbmd0aH0gb3JnYW5pc21zOiAgJHtpZHNGcm9tQmlvbU5vdE51bGxDb3VudH0gaGF2ZSBhICR7aWRTdHJpbmd9LCBvZiB3aGljaCAke2lkc0Zyb21CaW9tTWFwcGVkQ291bnR9IGNvdWxkIGJlIG1hcHBlZCB0byBmZW5uZWNfaWRzLmApO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIHNob3dNZXNzYWdlRGlhbG9nKCdUaGVyZSB3YXMgYW4gZXJyb3I6ICcrZS5tZXNzYWdlLCAnZGFuZ2VyJyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgfVxuICAgICAgICAkKCcjbWFwcGluZy1hY3Rpb24tYnVzeS1pbmRpY2F0b3InKS5oaWRlKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IG1hcCBmcm9tIGZlbm5lY19pZCB0byBzY2llbnRpZmljIG5hbWVcbiAgICAgKiBAcGFyYW0gZmVubmVjX2lkcyAoYXJyYXkgb2YgaWRzLCBtYXkgY29udGFpbiBzdWItYXJyYXlzIGFuZCBudWxsOiBbMSwyLFszLDRdLG51bGwsNV0pXG4gICAgICogQHJldHVybiB7UHJvbWlzZS48dm9pZD59XG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0U2NpbmFtZXMoZmVubmVjX2lkcyl7XG4gICAgICAgIGxldCB3ZWJzZXJ2aWNlVXJsID0gUm91dGluZy5nZW5lcmF0ZSgnYXBpJywgeyduYW1lc3BhY2UnOiAnbGlzdGluZycsICdjbGFzc25hbWUnOiAnc2NpbmFtZXMnfSk7XG4gICAgICAgIHJldHVybiAkLmFqYXgod2Vic2VydmljZVVybCwge1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIGRidmVyc2lvbjogZGJ2ZXJzaW9uLFxuICAgICAgICAgICAgICAgIGlkczogXy5mbGF0dGVuKGZlbm5lY19pZHMpLmZpbHRlcih4ID0+IHggIT09IG51bGwpLFxuICAgICAgICAgICAgICAgIGRiOiBtZXRob2RcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJ1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBTZXQgYWN0aW9uIGZvciBjbGljayBvbiBtYXBwaW5nIFwiU2F2ZSB0byBkYXRhYmFzZVwiIGJ1dHRvblxuICAgICQoJyNtYXBwaW5nLXNhdmUtYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBzYXZlQmlvbVRvREIoKTtcbiAgICB9KTtcblxuICAgIC8vIFNldCBhY3Rpb24gZm9yIGNsaWNrIG9uIG1hcHBpbmcgXCJEb3dubG9hZCBhcyBjc3ZcIiBidXR0b25cbiAgICAkKCcjbWFwcGluZy1kb3dubG9hZC1jc3YtYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgaWRzID0gYmlvbVtkaW1lbnNpb25dLm1hcChmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQuaWQ7XG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgbWFwcGluZ0lkcyA9IGdldElkc0ZvckF0dHJpYnV0ZShkaW1lbnNpb24sIGF0dHJpYnV0ZSk7XG4gICAgICAgIGxldCBmZW5uZWNJZHMgPSBiaW9tLmdldE1ldGFkYXRhKHtkaW1lbnNpb246IGRpbWVuc2lvbiwgYXR0cmlidXRlOiBbJ2Zlbm5lYycsIGRidmVyc2lvbiwgJ2Zlbm5lY19pZCddfSk7XG4gICAgICAgIGxldCBpZEhlYWRlciA9IGRpbWVuc2lvbiA9PT0gJ3Jvd3MnID8gJ09UVV9JRCcgOiAnU2FtcGxlX0lEJztcbiAgICAgICAgbGV0IGlkU3RyaW5nID0gZ2V0SWRTdHJpbmdGb3JNZXRob2QobWV0aG9kKTtcbiAgICAgICAgdmFyIGNzdiA9IGAke2lkSGVhZGVyfVxcdCR7aWRTdHJpbmd9XFx0RmVubmVjX0lEXFxuYDtcbiAgICAgICAgZm9yKHZhciBpPTA7IGk8aWRzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIGNzdiArPSBpZHNbaV0rXCJcXHRcIittYXBwaW5nSWRzW2ldK1wiXFx0XCIrZmVubmVjSWRzW2ldK1wiXFxuXCI7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGJsb2IgPSBuZXcgQmxvYihbY3N2XSwge3R5cGU6IFwidGV4dC9wbGFpbjtjaGFyc2V0PXV0Zi04XCJ9KTtcbiAgICAgICAgc2F2ZUFzKGJsb2IsIFwibWFwcGluZy5jc3ZcIik7XG4gICAgfSk7XG59KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvcHJvamVjdC9kZXRhaWxzL21hcHBpbmcuanN4IiwiJCgnZG9jdW1lbnQnKS5yZWFkeSgoKSA9PiB7XG4gICAgJCgnI3Byb2plY3QtZXhwbG9yZS1vdHUtbWV0YWRhdGEnKS5jbGljaygoKSA9PiB7XG4gICAgICAgIGluaXRUYWJsZSgncm93cycsICdvYnNlcnZhdGlvbi1tZXRhZGF0YS10YWJsZScpXG4gICAgfSlcbiAgICAkKCcjcHJvamVjdC1leHBsb3JlLXNhbXBsZS1tZXRhZGF0YScpLmNsaWNrKCgpID0+IHtcbiAgICAgICAgaW5pdFRhYmxlKCdjb2x1bW5zJywgJ3NhbXBsZS1tZXRhZGF0YS10YWJsZScpXG4gICAgfSlcbn0pO1xuXG5jb25zdCB0YWJsZUNvbmZpZyA9IHtcbiAgICBvcmRlcjogWzEsIFwiZGVzY1wiXSxcbiAgICBkb206ICdCZnJ0aXAnLFxuICAgIGJ1dHRvbnM6IFtcbiAgICAgICAgJ2NvbHZpcydcbiAgICBdLFxuICAgIHNjcm9sbFg6IHRydWUsXG59XG5cbmNvbnN0IGdldFRhYmxlRGF0YSA9IChkaW1lbnNpb24pID0+IHtcbiAgICBpZihkaW1lbnNpb24gIT09ICdjb2x1bW5zJyAmJiBkaW1lbnNpb24gIT09ICdyb3dzJyl7XG4gICAgICAgIHJldHVybiBbW10sW11dXG4gICAgfVxuICAgIGxldCBkaW1NZXRhZGF0YSA9IGJpb21bZGltZW5zaW9uXS5tYXAoeCA9PiB7XG4gICAgICAgIGxldCBrZXkgPSAoZGltZW5zaW9uID09PSAnY29sdW1ucycgPyAnU2FtcGxlIElEJyA6ICdPVFUgSUQnKVxuICAgICAgICBsZXQgbWV0YWRhdGEgPSB7fVxuICAgICAgICBtZXRhZGF0YVtrZXldID0gIHguaWRcbiAgICAgICAgaWYoZGltZW5zaW9uID09PSAnY29sdW1ucycpe1xuICAgICAgICAgICAgbWV0YWRhdGFbXCJUb3RhbCBDb3VudFwiXSA9IF8uc3VtKGJpb20uZ2V0RGF0YUNvbHVtbih4LmlkKSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1ldGFkYXRhW1wiVG90YWwgQ291bnRcIl0gPSBfLnN1bShiaW9tLmdldERhdGFSb3coeC5pZCkpXG4gICAgICAgIH1cbiAgICAgICAgZm9yKGxldCBtIG9mIE9iamVjdC5rZXlzKHgubWV0YWRhdGEpKXtcbiAgICAgICAgICAgIGlmKG0gPT09ICdmZW5uZWMnKXtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1ldGFkYXRhW21dID0geC5tZXRhZGF0YVttXVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtZXRhZGF0YVxuICAgIH0pXG4gICAgbGV0IGNvbHVtbnMgPSBPYmplY3Qua2V5cyhkaW1NZXRhZGF0YVswXSkubWFwKHggPT4gKHtkYXRhOiB4LCB0aXRsZTogeH0pKVxuICAgIHJldHVybiBbZGltTWV0YWRhdGEsIGNvbHVtbnNdXG59XG5cbmNvbnN0IGluaXRUYWJsZSA9IChkaW1lbnNpb24sIGlkKSA9PiB7XG4gICAgJCgnI21ldGFkYXRhLXRhYmxlLXByb2dyZXNzJykuc2hvdygpXG4gICAgLy8gVGhlIHRpbWVvdXQgaXMgdXNlZCB0byBtYWtlIHRoZSBidXN5IGluZGljYXRvciBzaG93IHVwIGJlZm9yZSB0aGUgaGVhdnkgY29tcHV0YXRpb24gc3RhcnRzXG4gICAgLy8gV2ViIHdvcmtlcnMgYXJlIGEgYmV0dGVyIHNvbHV0aW9uIHRvIGFjaGlldmUgdGhpcyBnb2FsIGFuZCBhdm9pZCBoYW5naW5nIG9mIHRoZSBpbnRlcmZhY2UgaW4gdGhlIGZ1dHVyZVxuICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgbGV0IFttZXRhZGF0YSwgY29sdW1uc10gPSBnZXRUYWJsZURhdGEoZGltZW5zaW9uKVxuICAgICAgICAkKGAjJHtpZH1gKS5EYXRhVGFibGUoT2JqZWN0LmFzc2lnbih7fSwgdGFibGVDb25maWcsIHtcbiAgICAgICAgICAgIGRhdGE6IG1ldGFkYXRhLFxuICAgICAgICAgICAgY29sdW1uczogY29sdW1ucyxcbiAgICAgICAgfSkpO1xuICAgICAgICAkKCcjbWV0YWRhdGEtdGFibGUtcHJvZ3Jlc3MnKS5oaWRlKClcbiAgICB9LCA1KVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9SZXNvdXJjZXMvY2xpZW50L2pzeC9wcm9qZWN0L2RldGFpbHMvbWV0YWRhdGEuanN4IiwiLyogZ2xvYmFsIGJpb20gKi9cbi8qIGdsb2JhbCBwaGluY2hQcmV2aWV3UGF0aCAqL1xuY29uc3QgZGIgPSByZXF1aXJlKCcuLi8uLi8uLi8uLi8uLi8uLi93ZWIvYXNzZXRzL1BoaW5jaC9saWIvZGInKVxuXG5mdW5jdGlvbiBhZGp1c3RJZnJhbWVIZWlnaHQoKSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICQoJyNpbnNwZWN0LXdpdGgtcGhpbmNoLWlmcmFtZScpLmF0dHIoJ2hlaWdodCcsICQoJyNpbnNwZWN0LXdpdGgtcGhpbmNoLWlmcmFtZScpLmNvbnRlbnRzKCkuaGVpZ2h0KCkgKyAyMClcbiAgICB9LCAxMDApXG59XG5cbiQoJ2RvY3VtZW50JykucmVhZHkoKCkgPT4ge1xuICAgIC8vIFNldCBhY3Rpb24gZm9yIGNsaWNrIG9uIGluc3BlY3Qgd2l0aCBQaGluY2hcbiAgICAvLyBkYiBpcyB0aGUgYnJvd3NlciB3ZWJzdG9yYWdlXG4gICAgZGIub3Blbih7XG4gICAgICAgIHNlcnZlcjogXCJCaW9tRGF0YVwiLFxuICAgICAgICB2ZXJzaW9uOiAxLFxuICAgICAgICBzY2hlbWE6IHtcbiAgICAgICAgICAgIFwiYmlvbVwiOiB7XG4gICAgICAgICAgICAgICAga2V5OiB7XG4gICAgICAgICAgICAgICAgICAgIGtleVBhdGg6ICdpZCcsXG4gICAgICAgICAgICAgICAgICAgIGF1dG9JbmNyZW1lbnQ6IHRydWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KS5kb25lKGZ1bmN0aW9uIChzZXJ2ZXIpIHtcbiAgICAgICAgdmFyIGJpb21Ub1N0b3JlID0ge307XG4gICAgICAgIGJpb21Ub1N0b3JlLm5hbWUgPSBiaW9tLmlkO1xuICAgICAgICBsZXQgYmlvbVN0cmluZyA9IGJpb20udG9TdHJpbmcoKTtcbiAgICAgICAgYmlvbVRvU3RvcmUuc2l6ZSA9IGJpb21TdHJpbmcubGVuZ3RoO1xuICAgICAgICBiaW9tVG9TdG9yZS5kYXRhID0gYmlvbVN0cmluZztcbiAgICAgICAgbGV0IGQgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBiaW9tVG9TdG9yZS5kYXRlID0gZC5nZXRVVENGdWxsWWVhcigpICsgXCItXCIgKyAoZC5nZXRVVENNb250aCgpICsgMSkgKyBcIi1cIiArIGQuZ2V0VVRDRGF0ZSgpICsgXCJUXCIgKyBkLmdldFVUQ0hvdXJzKCkgKyBcIjpcIiArIGQuZ2V0VVRDTWludXRlcygpICsgXCI6XCIgKyBkLmdldFVUQ1NlY29uZHMoKSArIFwiIFVUQ1wiO1xuICAgICAgICBzZXJ2ZXIuYmlvbS5hZGQoYmlvbVRvU3RvcmUpLmRvbmUoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgICQoJyNpbnNwZWN0LXdpdGgtcGhpbmNoLWlmcmFtZScpLnNob3coKTtcbiAgICAgICAgICAgICQoJyNpbnNwZWN0LXdpdGgtcGhpbmNoLWlmcmFtZScpLmF0dHIoJ3NyYycsIHBoaW5jaFByZXZpZXdQYXRoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBBZGp1c3Qgc2l6ZSBvZiBpZnJhbWUgYWZ0ZXIgbG9hZGluZyBvZiBQaGluY2hcbiAgICAkKCcjaW5zcGVjdC13aXRoLXBoaW5jaC1pZnJhbWUnKS5vbihcImxvYWRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBzZXRUaW1lb3V0KGFkanVzdElmcmFtZUhlaWdodCwgMTAwMCk7XG4gICAgfSk7XG5cbiAgICAkKCcjaW5zcGVjdC13aXRoLXBoaW5jaC10YWInKS5vbignY2xpY2snLCBhZGp1c3RJZnJhbWVIZWlnaHQpXG59KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvcHJvamVjdC9kZXRhaWxzL3BoaW5jaC5qc3giLCIvKiBnbG9iYWwgaW50ZXJuYWxQcm9qZWN0SWQgKi9cbi8qIGdsb2JhbCBkYnZlcnNpb24gKi9cblxuJCgnZG9jdW1lbnQnKS5yZWFkeSgoKSA9PiB7XG4gICAgZ2V0QW5kU2hvd1RyYWl0cygnI3RyYWl0LXRhYmxlJywgJ3Jvd3MnKTtcbiAgICBnZXRBbmRTaG93VHJhaXRzKCcjdHJhaXQtdGFibGUtc2FtcGxlJywgJ2NvbHVtbnMnKTtcblxuICAgIGZ1bmN0aW9uIGdldEFuZFNob3dUcmFpdHMoaWQsIGRpbWVuc2lvbil7XG4gICAgICAgIHZhciB3ZWJzZXJ2aWNlVXJsID0gUm91dGluZy5nZW5lcmF0ZSgnYXBpJywgeyduYW1lc3BhY2UnOiAnZGV0YWlscycsICdjbGFzc25hbWUnOiAndHJhaXRzT2ZPcmdhbmlzbXMnfSk7XG4gICAgICAgIC8vIEV4dHJhY3Qgcm93IGZlbm5lY19pZHMgZnJvbSBiaW9tXG4gICAgICAgIHZhciBmZW5uZWNfaWRzID0gYmlvbS5nZXRNZXRhZGF0YSh7ZGltZW5zaW9uOiBkaW1lbnNpb24sIGF0dHJpYnV0ZTogWydmZW5uZWMnLCBkYnZlcnNpb24sICdmZW5uZWNfaWQnXX0pXG4gICAgICAgICAgICAuZmlsdGVyKCBlbGVtZW50ID0+IGVsZW1lbnQgIT09IG51bGwgKTtcblxuICAgICAgICAvLyBHZXQgdHJhaXRzIGZvciByb3dzXG4gICAgICAgICQuYWpheCh3ZWJzZXJ2aWNlVXJsLCB7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgXCJkYnZlcnNpb25cIjogZGJ2ZXJzaW9uLFxuICAgICAgICAgICAgICAgIFwiZmVubmVjX2lkc1wiOiBmZW5uZWNfaWRzXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgbGV0IHRyYWl0cyA9IFtdO1xuICAgICAgICAgICAgICAgICQuZWFjaChkYXRhLCBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGhpc1RyYWl0ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYWl0OiB2YWx1ZVsndHJhaXRfdHlwZSddLFxuICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IHZhbHVlWyd0cmFpdF9lbnRyeV9pZHMnXS5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICByYW5nZTogMTAwICogdmFsdWVbJ2Zlbm5lY19pZHMnXS5sZW5ndGggLyBmZW5uZWNfaWRzLmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB0cmFpdHMucHVzaCh0aGlzVHJhaXQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGluaXRUcmFpdHNPZlByb2plY3RUYWJsZShpZCwgZGltZW5zaW9uLCB0cmFpdHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBJbml0IHRyYWl0cyBvZiBwcm9qZWN0IHRhYmxlIHdpdGggdmFsdWVzXG4gICAgZnVuY3Rpb24gaW5pdFRyYWl0c09mUHJvamVjdFRhYmxlKHRhYmxlSWQsIGRpbWVuc2lvbiwgdHJhaXRzKSB7XG4gICAgICAgIGxldCBtZXRhZGF0YUtleXMgPSBnZXRNZXRhZGF0YUtleXMoYmlvbSwgZGltZW5zaW9uKVxuICAgICAgICAkKHRhYmxlSWQpLkRhdGFUYWJsZSh7XG4gICAgICAgICAgICBkYXRhOiB0cmFpdHMsXG4gICAgICAgICAgICBjb2x1bW5zOiBbXG4gICAgICAgICAgICAgICAge2RhdGE6ICd0cmFpdCd9LFxuICAgICAgICAgICAgICAgIHtkYXRhOiAnY291bnQnfSxcbiAgICAgICAgICAgICAgICB7ZGF0YTogJ3JhbmdlJ30sXG4gICAgICAgICAgICAgICAge2RhdGE6IG51bGx9LFxuICAgICAgICAgICAgICAgIHtkYXRhOiBudWxsfSxcbiAgICAgICAgICAgICAgICB7ZGF0YTogbnVsbH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBvcmRlcjogWzIsIFwiZGVzY1wiXSxcbiAgICAgICAgICAgIGNvbHVtbkRlZnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldHM6IDIsXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlcjogZGF0YSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgJzxzcGFuIHRpdGxlPVwiJyArIGRhdGEgLyAxMDAgKyAnXCI+PC9zcGFuPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJwcm9ncmVzc1wiPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJwcm9ncmVzcy1iYXIgcHJvZ3Jlc3MtYmFyLXRyYWl0XCIgcm9sZT1cInByb2dyZXNzYmFyXCIgc3R5bGU9XCJ3aWR0aDogJyArIGRhdGEgKyAnJVwiPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5yb3VuZChkYXRhKSArICclPC9kaXY+PC9kaXY+JyxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RpdGxlLW51bWVyaWMnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldHM6IDAsXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlcjogKGRhdGEsIHR5cGUsIGZ1bGwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBocmVmID0gUm91dGluZy5nZW5lcmF0ZSgndHJhaXRfZGV0YWlscycsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGJ2ZXJzaW9uJzogZGJ2ZXJzaW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0cmFpdF90eXBlX2lkJzogZnVsbC5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJzxhIGhyZWY9XCInICsgaHJlZiArICdcIj4nICsgZnVsbC50cmFpdCArICc8L2E+JztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRzOiAzLFxuICAgICAgICAgICAgICAgICAgICByZW5kZXI6IChkYXRhLCB0eXBlLCBmdWxsKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaHJlZiA9IFJvdXRpbmcuZ2VuZXJhdGUoJ3Byb2plY3RfdHJhaXRfZGV0YWlscycsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGJ2ZXJzaW9uJzogZGJ2ZXJzaW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0cmFpdF90eXBlX2lkJzogZnVsbC5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAncHJvamVjdF9pZCc6IGludGVybmFsUHJvamVjdElkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkaW1lbnNpb24nOiBkaW1lbnNpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICc8YSBocmVmPVwiJyArIGhyZWYgKyAnXCI+PGkgY2xhc3M9XCJmYSBmYS1zZWFyY2hcIj48L2k+PC9hPic7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0czogNCxcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyOiAoZGF0YSwgdHlwZSwgZnVsbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF8uaW5kZXhPZihtZXRhZGF0YUtleXMsIGZ1bGwudHJhaXQpICE9IC0xID8gJzxpIGNsYXNzPVwiZmEgZmEtY2hlY2tcIj48L2k+JyA6ICcnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0czogNSxcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyOiAoZGF0YSwgdHlwZSwgZnVsbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF8uaW5kZXhPZihtZXRhZGF0YUtleXMsIGZ1bGwudHJhaXQpICE9IC0xID8gJzxhIG9uY2xpY2s9XCJyZW1vdmVUcmFpdEZyb21Qcm9qZWN0VGFibGVBY3Rpb24oJytcIidcIitmdWxsLnRyYWl0K1wiJywnXCIrZGltZW5zaW9uK1wiJ1wiKycpXCI+PGkgY2xhc3M9XCJmYSBmYS10cmFzaFwiPjwvaT48L2E+JyA6ICc8YSBvbmNsaWNrPVwiYWRkVHJhaXRUb1Byb2plY3RUYWJsZUFjdGlvbignK2Z1bGwuaWQrJywnK1wiJ1wiK2RpbWVuc2lvbitcIidcIisnKVwiPjxpIGNsYXNzPVwiZmEgZmEtcGx1c1wiPjwvaT48L2E+JztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG5cbmZ1bmN0aW9uIGFkZFRyYWl0VG9Qcm9qZWN0VGFibGVBY3Rpb24odHJhaXRUeXBlSWQsIGRpbWVuc2lvbil7XG4gICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogUm91dGluZy5nZW5lcmF0ZSgnYXBpJywgeyduYW1lc3BhY2UnOiAnZGV0YWlscycsICdjbGFzc25hbWUnOiAnVHJhaXRPZlByb2plY3QnfSksXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgXCJkYnZlcnNpb25cIjogZGJ2ZXJzaW9uLFxuICAgICAgICAgICAgICAgIFwiaW50ZXJuYWxfcHJvamVjdF9pZFwiOiBpbnRlcm5hbFByb2plY3RJZCxcbiAgICAgICAgICAgICAgICBcInRyYWl0X3R5cGVfaWRcIjogdHJhaXRUeXBlSWQsXG4gICAgICAgICAgICAgICAgXCJpbmNsdWRlX2NpdGF0aW9uc1wiOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRyYWl0VmFsdWVzO1xuICAgICAgICAgICAgICAgIGlmKGRhdGEudHJhaXRfZm9ybWF0ID09PSAnbnVtZXJpY2FsJyl7XG4gICAgICAgICAgICAgICAgICAgIHRyYWl0VmFsdWVzID0gY29uZGVuc2VOdW1lcmljYWxUcmFpdFZhbHVlcyhkYXRhLnZhbHVlcylcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0cmFpdFZhbHVlcyA9IGNvbmRlbnNlQ2F0ZWdvcmljYWxUcmFpdFZhbHVlcyhkYXRhLnZhbHVlcylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYWRkVHJhaXRUb1Byb2plY3QoZGF0YS5uYW1lLCB0cmFpdFZhbHVlcywgZGF0YS5jaXRhdGlvbnMsIGJpb20sIGRpbWVuc2lvbiwgZGJ2ZXJzaW9uLCBpbnRlcm5hbFByb2plY3RJZCwgKCkgPT4gd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlVHJhaXRGcm9tUHJvamVjdFRhYmxlQWN0aW9uKHRyYWl0TmFtZSwgZGltZW5zaW9uKXtcbiAgICByZW1vdmVUcmFpdEZyb21Qcm9qZWN0KHRyYWl0TmFtZSwgYmlvbSwgZGltZW5zaW9uLCBkYnZlcnNpb24sIGludGVybmFsUHJvamVjdElkLCAoKSA9PiB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCkpXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L3Byb2plY3QvZGV0YWlscy90cmFpdC5qc3giLCIoZnVuY3Rpb24gKCB3aW5kb3cgLCB1bmRlZmluZWQgKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBpbmRleGVkREIgPSB3aW5kb3cuaW5kZXhlZERCIHx8IHdpbmRvdy53ZWJraXRJbmRleGVkREIgfHwgd2luZG93Lm1vekluZGV4ZWREQiB8fCB3aW5kb3cub0luZGV4ZWREQiB8fCB3aW5kb3cubXNJbmRleGVkREIsXG4gICAgICAgIElEQktleVJhbmdlID0gd2luZG93LklEQktleVJhbmdlIHx8IHdpbmRvdy53ZWJraXRJREJLZXlSYW5nZSxcbiAgICAgICAgdHJhbnNhY3Rpb25Nb2RlcyA9IHtcbiAgICAgICAgICAgIHJlYWRvbmx5OiAncmVhZG9ubHknLFxuICAgICAgICAgICAgcmVhZHdyaXRlOiAncmVhZHdyaXRlJ1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICB2YXIgaGFzT3duID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuICAgIGlmICggIWluZGV4ZWREQiApIHtcbiAgICAgICAgdGhyb3cgJ0luZGV4ZWREQiByZXF1aXJlZCc7XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRNYXBwZXIgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG5cbiAgICB2YXIgQ2FsbGJhY2tMaXN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc3RhdGUsXG4gICAgICAgICAgICBsaXN0ID0gW107XG5cbiAgICAgICAgdmFyIGV4ZWMgPSBmdW5jdGlvbiAoIGNvbnRleHQgLCBhcmdzICkge1xuICAgICAgICAgICAgaWYgKCBsaXN0ICkge1xuICAgICAgICAgICAgICAgIGFyZ3MgPSBhcmdzIHx8IFtdO1xuICAgICAgICAgICAgICAgIHN0YXRlID0gc3RhdGUgfHwgWyBjb250ZXh0ICwgYXJncyBdO1xuXG4gICAgICAgICAgICAgICAgZm9yICggdmFyIGkgPSAwICwgaWwgPSBsaXN0Lmxlbmd0aCA7IGkgPCBpbCA7IGkrKyApIHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdFsgaSBdLmFwcGx5KCBzdGF0ZVsgMCBdICwgc3RhdGVbIDEgXSApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxpc3QgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmFkZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGZvciAoIHZhciBpID0gMCAsIGlsID0gYXJndW1lbnRzLmxlbmd0aCA7IGkgPCBpbCA7IGkgKysgKSB7XG4gICAgICAgICAgICAgICAgbGlzdC5wdXNoKCBhcmd1bWVudHNbIGkgXSApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIHN0YXRlICkge1xuICAgICAgICAgICAgICAgIGV4ZWMoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5leGVjdXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZXhlYyggdGhpcyAsIGFyZ3VtZW50cyApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIHZhciBEZWZlcnJlZCA9IGZ1bmN0aW9uICggZnVuYyApIHtcbiAgICAgICAgdmFyIHN0YXRlID0gJ3Byb2dyZXNzJyxcbiAgICAgICAgICAgIGFjdGlvbnMgPSBbXG4gICAgICAgICAgICAgICAgWyAncmVzb2x2ZScgLCAnZG9uZScgLCBuZXcgQ2FsbGJhY2tMaXN0KCkgLCAncmVzb2x2ZWQnIF0sXG4gICAgICAgICAgICAgICAgWyAncmVqZWN0JyAsICdmYWlsJyAsIG5ldyBDYWxsYmFja0xpc3QoKSAsICdyZWplY3RlZCcgXSxcbiAgICAgICAgICAgICAgICBbICdub3RpZnknICwgJ3Byb2dyZXNzJyAsIG5ldyBDYWxsYmFja0xpc3QoKSBdLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGRlZmVycmVkID0ge30sXG4gICAgICAgICAgICBwcm9taXNlID0ge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRoZW46IGZ1bmN0aW9uICggLyogZG9uZUhhbmRsZXIgLCBmYWlsZWRIYW5kbGVyICwgcHJvZ3Jlc3NIYW5kbGVyICovICkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaGFuZGxlcnMgPSBhcmd1bWVudHM7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERlZmVycmVkKGZ1bmN0aW9uICggbmV3RGVmZXIgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb25zLmZvckVhY2goZnVuY3Rpb24gKCBhY3Rpb24gLCBpICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBoYW5kbGVyID0gaGFuZGxlcnNbIGkgXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkWyBhY3Rpb25bIDEgXSBdKCB0eXBlb2YgaGFuZGxlciA9PT0gJ2Z1bmN0aW9uJyA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXR1cm5lZCA9IGhhbmRsZXIuYXBwbHkoIHRoaXMgLCBhcmd1bWVudHMgKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCByZXR1cm5lZCAmJiB0eXBlb2YgcmV0dXJuZWQucHJvbWlzZSA9PT0gJ2Z1bmN0aW9uJyApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5lZC5wcm9taXNlKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmRvbmUoIG5ld0RlZmVyLnJlc29sdmUgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmFpbCggbmV3RGVmZXIucmVqZWN0IClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnByb2dyZXNzKCBuZXdEZWZlci5ub3RpZnkgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSA6IG5ld0RlZmVyWyBhY3Rpb25bIDAgXSBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KS5wcm9taXNlKCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwcm9taXNlOiBmdW5jdGlvbiAoIG9iaiApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBvYmogKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyggcHJvbWlzZSApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZvckVhY2goZnVuY3Rpb24gKCBrZXkgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ialsga2V5IF0gPSBwcm9taXNlWyBrZXkgXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIGFjdGlvbnMuZm9yRWFjaChmdW5jdGlvbiAoIGFjdGlvbiAsIGkgKSB7XG4gICAgICAgICAgICB2YXIgbGlzdCA9IGFjdGlvblsgMiBdLFxuICAgICAgICAgICAgICAgIGFjdGlvblN0YXRlID0gYWN0aW9uWyAzIF07XG5cbiAgICAgICAgICAgIHByb21pc2VbIGFjdGlvblsgMSBdIF0gPSBsaXN0LmFkZDtcblxuICAgICAgICAgICAgaWYgKCBhY3Rpb25TdGF0ZSApIHtcbiAgICAgICAgICAgICAgICBsaXN0LmFkZChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlID0gYWN0aW9uU3RhdGU7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRlZmVycmVkWyBhY3Rpb25bIDAgXSBdID0gbGlzdC5leGVjdXRlO1xuICAgICAgICB9KTtcblxuICAgICAgICBwcm9taXNlLnByb21pc2UoIGRlZmVycmVkICk7XG5cbiAgICAgICAgaWYgKCBmdW5jICkge1xuICAgICAgICAgICAgZnVuYy5jYWxsKCBkZWZlcnJlZCAsIGRlZmVycmVkICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGVmZXJyZWQ7XG4gICAgfTtcblxuICAgIHZhciBTZXJ2ZXIgPSBmdW5jdGlvbiAoIGRiICwgbmFtZSApIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICAgICAgY2xvc2VkID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5hZGQgPSBmdW5jdGlvbiggdGFibGUgKSB7XG4gICAgICAgICAgICBpZiAoIGNsb3NlZCApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnRGF0YWJhc2UgaGFzIGJlZW4gY2xvc2VkJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHJlY29yZHMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgICAgIHJlY29yZHNbaV0gPSBhcmd1bWVudHNbaSArIDFdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdHJhbnNhY3Rpb24gPSBkYi50cmFuc2FjdGlvbiggdGFibGUgLCB0cmFuc2FjdGlvbk1vZGVzLnJlYWR3cml0ZSApLFxuICAgICAgICAgICAgICAgIHN0b3JlID0gdHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUoIHRhYmxlICksXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQgPSBEZWZlcnJlZCgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZWNvcmRzLmZvckVhY2goIGZ1bmN0aW9uICggcmVjb3JkICkge1xuICAgICAgICAgICAgICAgIHZhciByZXE7XG4gICAgICAgICAgICAgICAgaWYgKCByZWNvcmQuaXRlbSAmJiByZWNvcmQua2V5ICkge1xuICAgICAgICAgICAgICAgICAgICB2YXIga2V5ID0gcmVjb3JkLmtleTtcbiAgICAgICAgICAgICAgICAgICAgcmVjb3JkID0gcmVjb3JkLml0ZW07XG4gICAgICAgICAgICAgICAgICAgIHJlcSA9IHN0b3JlLmFkZCggcmVjb3JkICwga2V5ICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVxID0gc3RvcmUuYWRkKCByZWNvcmQgKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXEub25zdWNjZXNzID0gZnVuY3Rpb24gKCBlICkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gZS50YXJnZXQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciBrZXlQYXRoID0gdGFyZ2V0LnNvdXJjZS5rZXlQYXRoO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIGtleVBhdGggPT09IG51bGwgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXlQYXRoID0gJ19faWRfXyc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KCByZWNvcmQgLCBrZXlQYXRoICwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRhcmdldC5yZXN1bHQsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5ub3RpZnkoKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0cmFuc2FjdGlvbi5vbmNvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoIHJlY29yZHMgLCB0aGF0ICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdHJhbnNhY3Rpb24ub25lcnJvciA9IGZ1bmN0aW9uICggZSApIHtcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoIHJlY29yZHMgLCBlICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdHJhbnNhY3Rpb24ub25hYm9ydCA9IGZ1bmN0aW9uICggZSApIHtcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoIHJlY29yZHMgLCBlICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2UoKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKCB0YWJsZSApIHtcbiAgICAgICAgICAgIGlmICggY2xvc2VkICkge1xuICAgICAgICAgICAgICAgIHRocm93ICdEYXRhYmFzZSBoYXMgYmVlbiBjbG9zZWQnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcmVjb3JkcyA9IFtdO1xuICAgICAgICAgICAgZm9yICggdmFyIGkgPSAwIDsgaSA8IGFyZ3VtZW50cy5sZW5ndGggLSAxIDsgaSsrICkge1xuICAgICAgICAgICAgICAgIHJlY29yZHNbIGkgXSA9IGFyZ3VtZW50c1sgaSArIDEgXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHRyYW5zYWN0aW9uID0gZGIudHJhbnNhY3Rpb24oIHRhYmxlICwgdHJhbnNhY3Rpb25Nb2Rlcy5yZWFkd3JpdGUgKSxcbiAgICAgICAgICAgICAgICBzdG9yZSA9IHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKCB0YWJsZSApLFxuICAgICAgICAgICAgICAgIGtleVBhdGggPSBzdG9yZS5rZXlQYXRoLFxuICAgICAgICAgICAgICAgIGRlZmVycmVkID0gRGVmZXJyZWQoKTtcblxuICAgICAgICAgICAgcmVjb3Jkcy5mb3JFYWNoKCBmdW5jdGlvbiAoIHJlY29yZCApIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVxO1xuICAgICAgICAgICAgICAgIGlmICggcmVjb3JkLml0ZW0gJiYgcmVjb3JkLmtleSApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGtleSA9IHJlY29yZC5rZXk7XG4gICAgICAgICAgICAgICAgICAgIHJlY29yZCA9IHJlY29yZC5pdGVtO1xuICAgICAgICAgICAgICAgICAgICByZXEgPSBzdG9yZS5wdXQoIHJlY29yZCAsIGtleSApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcSA9IHN0b3JlLnB1dCggcmVjb3JkICk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmVxLm9uc3VjY2VzcyA9IGZ1bmN0aW9uICggZSApIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQubm90aWZ5KCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdHJhbnNhY3Rpb24ub25jb21wbGV0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCByZWNvcmRzICwgdGhhdCApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRyYW5zYWN0aW9uLm9uZXJyb3IgPSBmdW5jdGlvbiAoIGUgKSB7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCByZWNvcmRzICwgZSApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRyYW5zYWN0aW9uLm9uYWJvcnQgPSBmdW5jdGlvbiAoIGUgKSB7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCByZWNvcmRzICwgZSApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlKCk7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICB0aGlzLnJlbW92ZSA9IGZ1bmN0aW9uICggdGFibGUgLCBrZXkgKSB7XG4gICAgICAgICAgICBpZiAoIGNsb3NlZCApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnRGF0YWJhc2UgaGFzIGJlZW4gY2xvc2VkJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB0cmFuc2FjdGlvbiA9IGRiLnRyYW5zYWN0aW9uKCB0YWJsZSAsIHRyYW5zYWN0aW9uTW9kZXMucmVhZHdyaXRlICksXG4gICAgICAgICAgICAgICAgc3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZSggdGFibGUgKSxcbiAgICAgICAgICAgICAgICBkZWZlcnJlZCA9IERlZmVycmVkKCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciByZXEgPSBzdG9yZS5kZWxldGUoIGtleSApO1xuICAgICAgICAgICAgdHJhbnNhY3Rpb24ub25jb21wbGV0ZSA9IGZ1bmN0aW9uICggKSB7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgga2V5ICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdHJhbnNhY3Rpb24ub25lcnJvciA9IGZ1bmN0aW9uICggZSApIHtcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoIGUgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuY2xlYXIgPSBmdW5jdGlvbiAoIHRhYmxlICkge1xuICAgICAgICAgICAgaWYgKCBjbG9zZWQgKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ0RhdGFiYXNlIGhhcyBiZWVuIGNsb3NlZCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgdHJhbnNhY3Rpb24gPSBkYi50cmFuc2FjdGlvbiggdGFibGUgLCB0cmFuc2FjdGlvbk1vZGVzLnJlYWR3cml0ZSApLFxuICAgICAgICAgICAgICAgIHN0b3JlID0gdHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUoIHRhYmxlICksXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQgPSBEZWZlcnJlZCgpO1xuXG4gICAgICAgICAgICB2YXIgcmVxID0gc3RvcmUuY2xlYXIoKTtcbiAgICAgICAgICAgIHRyYW5zYWN0aW9uLm9uY29tcGxldGUgPSBmdW5jdGlvbiAoICkge1xuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdHJhbnNhY3Rpb24ub25lcnJvciA9IGZ1bmN0aW9uICggZSApIHtcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoIGUgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZSgpO1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgdGhpcy5jbG9zZSA9IGZ1bmN0aW9uICggKSB7XG4gICAgICAgICAgICBpZiAoIGNsb3NlZCApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnRGF0YWJhc2UgaGFzIGJlZW4gY2xvc2VkJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRiLmNsb3NlKCk7XG4gICAgICAgICAgICBjbG9zZWQgPSB0cnVlO1xuICAgICAgICAgICAgZGVsZXRlIGRiQ2FjaGVbIG5hbWUgXTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmdldCA9IGZ1bmN0aW9uICggdGFibGUgLCBpZCApIHtcbiAgICAgICAgICAgIGlmICggY2xvc2VkICkge1xuICAgICAgICAgICAgICAgIHRocm93ICdEYXRhYmFzZSBoYXMgYmVlbiBjbG9zZWQnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHRyYW5zYWN0aW9uID0gZGIudHJhbnNhY3Rpb24oIHRhYmxlICksXG4gICAgICAgICAgICAgICAgc3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZSggdGFibGUgKSxcbiAgICAgICAgICAgICAgICBkZWZlcnJlZCA9IERlZmVycmVkKCk7XG5cbiAgICAgICAgICAgIHZhciByZXEgPSBzdG9yZS5nZXQoIGlkICk7XG4gICAgICAgICAgICByZXEub25zdWNjZXNzID0gZnVuY3Rpb24gKCBlICkge1xuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoIGUudGFyZ2V0LnJlc3VsdCApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRyYW5zYWN0aW9uLm9uZXJyb3IgPSBmdW5jdGlvbiAoIGUgKSB7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCBlICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2UoKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnF1ZXJ5ID0gZnVuY3Rpb24gKCB0YWJsZSAsIGluZGV4ICkge1xuICAgICAgICAgICAgaWYgKCBjbG9zZWQgKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ0RhdGFiYXNlIGhhcyBiZWVuIGNsb3NlZCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbmV3IEluZGV4UXVlcnkoIHRhYmxlICwgZGIgLCBpbmRleCApO1xuICAgICAgICB9O1xuXG4gICAgICAgIGZvciAoIHZhciBpID0gMCAsIGlsID0gZGIub2JqZWN0U3RvcmVOYW1lcy5sZW5ndGggOyBpIDwgaWwgOyBpKysgKSB7XG4gICAgICAgICAgICAoZnVuY3Rpb24gKCBzdG9yZU5hbWUgKSB7XG4gICAgICAgICAgICAgICAgdGhhdFsgc3RvcmVOYW1lIF0gPSB7IH07XG4gICAgICAgICAgICAgICAgZm9yICggdmFyIGkgaW4gdGhhdCApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhaGFzT3duLmNhbGwoIHRoYXQgLCBpICkgfHwgaSA9PT0gJ2Nsb3NlJyApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoYXRbIHN0b3JlTmFtZSBdWyBpIF0gPSAoZnVuY3Rpb24gKCBpICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXJncyA9IFsgc3RvcmVOYW1lIF0uY29uY2F0KCBbXS5zbGljZS5jYWxsKCBhcmd1bWVudHMgLCAwICkgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhhdFsgaSBdLmFwcGx5KCB0aGF0ICwgYXJncyApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfSkoIGkgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSggZGIub2JqZWN0U3RvcmVOYW1lc1sgaSBdICk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIEluZGV4UXVlcnkgPSBmdW5jdGlvbiAoIHRhYmxlICwgZGIgLCBpbmRleE5hbWUgKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgdmFyIG1vZGlmeU9iaiA9IGZhbHNlO1xuXG4gICAgICAgIHZhciBydW5RdWVyeSA9IGZ1bmN0aW9uICggdHlwZSwgYXJncyAsIGN1cnNvclR5cGUgLCBkaXJlY3Rpb24sIGxpbWl0UmFuZ2UsIGZpbHRlcnMgLCBtYXBwZXIgKSB7XG4gICAgICAgICAgICB2YXIgdHJhbnNhY3Rpb24gPSBkYi50cmFuc2FjdGlvbiggdGFibGUsIG1vZGlmeU9iaiA/IHRyYW5zYWN0aW9uTW9kZXMucmVhZHdyaXRlIDogdHJhbnNhY3Rpb25Nb2Rlcy5yZWFkb25seSApLFxuICAgICAgICAgICAgICAgIHN0b3JlID0gdHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUoIHRhYmxlICksXG4gICAgICAgICAgICAgICAgaW5kZXggPSBpbmRleE5hbWUgPyBzdG9yZS5pbmRleCggaW5kZXhOYW1lICkgOiBzdG9yZSxcbiAgICAgICAgICAgICAgICBrZXlSYW5nZSA9IHR5cGUgPyBJREJLZXlSYW5nZVsgdHlwZSBdLmFwcGx5KCBudWxsLCBhcmdzICkgOiBudWxsLFxuICAgICAgICAgICAgICAgIHJlc3VsdHMgPSBbXSxcbiAgICAgICAgICAgICAgICBkZWZlcnJlZCA9IERlZmVycmVkKCksXG4gICAgICAgICAgICAgICAgaW5kZXhBcmdzID0gWyBrZXlSYW5nZSBdLFxuICAgICAgICAgICAgICAgIGxpbWl0UmFuZ2UgPSBsaW1pdFJhbmdlID8gbGltaXRSYW5nZSA6IG51bGwsXG4gICAgICAgICAgICAgICAgZmlsdGVycyA9IGZpbHRlcnMgPyBmaWx0ZXJzIDogW10sXG4gICAgICAgICAgICAgICAgY291bnRlciA9IDA7XG5cbiAgICAgICAgICAgIGlmICggY3Vyc29yVHlwZSAhPT0gJ2NvdW50JyApIHtcbiAgICAgICAgICAgICAgICBpbmRleEFyZ3MucHVzaCggZGlyZWN0aW9uIHx8ICduZXh0JyApO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gY3JlYXRlIGEgZnVuY3Rpb24gdGhhdCB3aWxsIHNldCBpbiB0aGUgbW9kaWZ5T2JqIHByb3BlcnRpZXMgaW50b1xuICAgICAgICAgICAgLy8gdGhlIHBhc3NlZCByZWNvcmQuXG4gICAgICAgICAgICB2YXIgbW9kaWZ5S2V5cyA9IG1vZGlmeU9iaiA/IE9iamVjdC5rZXlzKG1vZGlmeU9iaikgOiBmYWxzZTtcbiAgICAgICAgICAgIHZhciBtb2RpZnlSZWNvcmQgPSBmdW5jdGlvbihyZWNvcmQpIHtcbiAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgbW9kaWZ5S2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIga2V5ID0gbW9kaWZ5S2V5c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbCA9IG1vZGlmeU9ialtrZXldO1xuICAgICAgICAgICAgICAgICAgICBpZih2YWwgaW5zdGFuY2VvZiBGdW5jdGlvbikgdmFsID0gdmFsKHJlY29yZCk7XG4gICAgICAgICAgICAgICAgICAgIHJlY29yZFtrZXldID0gdmFsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVjb3JkO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaW5kZXhbY3Vyc29yVHlwZV0uYXBwbHkoIGluZGV4ICwgaW5kZXhBcmdzICkub25zdWNjZXNzID0gZnVuY3Rpb24gKCBlICkge1xuICAgICAgICAgICAgICAgIHZhciBjdXJzb3IgPSBlLnRhcmdldC5yZXN1bHQ7XG4gICAgICAgICAgICAgICAgaWYgKCB0eXBlb2YgY3Vyc29yID09PSB0eXBlb2YgMCApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0cyA9IGN1cnNvcjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBjdXJzb3IgKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggbGltaXRSYW5nZSAhPT0gbnVsbCAmJiBsaW1pdFJhbmdlWzBdID4gY291bnRlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY291bnRlciA9IGxpbWl0UmFuZ2VbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3IuYWR2YW5jZShsaW1pdFJhbmdlWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICggbGltaXRSYW5nZSAhPT0gbnVsbCAmJiBjb3VudGVyID49IChsaW1pdFJhbmdlWzBdICsgbGltaXRSYW5nZVsxXSkgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL291dCBvZiBsaW1pdCByYW5nZS4uLiBza2lwXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWF0Y2hGaWx0ZXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9ICd2YWx1ZScgaW4gY3Vyc29yID8gY3Vyc29yLnZhbHVlIDogY3Vyc29yLmtleTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVycy5mb3JFYWNoKCBmdW5jdGlvbiAoIGZpbHRlciApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoICFmaWx0ZXIgfHwgIWZpbHRlci5sZW5ndGggKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vSW52YWxpZCBmaWx0ZXIgZG8gbm90aGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIGZpbHRlci5sZW5ndGggPT09IDIgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoRmlsdGVyID0gKHJlc3VsdFtmaWx0ZXJbMF1dID09PSBmaWx0ZXJbMV0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hGaWx0ZXIgPSBmaWx0ZXJbMF0uYXBwbHkodW5kZWZpbmVkLFtyZXN1bHRdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoRmlsdGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnRlcisrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaCggbWFwcGVyKHJlc3VsdCkgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB3ZSdyZSBkb2luZyBhIG1vZGlmeSwgcnVuIGl0IG5vd1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKG1vZGlmeU9iaikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBtb2RpZnlSZWNvcmQocmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yLnVwZGF0ZShyZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvci5jb250aW51ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdHJhbnNhY3Rpb24ub25jb21wbGV0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCByZXN1bHRzICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdHJhbnNhY3Rpb24ub25lcnJvciA9IGZ1bmN0aW9uICggZSApIHtcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoIGUgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0cmFuc2FjdGlvbi5vbmFib3J0ID0gZnVuY3Rpb24gKCBlICkge1xuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCggZSApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIFF1ZXJ5ID0gZnVuY3Rpb24gKCB0eXBlICwgYXJncyApIHtcbiAgICAgICAgICAgIHZhciBkaXJlY3Rpb24gPSAnbmV4dCcsXG4gICAgICAgICAgICAgICAgY3Vyc29yVHlwZSA9ICdvcGVuQ3Vyc29yJyxcbiAgICAgICAgICAgICAgICBmaWx0ZXJzID0gW10sXG4gICAgICAgICAgICAgICAgbGltaXRSYW5nZSA9IG51bGwsXG4gICAgICAgICAgICAgICAgbWFwcGVyID0gZGVmYXVsdE1hcHBlcixcbiAgICAgICAgICAgICAgICB1bmlxdWUgPSBmYWxzZTtcblxuICAgICAgICAgICAgdmFyIGV4ZWN1dGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJ1blF1ZXJ5KCB0eXBlICwgYXJncyAsIGN1cnNvclR5cGUgLCB1bmlxdWUgPyBkaXJlY3Rpb24gKyAndW5pcXVlJyA6IGRpcmVjdGlvbiwgbGltaXRSYW5nZSwgZmlsdGVycyAsIG1hcHBlciApO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIGxpbWl0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGxpbWl0UmFuZ2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzICwgMCAsIDIgKVxuICAgICAgICAgICAgICAgIGlmIChsaW1pdFJhbmdlLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGxpbWl0UmFuZ2UudW5zaGlmdCgwKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGV4ZWN1dGU6IGV4ZWN1dGVcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHZhciBjb3VudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb24gPSBudWxsO1xuICAgICAgICAgICAgICAgIGN1cnNvclR5cGUgPSAnY291bnQnO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgZXhlY3V0ZTogZXhlY3V0ZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmFyIGtleXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY3Vyc29yVHlwZSA9ICdvcGVuS2V5Q3Vyc29yJztcblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGRlc2M6IGRlc2MsXG4gICAgICAgICAgICAgICAgICAgIGV4ZWN1dGU6IGV4ZWN1dGUsXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcjogZmlsdGVyLFxuICAgICAgICAgICAgICAgICAgICBkaXN0aW5jdDogZGlzdGluY3QsXG4gICAgICAgICAgICAgICAgICAgIG1hcDogbWFwXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2YXIgZmlsdGVyID0gZnVuY3Rpb24gKCApIHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJzLnB1c2goIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMgLCAwICwgMiApICk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBrZXlzOiBrZXlzLFxuICAgICAgICAgICAgICAgICAgICBleGVjdXRlOiBleGVjdXRlLFxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6IGZpbHRlcixcbiAgICAgICAgICAgICAgICAgICAgZGVzYzogZGVzYyxcbiAgICAgICAgICAgICAgICAgICAgZGlzdGluY3Q6IGRpc3RpbmN0LFxuICAgICAgICAgICAgICAgICAgICBtb2RpZnk6IG1vZGlmeSxcbiAgICAgICAgICAgICAgICAgICAgbGltaXQ6IGxpbWl0LFxuICAgICAgICAgICAgICAgICAgICBtYXA6IG1hcFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmFyIGRlc2MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uID0gJ3ByZXYnO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAga2V5czoga2V5cyxcbiAgICAgICAgICAgICAgICAgICAgZXhlY3V0ZTogZXhlY3V0ZSxcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyOiBmaWx0ZXIsXG4gICAgICAgICAgICAgICAgICAgIGRpc3RpbmN0OiBkaXN0aW5jdCxcbiAgICAgICAgICAgICAgICAgICAgbW9kaWZ5OiBtb2RpZnksXG4gICAgICAgICAgICAgICAgICAgIG1hcDogbWFwXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2YXIgZGlzdGluY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdW5pcXVlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBrZXlzOiBrZXlzLFxuICAgICAgICAgICAgICAgICAgICBjb3VudDogY291bnQsXG4gICAgICAgICAgICAgICAgICAgIGV4ZWN1dGU6IGV4ZWN1dGUsXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcjogZmlsdGVyLFxuICAgICAgICAgICAgICAgICAgICBkZXNjOiBkZXNjLFxuICAgICAgICAgICAgICAgICAgICBtb2RpZnk6IG1vZGlmeSxcbiAgICAgICAgICAgICAgICAgICAgbWFwOiBtYXBcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHZhciBtb2RpZnkgPSBmdW5jdGlvbih1cGRhdGUpIHtcbiAgICAgICAgICAgICAgICBtb2RpZnlPYmogPSB1cGRhdGU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgZXhlY3V0ZTogZXhlY3V0ZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmFyIG1hcCA9IGZ1bmN0aW9uIChmbikge1xuICAgICAgICAgICAgICAgIG1hcHBlciA9IGZuO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgZXhlY3V0ZTogZXhlY3V0ZSxcbiAgICAgICAgICAgICAgICAgICAgY291bnQ6IGNvdW50LFxuICAgICAgICAgICAgICAgICAgICBrZXlzOiBrZXlzLFxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6IGZpbHRlcixcbiAgICAgICAgICAgICAgICAgICAgZGVzYzogZGVzYyxcbiAgICAgICAgICAgICAgICAgICAgZGlzdGluY3Q6IGRpc3RpbmN0LFxuICAgICAgICAgICAgICAgICAgICBtb2RpZnk6IG1vZGlmeSxcbiAgICAgICAgICAgICAgICAgICAgbGltaXQ6IGxpbWl0LFxuICAgICAgICAgICAgICAgICAgICBtYXA6IG1hcFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGV4ZWN1dGU6IGV4ZWN1dGUsXG4gICAgICAgICAgICAgICAgY291bnQ6IGNvdW50LFxuICAgICAgICAgICAgICAgIGtleXM6IGtleXMsXG4gICAgICAgICAgICAgICAgZmlsdGVyOiBmaWx0ZXIsXG4gICAgICAgICAgICAgICAgZGVzYzogZGVzYyxcbiAgICAgICAgICAgICAgICBkaXN0aW5jdDogZGlzdGluY3QsXG4gICAgICAgICAgICAgICAgbW9kaWZ5OiBtb2RpZnksXG4gICAgICAgICAgICAgICAgbGltaXQ6IGxpbWl0LFxuICAgICAgICAgICAgICAgIG1hcDogbWFwXG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgJ29ubHkgYm91bmQgdXBwZXJCb3VuZCBsb3dlckJvdW5kJy5zcGxpdCgnICcpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgIHRoYXRbbmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBRdWVyeSggbmFtZSAsIGFyZ3VtZW50cyApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5maWx0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcXVlcnkgPSBuZXcgUXVlcnkoIG51bGwgLCBudWxsICk7XG4gICAgICAgICAgICByZXR1cm4gcXVlcnkuZmlsdGVyLmFwcGx5KCBxdWVyeSAsIGFyZ3VtZW50cyApO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuYWxsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlsdGVyKCk7XG4gICAgICAgIH07XG4gICAgfTtcbiAgICBcbiAgICB2YXIgY3JlYXRlU2NoZW1hID0gZnVuY3Rpb24gKCBlICwgc2NoZW1hICwgZGIgKSB7XG4gICAgICAgIGlmICggdHlwZW9mIHNjaGVtYSA9PT0gJ2Z1bmN0aW9uJyApIHtcbiAgICAgICAgICAgIHNjaGVtYSA9IHNjaGVtYSgpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBmb3IgKCB2YXIgdGFibGVOYW1lIGluIHNjaGVtYSApIHtcbiAgICAgICAgICAgIHZhciB0YWJsZSA9IHNjaGVtYVsgdGFibGVOYW1lIF07XG4gICAgICAgICAgICB2YXIgc3RvcmU7XG4gICAgICAgICAgICBpZiAoIWhhc093bi5jYWxsKHNjaGVtYSwgdGFibGVOYW1lKSB8fCBkYi5vYmplY3RTdG9yZU5hbWVzLmNvbnRhaW5zKHRhYmxlTmFtZSkpIHtcbiAgICAgICAgICAgICAgICBzdG9yZSA9IGUuY3VycmVudFRhcmdldC50cmFuc2FjdGlvbi5vYmplY3RTdG9yZSh0YWJsZU5hbWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdG9yZSA9IGRiLmNyZWF0ZU9iamVjdFN0b3JlKHRhYmxlTmFtZSwgdGFibGUua2V5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yICggdmFyIGluZGV4S2V5IGluIHRhYmxlLmluZGV4ZXMgKSB7XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gdGFibGUuaW5kZXhlc1sgaW5kZXhLZXkgXTtcbiAgICAgICAgICAgICAgICBzdG9yZS5jcmVhdGVJbmRleCggaW5kZXhLZXkgLCBpbmRleC5rZXkgfHwgaW5kZXhLZXkgLCBPYmplY3Qua2V5cyhpbmRleCkubGVuZ3RoID8gaW5kZXggOiB7IHVuaXF1ZTogZmFsc2UgfSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBcbiAgICB2YXIgb3BlbiA9IGZ1bmN0aW9uICggZSAsIHNlcnZlciAsIHZlcnNpb24gLCBzY2hlbWEgKSB7XG4gICAgICAgIHZhciBkYiA9IGUudGFyZ2V0LnJlc3VsdDtcbiAgICAgICAgdmFyIHMgPSBuZXcgU2VydmVyKCBkYiAsIHNlcnZlciApO1xuICAgICAgICB2YXIgdXBncmFkZTtcblxuICAgICAgICB2YXIgZGVmZXJyZWQgPSBEZWZlcnJlZCgpO1xuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCBzICk7XG4gICAgICAgIGRiQ2FjaGVbIHNlcnZlciBdID0gZGI7XG5cbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2UoKTtcbiAgICB9O1xuXG4gICAgdmFyIGRiQ2FjaGUgPSB7fTtcblxuICAgIHZhciBkYiA9IHtcbiAgICAgICAgdmVyc2lvbjogJzAuOS4wJyxcbiAgICAgICAgb3BlbjogZnVuY3Rpb24gKCBvcHRpb25zICkge1xuICAgICAgICAgICAgdmFyIHJlcXVlc3Q7XG5cbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9IERlZmVycmVkKCk7XG5cbiAgICAgICAgICAgIGlmICggZGJDYWNoZVsgb3B0aW9ucy5zZXJ2ZXIgXSApIHtcbiAgICAgICAgICAgICAgICBvcGVuKCB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiBkYkNhY2hlWyBvcHRpb25zLnNlcnZlciBdXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9ICwgb3B0aW9ucy5zZXJ2ZXIgLCBvcHRpb25zLnZlcnNpb24gLCBvcHRpb25zLnNjaGVtYSApXG4gICAgICAgICAgICAgICAgLmRvbmUoZGVmZXJyZWQucmVzb2x2ZSlcbiAgICAgICAgICAgICAgICAuZmFpbChkZWZlcnJlZC5yZWplY3QpXG4gICAgICAgICAgICAgICAgLnByb2dyZXNzKGRlZmVycmVkLm5vdGlmeSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlcXVlc3QgPSBpbmRleGVkREIub3Blbiggb3B0aW9ucy5zZXJ2ZXIgLCBvcHRpb25zLnZlcnNpb24gKTtcblxuICAgICAgICAgICAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gZnVuY3Rpb24gKCBlICkge1xuICAgICAgICAgICAgICAgICAgICBvcGVuKCBlICwgb3B0aW9ucy5zZXJ2ZXIgLCBvcHRpb25zLnZlcnNpb24gLCBvcHRpb25zLnNjaGVtYSApXG4gICAgICAgICAgICAgICAgICAgICAgICAuZG9uZShkZWZlcnJlZC5yZXNvbHZlKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZhaWwoZGVmZXJyZWQucmVqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgLnByb2dyZXNzKGRlZmVycmVkLm5vdGlmeSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHJlcXVlc3Qub251cGdyYWRlbmVlZGVkID0gZnVuY3Rpb24gKCBlICkge1xuICAgICAgICAgICAgICAgICAgICBjcmVhdGVTY2hlbWEoIGUgLCBvcHRpb25zLnNjaGVtYSAsIGUudGFyZ2V0LnJlc3VsdCApO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24gKCBlICkge1xuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoIGUgKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZSgpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZGI7XG4gICAgfSBlbHNlIGlmICggdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kICkge1xuICAgICAgICBkZWZpbmUoIGZ1bmN0aW9uKCkgeyByZXR1cm4gZGI7IH0gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cuZGIgPSBkYjtcbiAgICB9XG59KSggd2luZG93ICk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vd2ViL2Fzc2V0cy9QaGluY2gvbGliL2RiLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==