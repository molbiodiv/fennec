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

/* WEBPACK VAR INJECTION */(function($) {/* global db */
/* global biom */
/* global phinchPreviewPath */
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

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./app/Resources/client/jsx/project/details.jsx");


/***/ })

},[0]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvcHJvamVjdC9kZXRhaWxzLmpzeCIsIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvcHJvamVjdC9kZXRhaWxzL2RldGFpbHMuanN4Iiwid2VicGFjazovLy8uL2FwcC9SZXNvdXJjZXMvY2xpZW50L2pzeC9wcm9qZWN0L2RldGFpbHMvbWFwcGluZy5qc3giLCJ3ZWJwYWNrOi8vLy4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L3Byb2plY3QvZGV0YWlscy9tZXRhZGF0YS5qc3giLCJ3ZWJwYWNrOi8vLy4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L3Byb2plY3QvZGV0YWlscy9waGluY2guanN4Iiwid2VicGFjazovLy8uL2FwcC9SZXNvdXJjZXMvY2xpZW50L2pzeC9wcm9qZWN0L2RldGFpbHMvdHJhaXQuanN4Il0sIm5hbWVzIjpbInJlcXVpcmUiLCIkIiwicmVhZHkiLCJ0ZXh0IiwiYmlvbSIsImlkIiwiY29tbWVudCIsInNoYXBlIiwibm56IiwidG9GaXhlZCIsIm9uIiwidmFsIiwiZm9jdXMiLCJjbGljayIsInNhdmVCaW9tVG9EQiIsImV4cG9ydFByb2plY3RBc0Jpb20iLCJleHBvcnRQc2V1ZG9UYXhUYWJsZSIsImV4cG9ydFRyYWl0Q2l0YXRpb25zVGFibGUiLCJhZGRNZXRhZGF0YVNhbXBsZSIsImFkZE1ldGFkYXRhT2JzZXJ2YXRpb24iLCJhcHBlbmQiLCJnZXRNZXRhZGF0YUtleXMiLCJtYXAiLCJ0cmFuc3Bvc2UiLCJ3cml0ZSIsInRoZW4iLCJiaW9tSnNvbiIsIndlYnNlcnZpY2VVcmwiLCJSb3V0aW5nIiwiZ2VuZXJhdGUiLCJhamF4IiwiZGF0YSIsImRidmVyc2lvbiIsImludGVybmFsUHJvamVjdElkIiwibWV0aG9kIiwic3VjY2VzcyIsImxvY2F0aW9uIiwicmVsb2FkIiwiZmFpbHVyZSIsImNvbnNvbGUiLCJsb2ciLCJ3aW5kb3ciLCJhc0hkZjUiLCJjb252ZXJzaW9uU2VydmVyVVJMIiwiY29udGVudFR5cGUiLCJjb252ZXJzaW9uU2VydmVyIiwiYmlvbUNvbnRlbnQiLCJibG9iIiwiQmxvYiIsInR5cGUiLCJzYXZlQXMiLCJzaG93TWVzc2FnZURpYWxvZyIsInRheCIsIl8iLCJjbG9uZURlZXAiLCJnZXRNZXRhZGF0YSIsImRpbWVuc2lvbiIsImF0dHJpYnV0ZSIsImhlYWRlciIsIm5leHRMZXZlbCIsIm1heCIsImVsZW0iLCJsZW5ndGgiLCJvdHVpZHMiLCJyb3dzIiwiciIsInYiLCJpIiwidW5zaGlmdCIsInNsaWNlIiwidHJhaXQiLCJPYmplY3QiLCJrZXlzIiwibWV0YWRhdGEiLCJ0cmFpdFZhbHVlcyIsIm91dCIsImpvaW4iLCJlbnRyaWVzIiwiZW50cnkiLCJmZW5uZWNfaWQiLCJnZXQiLCJ0cmFpdFR5cGUiLCJ0YyIsImV2ZW50IiwiZmlsZXMiLCJ0YXJnZXQiLCJmciIsIkZpbGVSZWFkZXIiLCJvbmxvYWQiLCJhZGRNZXRhZGF0YVRvRmlsZSIsInJlc3VsdCIsInVwZGF0ZVByb2plY3QiLCJyZWFkQXNUZXh0IiwidG9TdHJpbmciLCJlcnJvciIsImNhbGxiYWNrIiwiY3N2RGF0YSIsIlBhcGEiLCJwYXJzZSIsInNraXBFbXB0eUxpbmVzIiwiZXJyb3JzIiwibWVzc2FnZSIsInJvdyIsInNhbXBsZU1ldGFkYXRhIiwibWV0YWRhdGFLZXlzIiwiaWRLZXkiLCJzcGxpY2UiLCJrZXkiLCJlYWNoIiwidmFsdWUiLCJhZGRNZXRhZGF0YSIsImlkc0Zyb21CaW9tIiwibWFwcGluZyIsImZlbm5lY19pZHMiLCJBcnJheSIsImZpbGwiLCJmZW5uZWNJZHMyc2NpbmFtZXMiLCJnZXRTY2luYW1lcyIsInZhbHVlcyIsInNjaW5hbWVzIiwiaWRzRnJvbUJpb21Ob3ROdWxsQ291bnQiLCJpZHNGcm9tQmlvbU1hcHBlZENvdW50IiwiaXNBcnJheSIsImRlZmF1bHRWYWx1ZSIsImlkU3RyaW5nIiwiZ2V0SWRTdHJpbmdGb3JNZXRob2QiLCJzaG93IiwiZSIsImhpZGUiLCJoYW5kbGVNYXBwaW5nUmVzdWx0Iiwic2FtcGxlT3JnYW5pc21JRHMiLCJmaWx0ZXIiLCJlbGVtZW50Iiwib3R1T3JnYW5pc21JRHMiLCJtYXBwZWRTYW1wbGVzIiwicGVyY2VudGFnZU1hcHBlZFNhbXBsZXMiLCJtYXBwZWRPVFVzIiwicGVyY2VudGFnZU1hcHBlZE9UVXMiLCJjc3MiLCJhdHRyIiwibWV0aG9kcyIsIm5jYmlfdGF4b25vbXkiLCJvcmdhbmlzbV9uYW1lIiwiaXVjbl9yZWRsaXN0IiwiRU9MIiwiYWRkT3B0aW9uVG9TZWxlY3RwaWNrZXIiLCJzYW1wbGVNZXRhZGF0YUtleXMiLCJvYnNlcnZhdGlvbk1ldGFkYXRhS2V5cyIsInNlbGVjdHBpY2tlciIsImNoYW5nZSIsImlkcyIsImdldElkc0ZvckF0dHJpYnV0ZSIsInVuaXFfaWRzIiwidW5pcSIsImdldFdlYnNlcnZpY2VVcmxGb3JNZXRob2QiLCJkYiIsInN0YXR1cyIsImNvbXBsZXRlIiwib3B0aW9uIiwicHJvcCIsInN1YnN0ciIsIm1ldGhvZDJzZXJ2aWNlIiwiZmxhdHRlbiIsIngiLCJtYXBwaW5nSWRzIiwiZmVubmVjSWRzIiwiaWRIZWFkZXIiLCJjc3YiLCJpbml0VGFibGUiLCJ0YWJsZUNvbmZpZyIsIm9yZGVyIiwiZG9tIiwiYnV0dG9ucyIsInNjcm9sbFgiLCJnZXRUYWJsZURhdGEiLCJkaW1NZXRhZGF0YSIsInN1bSIsImdldERhdGFDb2x1bW4iLCJnZXREYXRhUm93IiwibSIsImNvbHVtbnMiLCJ0aXRsZSIsInNldFRpbWVvdXQiLCJEYXRhVGFibGUiLCJhc3NpZ24iLCJhZGp1c3RJZnJhbWVIZWlnaHQiLCJjb250ZW50cyIsImhlaWdodCIsIm9wZW4iLCJzZXJ2ZXIiLCJ2ZXJzaW9uIiwic2NoZW1hIiwia2V5UGF0aCIsImF1dG9JbmNyZW1lbnQiLCJkb25lIiwiYmlvbVRvU3RvcmUiLCJuYW1lIiwiYmlvbVN0cmluZyIsInNpemUiLCJkIiwiRGF0ZSIsImRhdGUiLCJnZXRVVENGdWxsWWVhciIsImdldFVUQ01vbnRoIiwiZ2V0VVRDRGF0ZSIsImdldFVUQ0hvdXJzIiwiZ2V0VVRDTWludXRlcyIsImdldFVUQ1NlY29uZHMiLCJhZGQiLCJpdGVtIiwicGhpbmNoUHJldmlld1BhdGgiLCJnZXRBbmRTaG93VHJhaXRzIiwidHJhaXRzIiwidGhpc1RyYWl0IiwiY291bnQiLCJyYW5nZSIsInB1c2giLCJpbml0VHJhaXRzT2ZQcm9qZWN0VGFibGUiLCJ0YWJsZUlkIiwiY29sdW1uRGVmcyIsInRhcmdldHMiLCJyZW5kZXIiLCJNYXRoIiwicm91bmQiLCJmdWxsIiwiaHJlZiIsImluZGV4T2YiLCJhZGRUcmFpdFRvUHJvamVjdFRhYmxlQWN0aW9uIiwidHJhaXRUeXBlSWQiLCJ1cmwiLCJ0cmFpdF9mb3JtYXQiLCJjb25kZW5zZU51bWVyaWNhbFRyYWl0VmFsdWVzIiwiY29uZGVuc2VDYXRlZ29yaWNhbFRyYWl0VmFsdWVzIiwiYWRkVHJhaXRUb1Byb2plY3QiLCJjaXRhdGlvbnMiLCJyZW1vdmVUcmFpdEZyb21Qcm9qZWN0VGFibGVBY3Rpb24iLCJ0cmFpdE5hbWUiLCJyZW1vdmVUcmFpdEZyb21Qcm9qZWN0Il0sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG1CQUFBQSxDQUFRLHdEQUFSO0FBQ0EsbUJBQUFBLENBQVEsd0RBQVI7QUFDQSxtQkFBQUEsQ0FBUSx5REFBUjtBQUNBLG1CQUFBQSxDQUFRLHVEQUFSO0FBQ0EsbUJBQUFBLENBQVEsc0RBQVIsRTs7Ozs7OztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQUMsRUFBRSxVQUFGLEVBQWNDLEtBQWQsQ0FBb0IsWUFBWTtBQUM1QjtBQUNBRCxNQUFFLGNBQUYsRUFBa0JFLElBQWxCLENBQXVCQyxLQUFLQyxFQUE1Qjs7QUFFQTtBQUNBSixNQUFFLDRCQUFGLEVBQWdDRSxJQUFoQyxDQUFxQ0MsS0FBS0MsRUFBMUM7QUFDQUosTUFBRSxpQ0FBRixFQUFxQ0UsSUFBckMsQ0FBMENDLEtBQUtFLE9BQS9DO0FBQ0FMLE1BQUUsOEJBQUYsRUFBa0NF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QUNIO0FBakJGLEtBQVA7QUFtQkg7O0FBRUQsU0FBU3NNLGlDQUFULENBQTJDQyxTQUEzQyxFQUFzRHBMLFNBQXRELEVBQWdFO0FBQzVEcUwsMkJBQXVCRCxTQUF2QixFQUFrQ3hPLElBQWxDLEVBQXdDb0QsU0FBeEMsRUFBbUR4QixTQUFuRCxFQUE4REMsaUJBQTlELEVBQWlGLE1BQU1RLE9BQU9MLFFBQVAsQ0FBZ0JDLE1BQWhCLEVBQXZGO0FBQ0gsQyIsImZpbGUiOiJwcm9qZWN0L2RldGFpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCcuL2RldGFpbHMvZGV0YWlscy5qc3gnKVxucmVxdWlyZSgnLi9kZXRhaWxzL21hcHBpbmcuanN4JylcbnJlcXVpcmUoJy4vZGV0YWlscy9tZXRhZGF0YS5qc3gnKVxucmVxdWlyZSgnLi9kZXRhaWxzL3BoaW5jaC5qc3gnKVxucmVxdWlyZSgnLi9kZXRhaWxzL3RyYWl0LmpzeCcpXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L3Byb2plY3QvZGV0YWlscy5qc3giLCIvKiBnbG9iYWwgZGJ2ZXJzaW9uICovXG4vKiBnbG9iYWwgYmlvbSAqL1xuLyogZ2xvYmFsIF8gKi9cbi8qIGdsb2JhbCAkICovXG4vKiBnbG9iYWwgaW50ZXJuYWxQcm9qZWN0SWQgKi9cbiQoJ2RvY3VtZW50JykucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgIC8vIFNldCBoZWFkZXIgb2YgcGFnZSB0byBwcm9qZWN0LWlkXG4gICAgJCgnLnBhZ2UtaGVhZGVyJykudGV4dChiaW9tLmlkKTtcblxuICAgIC8vIEZpbGwgb3ZlcnZpZXcgdGFibGUgd2l0aCB2YWx1ZXNcbiAgICAkKCcjcHJvamVjdC1vdmVydmlldy10YWJsZS1pZCcpLnRleHQoYmlvbS5pZCk7XG4gICAgJCgnI3Byb2plY3Qtb3ZlcnZpZXctdGFibGUtY29tbWVudCcpLnRleHQoYmlvbS5jb21tZW50KTtcbiAgICAkKCcjcHJvamVjdC1vdmVydmlldy10YWJsZS1yb3dzJykudGV4dChiaW9tLnNoYXBlWzBdKTtcbiAgICAkKCcjcHJvamVjdC1vdmVydmlldy10YWJsZS1jb2xzJykudGV4dChiaW9tLnNoYXBlWzFdKTtcbiAgICAkKCcjcHJvamVjdC1vdmVydmlldy10YWJsZS1ubnonKS50ZXh0KGJpb20ubm56ICsgXCIgKFwiICsgKDEwMCAqIGJpb20ubm56IC8gKGJpb20uc2hhcGVbMF0gKiBiaW9tLnNoYXBlWzFdKSkudG9GaXhlZCgyKSArIFwiJSlcIik7XG5cbiAgICAvLyBTZXQgYWN0aW9uIGlmIGVkaXQgZGlhbG9nIGlzIHNob3duXG4gICAgJCgnI2VkaXRQcm9qZWN0RGlhbG9nJykub24oJ3Nob3duLmJzLm1vZGFsJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAkKCcjZWRpdFByb2plY3REaWFsb2dQcm9qZWN0SUQnKS52YWwoYmlvbS5pZCk7XG4gICAgICAgICQoJyNlZGl0UHJvamVjdERpYWxvZ0NvbW1lbnQnKS52YWwoYmlvbS5jb21tZW50KTtcbiAgICAgICAgJCgnI2VkaXRQcm9qZWN0RGlhbG9nUHJvamVjdElEJykuZm9jdXMoKTtcbiAgICB9KTtcblxuICAgIC8vIFNldCBhY3Rpb24gaWYgZWRpdCBkaWFsb2cgaXMgc2F2ZWRcbiAgICAkKCcjZWRpdFByb2plY3REaWFsb2dTYXZlQnV0dG9uJykuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICBiaW9tLmlkID0gJCgnI2VkaXRQcm9qZWN0RGlhbG9nUHJvamVjdElEJykudmFsKCk7XG4gICAgICAgIGJpb20uY29tbWVudCA9ICQoJyNlZGl0UHJvamVjdERpYWxvZ0NvbW1lbnQnKS52YWwoKTtcbiAgICAgICAgc2F2ZUJpb21Ub0RCKCk7XG4gICAgfSk7XG5cbiAgICAkKCcjcHJvamVjdC1leHBvcnQtYXMtYmlvbS12MScpLmNsaWNrKCgpID0+IHtcbiAgICAgICAgZXhwb3J0UHJvamVjdEFzQmlvbShmYWxzZSk7XG4gICAgfSk7XG5cbiAgICAkKCcjcHJvamVjdC1leHBvcnQtYXMtYmlvbS12MicpLmNsaWNrKCgpID0+IHtcbiAgICAgICAgZXhwb3J0UHJvamVjdEFzQmlvbSh0cnVlKTtcbiAgICB9KTtcblxuICAgICQoJyNwcm9qZWN0LWV4cG9ydC1wc2V1ZG8tdGF4LWJpb20nKS5jbGljayhleHBvcnRQc2V1ZG9UYXhUYWJsZSk7XG5cbiAgICAkKCcjcHJvamVjdC1leHBvcnQtdHJhaXQtY2l0YXRpb24tb3R1cycpLmNsaWNrKCgpPT5leHBvcnRUcmFpdENpdGF0aW9uc1RhYmxlKCdyb3dzJykpO1xuICAgICQoJyNwcm9qZWN0LWV4cG9ydC10cmFpdC1jaXRhdGlvbi1zYW1wbGVzJykuY2xpY2soKCk9PmV4cG9ydFRyYWl0Q2l0YXRpb25zVGFibGUoJ2NvbHVtbnMnKSk7XG5cbiAgICAkKCcjcHJvamVjdC1hZGQtbWV0YWRhdGEtc2FtcGxlJykub24oXCJjaGFuZ2VcIiwgYWRkTWV0YWRhdGFTYW1wbGUpO1xuICAgICQoJyNwcm9qZWN0LWFkZC1tZXRhZGF0YS1vYnNlcnZhdGlvbicpLm9uKFwiY2hhbmdlXCIsIGFkZE1ldGFkYXRhT2JzZXJ2YXRpb24pO1xuXG4gICAgJCgnI21ldGFkYXRhLW92ZXJ2aWV3LXNhbXBsZScpLmFwcGVuZChnZXRNZXRhZGF0YUtleXMoYmlvbSwgJ2NvbHVtbnMnKS5tYXAoKHRleHQpID0+ICQoXCI8bGk+XCIpLnRleHQodGV4dCkpKTtcbiAgICAkKCcjbWV0YWRhdGEtb3ZlcnZpZXctb2JzZXJ2YXRpb24nKS5hcHBlbmQoZ2V0TWV0YWRhdGFLZXlzKGJpb20sICdyb3dzJykubWFwKCh0ZXh0KSA9PiAkKFwiPGxpPlwiKS50ZXh0KHRleHQpKSk7XG5cbiAgICAkKCcjcHJvamVjdC10cmFuc3Bvc2UnKS5jbGljaygoKSA9PiB7XG4gICAgICAgIGJpb20udHJhbnNwb3NlKCk7XG4gICAgICAgIHNhdmVCaW9tVG9EQigpO1xuICAgIH0pO1xufSk7XG5cbi8qKlxuICogU2F2ZXMgdGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIGdsb2JhbCBiaW9tIHZhcmlhYmxlIHRvIHRoZSBwb3N0Z3JlcyBkYXRhYmFzZVxuICovXG5mdW5jdGlvbiBzYXZlQmlvbVRvREIoKSB7XG4gICAgYmlvbS53cml0ZSgpLnRoZW4oZnVuY3Rpb24gKGJpb21Kc29uKSB7XG4gICAgICAgIHZhciB3ZWJzZXJ2aWNlVXJsID0gUm91dGluZy5nZW5lcmF0ZSgnYXBpJywgeyduYW1lc3BhY2UnOiAnZWRpdCcsICdjbGFzc25hbWUnOiAndXBkYXRlUHJvamVjdCd9KTtcbiAgICAgICAgJC5hamF4KHdlYnNlcnZpY2VVcmwsIHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBcImRidmVyc2lvblwiOiBkYnZlcnNpb24sXG4gICAgICAgICAgICAgICAgXCJwcm9qZWN0X2lkXCI6IGludGVybmFsUHJvamVjdElkLFxuICAgICAgICAgICAgICAgIFwiYmlvbVwiOiBiaW9tSnNvblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgbG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sIGZ1bmN0aW9uIChmYWlsdXJlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGZhaWx1cmUpO1xuICAgIH0pO1xufVxuXG4vLyBleHBvcnQgZ2xvYmFsbHlcbndpbmRvdy5zYXZlQmlvbVRvREIgPSBzYXZlQmlvbVRvREI7XG5cbi8qKlxuICogT3BlbnMgYSBmaWxlIGRvd25sb2FkIGRpYWxvZyBvZiB0aGUgY3VycmVudCBwcm9qZWN0IGluIGJpb20gZm9ybWF0XG4gKiBAcGFyYW0ge2Jvb2xlYW59IGFzSGRmNVxuICovXG5mdW5jdGlvbiBleHBvcnRQcm9qZWN0QXNCaW9tKGFzSGRmNSkge1xuICAgIGxldCBjb252ZXJzaW9uU2VydmVyVVJMID0gUm91dGluZy5nZW5lcmF0ZSgnYmlvbWNzX2NvbnZlcnQnKTtcbiAgICBsZXQgY29udGVudFR5cGUgPSBhc0hkZjUgPyBcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiIDogXCJ0ZXh0L3BsYWluXCI7XG4gICAgYmlvbS53cml0ZSh7Y29udmVyc2lvblNlcnZlcjogY29udmVyc2lvblNlcnZlclVSTCwgYXNIZGY1OiBhc0hkZjV9KS50aGVuKGZ1bmN0aW9uIChiaW9tQ29udGVudCkge1xuICAgICAgICB2YXIgYmxvYiA9IG5ldyBCbG9iKFtiaW9tQ29udGVudF0sIHt0eXBlOiBjb250ZW50VHlwZX0pO1xuICAgICAgICBzYXZlQXMoYmxvYiwgYmlvbS5pZCtcIi5iaW9tXCIpO1xuICAgIH0sIGZ1bmN0aW9uIChmYWlsdXJlKSB7XG4gICAgICAgIHNob3dNZXNzYWdlRGlhbG9nKGZhaWx1cmUrXCJcIiwgJ2RhbmdlcicpO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIE9wZW5zIGEgZmlsZSBkb3dubG9hZCBkaWFsb2cgb2YgdGhlIGN1cnJlbnQgcHJvamVjdCBpbiB0c3YgZm9ybWF0IChwc2V1ZG8gdGF4b25vbXkpXG4gKi9cbmZ1bmN0aW9uIGV4cG9ydFBzZXVkb1RheFRhYmxlKCkge1xuICAgIGxldCBjb250ZW50VHlwZSA9IFwidGV4dC9wbGFpblwiO1xuICAgIGxldCB0YXggPSBfLmNsb25lRGVlcChiaW9tLmdldE1ldGFkYXRhKHtkaW1lbnNpb246ICdyb3dzJywgYXR0cmlidXRlOiAndGF4b25vbXknfSkpO1xuICAgIGxldCBoZWFkZXIgPSBbJ09UVUlEJywgJ2tpbmdkb20nLCAncGh5bHVtJywgJ2NsYXNzJywgJ29yZGVyJywgJ2ZhbWlseScsICdnZW51cycsICdzcGVjaWVzJ107XG4gICAgbGV0IG5leHRMZXZlbCA9IF8ubWF4KHRheC5tYXAoZWxlbSA9PiBlbGVtLmxlbmd0aCkpO1xuICAgIGxldCBvdHVpZHMgPSBiaW9tLnJvd3MubWFwKHIgPT4gci5pZCk7XG4gICAgdGF4Lm1hcCgodixpKSA9PiB2LnVuc2hpZnQob3R1aWRzW2ldKSk7XG4gICAgbmV4dExldmVsKys7XG4gICAgaGVhZGVyID0gaGVhZGVyLnNsaWNlKDAsIG5leHRMZXZlbCk7XG4gICAgZm9yKGxldCB0cmFpdCBvZiBPYmplY3Qua2V5cyhiaW9tLnJvd3NbMF0ubWV0YWRhdGEpKXtcbiAgICAgICAgaWYodHJhaXQgPT09ICd0YXhvbm9teScpe1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHRyYWl0VmFsdWVzID0gYmlvbS5nZXRNZXRhZGF0YSh7ZGltZW5zaW9uOiAncm93cycsIGF0dHJpYnV0ZTogdHJhaXR9KTtcbiAgICAgICAgaGVhZGVyW25leHRMZXZlbF0gPSB0cmFpdDtcbiAgICAgICAgdGF4Lm1hcCgodixpKSA9PiB2W25leHRMZXZlbF0gPSB0cmFpdFZhbHVlc1tpXSk7XG4gICAgICAgIG5leHRMZXZlbCsrO1xuICAgIH1cbiAgICBsZXQgb3V0ID0gXy5qb2luKGhlYWRlciwgXCJcXHRcIik7XG4gICAgb3V0ICs9IFwiXFxuXCI7XG4gICAgb3V0ICs9IF8uam9pbih0YXgubWFwKHYgPT4gXy5qb2luKHYsXCJcXHRcIikpLCBcIlxcblwiKTtcbiAgICBjb25zdCBibG9iID0gbmV3IEJsb2IoW291dF0sIHt0eXBlOiBjb250ZW50VHlwZX0pO1xuICAgIHNhdmVBcyhibG9iLCBiaW9tLmlkK1wiLnRzdlwiKTtcbn1cblxuLyoqXG4gKiBPcGVucyBhIGZpbGUgZG93bmxvYWQgZGlhbG9nIG9mIGFsbCB0cmFpdCBjaXRhdGlvbnMgZm9yIHRoaXMgcHJvamVjdFxuICovXG5mdW5jdGlvbiBleHBvcnRUcmFpdENpdGF0aW9uc1RhYmxlKGRpbWVuc2lvbikge1xuICAgIGNvbnN0IGNvbnRlbnRUeXBlID0gXCJ0ZXh0L3BsYWluXCI7XG4gICAgbGV0IG91dCA9IF8uam9pbihbKGRpbWVuc2lvbj09PVwicm93c1wiID8gJyNPVFVJZCcgOiAnI1NhbXBsZUlkJyksICdmZW5uZWNfaWQnLCAndHJhaXRUeXBlJywgJ2NpdGF0aW9uJywgJ3ZhbHVlJ10sIFwiXFx0XCIpK1wiXFxuXCI7XG4gICAgbGV0IGVudHJpZXMgPSBiaW9tW2RpbWVuc2lvbl1cbiAgICBmb3IobGV0IGVudHJ5IG9mIGVudHJpZXMpe1xuICAgICAgICBsZXQgaWQgPSBlbnRyeS5pZDtcbiAgICAgICAgbGV0IGZlbm5lY19pZCA9IF8uZ2V0KGVudHJ5LCBbJ21ldGFkYXRhJywgJ2Zlbm5lYycsIGRidmVyc2lvbiwgJ2Zlbm5lY19pZCddKSB8fCAnJztcbiAgICAgICAgZm9yKGxldCB0cmFpdFR5cGUgb2YgT2JqZWN0LmtleXMoXy5nZXQoZW50cnksIFsnbWV0YWRhdGEnLCAndHJhaXRfY2l0YXRpb25zJ10pfHx7fSkpe1xuICAgICAgICAgICAgZm9yKGxldCB0YyBvZiBfLmdldChlbnRyeSwgWydtZXRhZGF0YScsICd0cmFpdF9jaXRhdGlvbnMnLCB0cmFpdFR5cGVdKSl7XG4gICAgICAgICAgICAgICAgb3V0ICs9IF8uam9pbihbaWQsIGZlbm5lY19pZCwgdHJhaXRUeXBlLCB0Y1snY2l0YXRpb24nXSwgdGNbJ3ZhbHVlJ11dLCBcIlxcdFwiKStcIlxcblwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbb3V0XSwge3R5cGU6IGNvbnRlbnRUeXBlfSk7XG4gICAgc2F2ZUFzKGJsb2IsIGJpb20uaWQrKGRpbWVuc2lvbj09PVwicm93c1wiID8gXCIuT1RVXCIgOiBcIi5zYW1wbGVcIikrXCIuY2l0YXRpb25zLnRzdlwiKTtcbn1cblxuLyoqXG4gKiBBZGQgc2FtcGxlIG1ldGFkYXRhIGZyb20gc2VsZWN0ZWQgZmlsZXNcbiAqIEBwYXJhbSB7ZXZlbnR9IGV2ZW50XG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gYWRkTWV0YWRhdGFTYW1wbGUoZXZlbnQpXG57XG4gICAgbGV0IGZpbGVzID0gZXZlbnQudGFyZ2V0LmZpbGVzO1xuICAgIGxldCBmciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgICBmci5vbmxvYWQgPSAoKSA9PiBhZGRNZXRhZGF0YVRvRmlsZShmci5yZXN1bHQsIHVwZGF0ZVByb2plY3QsICdjb2x1bW5zJylcbiAgICBmci5yZWFkQXNUZXh0KGZpbGVzWzBdKTtcbn1cblxuLyoqXG4gKiBBZGQgb2JzZXJ2YXRpb24gbWV0YWRhdGEgZnJvbSBzZWxlY3RlZCBmaWxlc1xuICogQHBhcmFtIHtldmVudH0gZXZlbnRcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5mdW5jdGlvbiBhZGRNZXRhZGF0YU9ic2VydmF0aW9uKGV2ZW50KVxue1xuICAgIGxldCBmaWxlcyA9IGV2ZW50LnRhcmdldC5maWxlcztcbiAgICBsZXQgZnIgPSBuZXcgRmlsZVJlYWRlcigpXG4gICAgZnIub25sb2FkID0gKCkgPT4gYWRkTWV0YWRhdGFUb0ZpbGUoZnIucmVzdWx0LCB1cGRhdGVQcm9qZWN0LCAncm93cycpXG4gICAgZnIucmVhZEFzVGV4dChmaWxlc1swXSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVByb2plY3QoKSB7XG4gICAgbGV0IHdlYnNlcnZpY2VVcmwgPSBSb3V0aW5nLmdlbmVyYXRlKCdhcGknLCB7J25hbWVzcGFjZSc6ICdlZGl0JywgJ2NsYXNzbmFtZSc6ICd1cGRhdGVQcm9qZWN0J30pO1xuICAgICQuYWpheCh3ZWJzZXJ2aWNlVXJsLCB7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIFwiZGJ2ZXJzaW9uXCI6IGRidmVyc2lvbixcbiAgICAgICAgICAgIFwicHJvamVjdF9pZFwiOiBpbnRlcm5hbFByb2plY3RJZCxcbiAgICAgICAgICAgIFwiYmlvbVwiOiBiaW9tLnRvU3RyaW5nKClcbiAgICAgICAgfSxcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgc3VjY2VzczogKCkgPT4gc2hvd01lc3NhZ2VEaWFsb2coJ1N1Y2Nlc3NmdWxseSBhZGRlZCBtZXRhZGF0YS4nLCAnc3VjY2VzcycpLFxuICAgICAgICBlcnJvcjogKGVycm9yKSA9PiBzaG93TWVzc2FnZURpYWxvZyhlcnJvciwgJ2RhbmdlcicpXG4gICAgfSk7XG59XG5cbi8qKlxuICogQWRkIHNhbXBsZSBtZXRhZGF0YSBjb250ZW50IHRvIGZpbGVcbiAqIEBwYXJhbSB7U3RyaW5nfSByZXN1bHRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcGFyYW0ge1N0cmluZ30gZGltZW5zaW9uXG4gKi9cbmZ1bmN0aW9uIGFkZE1ldGFkYXRhVG9GaWxlKHJlc3VsdCwgY2FsbGJhY2ssIGRpbWVuc2lvbj0nY29sdW1ucycpe1xuICAgIGxldCBjc3ZEYXRhID0gUGFwYS5wYXJzZShyZXN1bHQsIHtoZWFkZXI6IHRydWUsIHNraXBFbXB0eUxpbmVzOiB0cnVlfSlcbiAgICBpZihjc3ZEYXRhLmVycm9ycy5sZW5ndGggPiAwKXtcbiAgICAgICAgc2hvd01lc3NhZ2VEaWFsb2coY3N2RGF0YS5lcnJvcnNbMF0ubWVzc2FnZSsnIGxpbmU6ICcrY3N2RGF0YS5lcnJvcnNbMF0ucm93LCAnZGFuZ2VyJyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYoY3N2RGF0YS5kYXRhLmxlbmd0aCA9PT0gMCl7XG4gICAgICAgIHNob3dNZXNzYWdlRGlhbG9nKFwiQ291bGQgbm90IHBhcnNlIGZpbGUuIE5vIGRhdGEgZm91bmQuXCIsICdkYW5nZXInKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgc2FtcGxlTWV0YWRhdGEgPSB7fVxuICAgIGxldCBtZXRhZGF0YUtleXMgPSBPYmplY3Qua2V5cyhjc3ZEYXRhLmRhdGFbMF0pO1xuICAgIGxldCBpZEtleSA9IG1ldGFkYXRhS2V5cy5zcGxpY2UoMCwxKVswXTtcbiAgICBmb3IobGV0IGtleSBvZiBtZXRhZGF0YUtleXMpe1xuICAgICAgICBzYW1wbGVNZXRhZGF0YVtrZXldID0ge31cbiAgICB9XG4gICAgZm9yKGxldCByb3cgb2YgY3N2RGF0YS5kYXRhKXtcbiAgICAgICAgJC5lYWNoKHJvdywgKGtleSwgdmFsdWUpID0+IHtcbiAgICAgICAgICAgIGlmKGtleSAhPT0gaWRLZXkpe1xuICAgICAgICAgICAgICAgIHNhbXBsZU1ldGFkYXRhW2tleV1bcm93W2lkS2V5XV0gPSB2YWx1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbiAgICAkLmVhY2goc2FtcGxlTWV0YWRhdGEsIChrZXksdmFsdWUpPT57XG4gICAgICAgIGJpb20uYWRkTWV0YWRhdGEoeydkaW1lbnNpb24nOiBkaW1lbnNpb24sICdhdHRyaWJ1dGUnOiBrZXksICd2YWx1ZXMnOiB2YWx1ZX0pXG4gICAgfSlcbiAgICBjYWxsYmFjaygpO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L3Byb2plY3QvZGV0YWlscy9kZXRhaWxzLmpzeCIsIi8qIGdsb2JhbCBkYnZlcnNpb24gKi9cbi8qIGdsb2JhbCBiaW9tICovXG4vKiBnbG9iYWwgXyAqL1xuXG4kKCdkb2N1bWVudCcpLnJlYWR5KCgpID0+IHtcbiAgICAvLyBDYWxjdWxhdGUgdmFsdWVzIGZvciBtYXBwaW5nIG92ZXJ2aWV3IHRhYmxlXG4gICAgbGV0IHNhbXBsZU9yZ2FuaXNtSURzID0gYmlvbS5nZXRNZXRhZGF0YSh7ZGltZW5zaW9uOiAnY29sdW1ucycsIGF0dHJpYnV0ZTogWydmZW5uZWMnLCBkYnZlcnNpb24sICdmZW5uZWNfaWQnXX0pLmZpbHRlcihlbGVtZW50ID0+IGVsZW1lbnQgIT09IG51bGwpO1xuICAgIGxldCBvdHVPcmdhbmlzbUlEcyA9IGJpb20uZ2V0TWV0YWRhdGEoe2RpbWVuc2lvbjogJ3Jvd3MnLCBhdHRyaWJ1dGU6IFsnZmVubmVjJywgZGJ2ZXJzaW9uLCAnZmVubmVjX2lkJ119KS5maWx0ZXIoZWxlbWVudCA9PiBlbGVtZW50ICE9PSBudWxsKTtcbiAgICB2YXIgbWFwcGVkU2FtcGxlcyA9IHNhbXBsZU9yZ2FuaXNtSURzLmxlbmd0aDtcbiAgICB2YXIgcGVyY2VudGFnZU1hcHBlZFNhbXBsZXMgPSAxMDAgKiBtYXBwZWRTYW1wbGVzIC8gYmlvbS5zaGFwZVsxXTtcbiAgICB2YXIgbWFwcGVkT1RVcyA9IG90dU9yZ2FuaXNtSURzLmxlbmd0aDtcbiAgICB2YXIgcGVyY2VudGFnZU1hcHBlZE9UVXMgPSAxMDAgKiBtYXBwZWRPVFVzIC8gYmlvbS5zaGFwZVswXTtcblxuICAgIC8vIEFkZCB2YWx1ZXMgdG8gbWFwcGluZyBvdmVydmlldyB0YWJsZVxuICAgICQoJyNtYXBwaW5nLW90dScpLnRleHQobWFwcGVkT1RVcyk7XG4gICAgJCgnI3Byb2dyZXNzLWJhci1tYXBwaW5nLW90dScpLmNzcygnd2lkdGgnLCBwZXJjZW50YWdlTWFwcGVkT1RVcyArICclJykuYXR0cignYXJpYS12YWx1ZW5vdycsIHBlcmNlbnRhZ2VNYXBwZWRPVFVzKTtcbiAgICAkKCcjcHJvZ3Jlc3MtYmFyLW1hcHBpbmctb3R1JykudGV4dChwZXJjZW50YWdlTWFwcGVkT1RVcy50b0ZpeGVkKDApICsgJyUnKTtcbiAgICAkKCcjbWFwcGluZy1zYW1wbGUnKS50ZXh0KG1hcHBlZFNhbXBsZXMpO1xuICAgICQoJyNwcm9ncmVzcy1iYXItbWFwcGluZy1zYW1wbGUnKS5jc3MoJ3dpZHRoJywgcGVyY2VudGFnZU1hcHBlZFNhbXBsZXMgKyAnJScpLmF0dHIoJ2FyaWEtdmFsdWVub3cnLCBwZXJjZW50YWdlTWFwcGVkU2FtcGxlcyk7XG4gICAgJCgnI3Byb2dyZXNzLWJhci1tYXBwaW5nLXNhbXBsZScpLnRleHQocGVyY2VudGFnZU1hcHBlZFNhbXBsZXMudG9GaXhlZCgwKSArICclJyk7XG5cbiAgICBsZXQgbWV0aG9kcyA9IHtuY2JpX3RheG9ub215OiBcIk5DQkkgdGF4aWRcIiwgb3JnYW5pc21fbmFtZTogXCJTY2llbnRpZmljIG5hbWVcIiwgaXVjbl9yZWRsaXN0OiBcIklVQ04gaWRcIiwgRU9MOiBcIkVPTCBpZFwifTtcbiAgICAkLmVhY2gobWV0aG9kcywgKGtleSwgdmFsdWUpID0+IHtcbiAgICAgICAgYWRkT3B0aW9uVG9TZWxlY3RwaWNrZXIoa2V5LCB2YWx1ZSwgJ21hcHBpbmctbWV0aG9kLXNlbGVjdCcpO1xuICAgIH0pXG5cbiAgICBsZXQgc2FtcGxlTWV0YWRhdGFLZXlzID0gZ2V0TWV0YWRhdGFLZXlzKGJpb20sICdjb2x1bW5zJyk7XG4gICAgYWRkT3B0aW9uVG9TZWxlY3RwaWNrZXIoJ0lEJywgJ0lEJywgJ21hcHBpbmctbWV0YWRhdGEtc2FtcGxlLXNlbGVjdCcpXG4gICAgJC5lYWNoKHNhbXBsZU1ldGFkYXRhS2V5cywgKGtleSwgdmFsdWUpID0+IHtcbiAgICAgICAgYWRkT3B0aW9uVG9TZWxlY3RwaWNrZXIoJ21kOicrdmFsdWUsIHZhbHVlLCAnbWFwcGluZy1tZXRhZGF0YS1zYW1wbGUtc2VsZWN0JylcbiAgICB9KVxuXG4gICAgbGV0IG9ic2VydmF0aW9uTWV0YWRhdGFLZXlzID0gZ2V0TWV0YWRhdGFLZXlzKGJpb20sICdyb3dzJyk7XG4gICAgYWRkT3B0aW9uVG9TZWxlY3RwaWNrZXIoJ0lEJywgJ0lEJywgJ21hcHBpbmctbWV0YWRhdGEtb2JzZXJ2YXRpb24tc2VsZWN0JylcbiAgICAkLmVhY2gob2JzZXJ2YXRpb25NZXRhZGF0YUtleXMsIChrZXksIHZhbHVlKSA9PiB7XG4gICAgICAgIGFkZE9wdGlvblRvU2VsZWN0cGlja2VyKCdtZDonK3ZhbHVlLCB2YWx1ZSwgJ21hcHBpbmctbWV0YWRhdGEtb2JzZXJ2YXRpb24tc2VsZWN0JylcbiAgICB9KVxuXG4gICAgJCgnI21hcHBpbmctZGltZW5zaW9uLXNlbGVjdCcpLm9uKCdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAgIGlmKCQoJyNtYXBwaW5nLWRpbWVuc2lvbi1zZWxlY3QnKS52YWwoKSA9PT0gJ3Jvd3MnKXtcbiAgICAgICAgICAgICQoJyNtYXBwaW5nLW1ldGFkYXRhLXNhbXBsZS1zZWxlY3QnKS5zZWxlY3RwaWNrZXIoJ2hpZGUnKTtcbiAgICAgICAgICAgICQoJyNtYXBwaW5nLW1ldGFkYXRhLW9ic2VydmF0aW9uLXNlbGVjdCcpLnNlbGVjdHBpY2tlcignc2hvdycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCgnI21hcHBpbmctbWV0YWRhdGEtc2FtcGxlLXNlbGVjdCcpLnNlbGVjdHBpY2tlcignc2hvdycpO1xuICAgICAgICAgICAgJCgnI21hcHBpbmctbWV0YWRhdGEtb2JzZXJ2YXRpb24tc2VsZWN0Jykuc2VsZWN0cGlja2VyKCdoaWRlJyk7XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgJCgnLnNlbGVjdHBpY2tlcicpLnNlbGVjdHBpY2tlcigncmVmcmVzaCcpXG4gICAgJCgnI21hcHBpbmctZGltZW5zaW9uLXNlbGVjdCcpLmNoYW5nZSgpO1xuXG4gICAgLy8gQWRkIHNlbWktZ2xvYmFsIGRpbWVuc2lvbiB2YXJpYWJsZSAoc3RvcmVzIGxhc3QgbWFwcGVkIGRpbWVuc2lvbilcbiAgICB2YXIgZGltZW5zaW9uID0gJ3Jvd3MnO1xuICAgIHZhciBtZXRob2QgPSAnbmNiaV90YXhvbm9teSc7XG4gICAgdmFyIGF0dHJpYnV0ZSA9ICcnO1xuXG4gICAgLy8gU2V0IGFjdGlvbiBmb3IgY2xpY2sgb24gbWFwcGluZyBcIkdPXCIgYnV0dG9uXG4gICAgJCgnI21hcHBpbmctYWN0aW9uLWJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZGltZW5zaW9uID0gJCgnI21hcHBpbmctZGltZW5zaW9uLXNlbGVjdCcpLnZhbCgpO1xuICAgICAgICBtZXRob2QgPSAkKCcjbWFwcGluZy1tZXRob2Qtc2VsZWN0JykudmFsKCk7XG4gICAgICAgIGlmKGRpbWVuc2lvbiA9PT0gJ3Jvd3MnKXtcbiAgICAgICAgICAgIGF0dHJpYnV0ZSA9ICQoJyNtYXBwaW5nLW1ldGFkYXRhLW9ic2VydmF0aW9uLXNlbGVjdCcpLnZhbCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXR0cmlidXRlID0gJCgnI21hcHBpbmctbWV0YWRhdGEtc2FtcGxlLXNlbGVjdCcpLnZhbCgpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBpZHMgPSBnZXRJZHNGb3JBdHRyaWJ1dGUoZGltZW5zaW9uLCBhdHRyaWJ1dGUpO1xuICAgICAgICBsZXQgdW5pcV9pZHMgPSBpZHMuZmlsdGVyKHZhbHVlID0+IHZhbHVlICE9PSBudWxsKTtcbiAgICAgICAgdW5pcV9pZHMgPSBfLnVuaXEodW5pcV9pZHMpO1xuICAgICAgICAkKCcjbWFwcGluZy1hY3Rpb24tYnVzeS1pbmRpY2F0b3InKS5zaG93KCk7XG4gICAgICAgICQoJyNtYXBwaW5nLXJlc3VsdHMtc2VjdGlvbicpLmhpZGUoKTtcbiAgICAgICAgaWYgKHVuaXFfaWRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgaGFuZGxlTWFwcGluZ1Jlc3VsdChkaW1lbnNpb24sIGlkcywgW10sIG1ldGhvZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgd2Vic2VydmljZVVybCA9IGdldFdlYnNlcnZpY2VVcmxGb3JNZXRob2QobWV0aG9kKTtcbiAgICAgICAgICAgICQuYWpheCh3ZWJzZXJ2aWNlVXJsLCB7XG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBkYnZlcnNpb246IGRidmVyc2lvbixcbiAgICAgICAgICAgICAgICAgICAgaWRzOiB1bmlxX2lkcyxcbiAgICAgICAgICAgICAgICAgICAgZGI6IG1ldGhvZFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlTWFwcGluZ1Jlc3VsdChkaW1lbnNpb24sIGlkcywgZGF0YSwgbWV0aG9kKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoZXJyb3IsIHN0YXR1cywgdGV4dCkge1xuICAgICAgICAgICAgICAgICAgICBzaG93TWVzc2FnZURpYWxvZygnVGhlcmUgd2FzIGEgbWFwcGluZyBlcnJvcjogJyt0ZXh0LCAnZGFuZ2VyJyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNvbXBsZXRlOiAoKSA9PiB7JCgnI21hcHBpbmctYWN0aW9uLWJ1c3ktaW5kaWNhdG9yJykuaGlkZSgpO31cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBhZGRPcHRpb25Ub1NlbGVjdHBpY2tlcih2YWx1ZSwgdGV4dCwgaWQpIHtcbiAgICAgICAgbGV0IG9wdGlvbiA9ICQoJzxvcHRpb24+JykucHJvcCgndmFsdWUnLCB2YWx1ZSkudGV4dCh0ZXh0KVxuICAgICAgICAkKCcjJytpZCkuYXBwZW5kKG9wdGlvbilcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBhcnJheSB3aXRoIHNlYXJjaCBpZCBmb3IgdGhlIHJlc3BlY3RpdmUgbWV0aG9kIGluIHRoZSBnaXZlbiBkaW1lbnNpb25cbiAgICAgKiBAcGFyYW0gZGltZW5zaW9uXG4gICAgICogQHBhcmFtIGF0dHJpYnV0ZVxuICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldElkc0ZvckF0dHJpYnV0ZShkaW1lbnNpb24sIGF0dHJpYnV0ZSkge1xuICAgICAgICBsZXQgaWRzID0gW107XG4gICAgICAgIGlmKGF0dHJpYnV0ZS5zdWJzdHIoMCwzKSA9PT0gJ21kOicpe1xuICAgICAgICAgICAgaWRzID0gYmlvbS5nZXRNZXRhZGF0YSh7ZGltZW5zaW9uOiBkaW1lbnNpb24sIGF0dHJpYnV0ZTogYXR0cmlidXRlLnN1YnN0cigzKX0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWRzID0gYmlvbVtkaW1lbnNpb25dLm1hcCgoZWxlbWVudCkgPT4gZWxlbWVudC5pZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlkcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSB3ZWJzZXJ2aWNlVXJsIGZvciB0aGUgZ2l2ZW4gbWFwcGluZyBtZXRob2RcbiAgICAgKiBAcGFyYW0gbWV0aG9kXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldFdlYnNlcnZpY2VVcmxGb3JNZXRob2QobWV0aG9kKSB7XG4gICAgICAgIGxldCBtZXRob2Qyc2VydmljZSA9IHtcbiAgICAgICAgICAgICduY2JpX3RheG9ub215JzogJ2J5RGJ4cmVmSWQnLFxuICAgICAgICAgICAgJ0VPTCc6ICdieURieHJlZklkJyxcbiAgICAgICAgICAgICdpdWNuX3JlZGxpc3QnOiAnYnlEYnhyZWZJZCcsXG4gICAgICAgICAgICAnb3JnYW5pc21fbmFtZSc6ICdieU9yZ2FuaXNtTmFtZSdcbiAgICAgICAgfTtcbiAgICAgICAgbGV0IHdlYnNlcnZpY2VVcmwgPSBSb3V0aW5nLmdlbmVyYXRlKCdhcGknLCB7J25hbWVzcGFjZSc6ICdtYXBwaW5nJywgJ2NsYXNzbmFtZSc6IG1ldGhvZDJzZXJ2aWNlW21ldGhvZF19KTtcbiAgICAgICAgcmV0dXJuIHdlYnNlcnZpY2VVcmw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBmb3IgdGhlIElEcyB1c2VkIGZvciBtYXBwaW5nIGluIHRoZSBjaG9zZW4gbWV0aG9kXG4gICAgICogQHBhcmFtIG1ldGhvZFxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRJZFN0cmluZ0Zvck1ldGhvZChtZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIG1ldGhvZHNbbWV0aG9kXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgdGhlIHJlc3VsdHMgY29tcG9uZW50IGZyb20gdGhlIHJldHVybmVkIG1hcHBpbmcgYW5kIHN0b3JlIHJlc3VsdCBpbiBnbG9iYWwgYmlvbSBvYmplY3RcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZGltZW5zaW9uXG4gICAgICogQHBhcmFtIHtBcnJheX0gaWRzRnJvbUJpb20gdGhvc2UgYXJlIHRoZSBpZHMgdXNlZCBmb3IgbWFwcGluZyBpbiB0aGUgb3JkZXIgdGhleSBhcHBlYXIgaW4gdGhlIGJpb20gZmlsZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IG1hcHBpbmcgZnJvbSBpZHMgdG8gZmVubmVjX2lkcyBhcyByZXR1cm5lZCBieSB3ZWJzZXJ2aWNlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZCBvZiBtYXBwaW5nXG4gICAgICovXG4gICAgYXN5bmMgZnVuY3Rpb24gaGFuZGxlTWFwcGluZ1Jlc3VsdChkaW1lbnNpb24sIGlkc0Zyb21CaW9tLCBtYXBwaW5nLCBtZXRob2QpIHtcbiAgICAgICAgdHJ5e1xuICAgICAgICAgICAgbGV0IGZlbm5lY19pZHMgPSBuZXcgQXJyYXkoaWRzRnJvbUJpb20ubGVuZ3RoKS5maWxsKG51bGwpO1xuICAgICAgICAgICAgbGV0IGZlbm5lY0lkczJzY2luYW1lcyA9IGF3YWl0IGdldFNjaW5hbWVzKE9iamVjdC52YWx1ZXMobWFwcGluZykpXG4gICAgICAgICAgICBsZXQgc2NpbmFtZXMgPSBuZXcgQXJyYXkoaWRzRnJvbUJpb20ubGVuZ3RoKS5maWxsKCd1bm1hcHBlZCcpO1xuICAgICAgICAgICAgdmFyIGlkc0Zyb21CaW9tTm90TnVsbENvdW50ID0gMDtcbiAgICAgICAgICAgIHZhciBpZHNGcm9tQmlvbU1hcHBlZENvdW50ID0gMDtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaWRzRnJvbUJpb20ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaWRzRnJvbUJpb21baV0gIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgaWRzRnJvbUJpb21Ob3ROdWxsQ291bnQrKztcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlkc0Zyb21CaW9tW2ldIGluIG1hcHBpbmcgJiYgbWFwcGluZ1tpZHNGcm9tQmlvbVtpXV0gIT09IG51bGwgJiYgIUFycmF5LmlzQXJyYXkobWFwcGluZ1tpZHNGcm9tQmlvbVtpXV0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZHNGcm9tQmlvbU1hcHBlZENvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICBmZW5uZWNfaWRzW2ldID0gbWFwcGluZ1tpZHNGcm9tQmlvbVtpXV07XG4gICAgICAgICAgICAgICAgICAgICAgICBzY2luYW1lc1tpXSA9IGZlbm5lY0lkczJzY2luYW1lc1tmZW5uZWNfaWRzW2ldXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJpb20uYWRkTWV0YWRhdGEoe2RpbWVuc2lvbjogZGltZW5zaW9uLCBhdHRyaWJ1dGU6IFsnZmVubmVjJywgZGJ2ZXJzaW9uLCAnZmVubmVjX2lkJ10sIHZhbHVlczogZmVubmVjX2lkc30pO1xuICAgICAgICAgICAgYmlvbS5hZGRNZXRhZGF0YSh7ZGltZW5zaW9uOiBkaW1lbnNpb24sIGF0dHJpYnV0ZTogWydmZW5uZWMnLCBkYnZlcnNpb24sICdhc3NpZ25tZW50X21ldGhvZCddLCBkZWZhdWx0VmFsdWU6IG1ldGhvZH0pO1xuICAgICAgICAgICAgYmlvbS5hZGRNZXRhZGF0YSh7ZGltZW5zaW9uOiBkaW1lbnNpb24sIGF0dHJpYnV0ZTogWydmZW5uZWMnLCBkYnZlcnNpb24sICdzY2llbnRpZmljX25hbWUnXSwgdmFsdWVzOiBzY2luYW1lc30pO1xuICAgICAgICAgICAgdmFyIGlkU3RyaW5nID0gZ2V0SWRTdHJpbmdGb3JNZXRob2QobWV0aG9kKTtcbiAgICAgICAgICAgICQoJyNtYXBwaW5nLXJlc3VsdHMtc2VjdGlvbicpLnNob3coKTtcbiAgICAgICAgICAgICQoJyNtYXBwaW5nLXJlc3VsdHMnKS50ZXh0KGBGcm9tIGEgdG90YWwgb2YgJHtpZHNGcm9tQmlvbS5sZW5ndGh9IG9yZ2FuaXNtczogICR7aWRzRnJvbUJpb21Ob3ROdWxsQ291bnR9IGhhdmUgYSAke2lkU3RyaW5nfSwgb2Ygd2hpY2ggJHtpZHNGcm9tQmlvbU1hcHBlZENvdW50fSBjb3VsZCBiZSBtYXBwZWQgdG8gZmVubmVjX2lkcy5gKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICBzaG93TWVzc2FnZURpYWxvZygnVGhlcmUgd2FzIGFuIGVycm9yOiAnK2UubWVzc2FnZSwgJ2RhbmdlcicpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgIH1cbiAgICAgICAgJCgnI21hcHBpbmctYWN0aW9uLWJ1c3ktaW5kaWNhdG9yJykuaGlkZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBtYXAgZnJvbSBmZW5uZWNfaWQgdG8gc2NpZW50aWZpYyBuYW1lXG4gICAgICogQHBhcmFtIGZlbm5lY19pZHMgKGFycmF5IG9mIGlkcywgbWF5IGNvbnRhaW4gc3ViLWFycmF5cyBhbmQgbnVsbDogWzEsMixbMyw0XSxudWxsLDVdKVxuICAgICAqIEByZXR1cm4ge1Byb21pc2UuPHZvaWQ+fVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldFNjaW5hbWVzKGZlbm5lY19pZHMpe1xuICAgICAgICBsZXQgd2Vic2VydmljZVVybCA9IFJvdXRpbmcuZ2VuZXJhdGUoJ2FwaScsIHsnbmFtZXNwYWNlJzogJ2xpc3RpbmcnLCAnY2xhc3NuYW1lJzogJ3NjaW5hbWVzJ30pO1xuICAgICAgICByZXR1cm4gJC5hamF4KHdlYnNlcnZpY2VVcmwsIHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBkYnZlcnNpb246IGRidmVyc2lvbixcbiAgICAgICAgICAgICAgICBpZHM6IF8uZmxhdHRlbihmZW5uZWNfaWRzKS5maWx0ZXIoeCA9PiB4ICE9PSBudWxsKSxcbiAgICAgICAgICAgICAgICBkYjogbWV0aG9kXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCdcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gU2V0IGFjdGlvbiBmb3IgY2xpY2sgb24gbWFwcGluZyBcIlNhdmUgdG8gZGF0YWJhc2VcIiBidXR0b25cbiAgICAkKCcjbWFwcGluZy1zYXZlLWJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2F2ZUJpb21Ub0RCKCk7XG4gICAgfSk7XG5cbiAgICAvLyBTZXQgYWN0aW9uIGZvciBjbGljayBvbiBtYXBwaW5nIFwiRG93bmxvYWQgYXMgY3N2XCIgYnV0dG9uXG4gICAgJCgnI21hcHBpbmctZG93bmxvYWQtY3N2LWJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IGlkcyA9IGJpb21bZGltZW5zaW9uXS5tYXAoZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50LmlkO1xuICAgICAgICB9KTtcbiAgICAgICAgbGV0IG1hcHBpbmdJZHMgPSBnZXRJZHNGb3JBdHRyaWJ1dGUoZGltZW5zaW9uLCBhdHRyaWJ1dGUpO1xuICAgICAgICBsZXQgZmVubmVjSWRzID0gYmlvbS5nZXRNZXRhZGF0YSh7ZGltZW5zaW9uOiBkaW1lbnNpb24sIGF0dHJpYnV0ZTogWydmZW5uZWMnLCBkYnZlcnNpb24sICdmZW5uZWNfaWQnXX0pO1xuICAgICAgICBsZXQgaWRIZWFkZXIgPSBkaW1lbnNpb24gPT09ICdyb3dzJyA/ICdPVFVfSUQnIDogJ1NhbXBsZV9JRCc7XG4gICAgICAgIGxldCBpZFN0cmluZyA9IGdldElkU3RyaW5nRm9yTWV0aG9kKG1ldGhvZCk7XG4gICAgICAgIHZhciBjc3YgPSBgJHtpZEhlYWRlcn1cXHQke2lkU3RyaW5nfVxcdEZlbm5lY19JRFxcbmA7XG4gICAgICAgIGZvcih2YXIgaT0wOyBpPGlkcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICBjc3YgKz0gaWRzW2ldK1wiXFx0XCIrbWFwcGluZ0lkc1tpXStcIlxcdFwiK2Zlbm5lY0lkc1tpXStcIlxcblwiO1xuICAgICAgICB9XG4gICAgICAgIHZhciBibG9iID0gbmV3IEJsb2IoW2Nzdl0sIHt0eXBlOiBcInRleHQvcGxhaW47Y2hhcnNldD11dGYtOFwifSk7XG4gICAgICAgIHNhdmVBcyhibG9iLCBcIm1hcHBpbmcuY3N2XCIpO1xuICAgIH0pO1xufSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L3Byb2plY3QvZGV0YWlscy9tYXBwaW5nLmpzeCIsIiQoJ2RvY3VtZW50JykucmVhZHkoKCkgPT4ge1xuICAgICQoJyNwcm9qZWN0LWV4cGxvcmUtb3R1LW1ldGFkYXRhJykuY2xpY2soKCkgPT4ge1xuICAgICAgICBpbml0VGFibGUoJ3Jvd3MnLCAnb2JzZXJ2YXRpb24tbWV0YWRhdGEtdGFibGUnKVxuICAgIH0pXG4gICAgJCgnI3Byb2plY3QtZXhwbG9yZS1zYW1wbGUtbWV0YWRhdGEnKS5jbGljaygoKSA9PiB7XG4gICAgICAgIGluaXRUYWJsZSgnY29sdW1ucycsICdzYW1wbGUtbWV0YWRhdGEtdGFibGUnKVxuICAgIH0pXG59KTtcblxuY29uc3QgdGFibGVDb25maWcgPSB7XG4gICAgb3JkZXI6IFsxLCBcImRlc2NcIl0sXG4gICAgZG9tOiAnQmZydGlwJyxcbiAgICBidXR0b25zOiBbXG4gICAgICAgICdjb2x2aXMnXG4gICAgXSxcbiAgICBzY3JvbGxYOiB0cnVlLFxufVxuXG5jb25zdCBnZXRUYWJsZURhdGEgPSAoZGltZW5zaW9uKSA9PiB7XG4gICAgaWYoZGltZW5zaW9uICE9PSAnY29sdW1ucycgJiYgZGltZW5zaW9uICE9PSAncm93cycpe1xuICAgICAgICByZXR1cm4gW1tdLFtdXVxuICAgIH1cbiAgICBsZXQgZGltTWV0YWRhdGEgPSBiaW9tW2RpbWVuc2lvbl0ubWFwKHggPT4ge1xuICAgICAgICBsZXQga2V5ID0gKGRpbWVuc2lvbiA9PT0gJ2NvbHVtbnMnID8gJ1NhbXBsZSBJRCcgOiAnT1RVIElEJylcbiAgICAgICAgbGV0IG1ldGFkYXRhID0ge31cbiAgICAgICAgbWV0YWRhdGFba2V5XSA9ICB4LmlkXG4gICAgICAgIGlmKGRpbWVuc2lvbiA9PT0gJ2NvbHVtbnMnKXtcbiAgICAgICAgICAgIG1ldGFkYXRhW1wiVG90YWwgQ291bnRcIl0gPSBfLnN1bShiaW9tLmdldERhdGFDb2x1bW4oeC5pZCkpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtZXRhZGF0YVtcIlRvdGFsIENvdW50XCJdID0gXy5zdW0oYmlvbS5nZXREYXRhUm93KHguaWQpKVxuICAgICAgICB9XG4gICAgICAgIGZvcihsZXQgbSBvZiBPYmplY3Qua2V5cyh4Lm1ldGFkYXRhKSl7XG4gICAgICAgICAgICBpZihtID09PSAnZmVubmVjJyl7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtZXRhZGF0YVttXSA9IHgubWV0YWRhdGFbbV1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWV0YWRhdGFcbiAgICB9KVxuICAgIGxldCBjb2x1bW5zID0gT2JqZWN0LmtleXMoZGltTWV0YWRhdGFbMF0pLm1hcCh4ID0+ICh7ZGF0YTogeCwgdGl0bGU6IHh9KSlcbiAgICByZXR1cm4gW2RpbU1ldGFkYXRhLCBjb2x1bW5zXVxufVxuXG5jb25zdCBpbml0VGFibGUgPSAoZGltZW5zaW9uLCBpZCkgPT4ge1xuICAgICQoJyNtZXRhZGF0YS10YWJsZS1wcm9ncmVzcycpLnNob3coKVxuICAgIC8vIFRoZSB0aW1lb3V0IGlzIHVzZWQgdG8gbWFrZSB0aGUgYnVzeSBpbmRpY2F0b3Igc2hvdyB1cCBiZWZvcmUgdGhlIGhlYXZ5IGNvbXB1dGF0aW9uIHN0YXJ0c1xuICAgIC8vIFdlYiB3b3JrZXJzIGFyZSBhIGJldHRlciBzb2x1dGlvbiB0byBhY2hpZXZlIHRoaXMgZ29hbCBhbmQgYXZvaWQgaGFuZ2luZyBvZiB0aGUgaW50ZXJmYWNlIGluIHRoZSBmdXR1cmVcbiAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGxldCBbbWV0YWRhdGEsIGNvbHVtbnNdID0gZ2V0VGFibGVEYXRhKGRpbWVuc2lvbilcbiAgICAgICAgJChgIyR7aWR9YCkuRGF0YVRhYmxlKE9iamVjdC5hc3NpZ24oe30sIHRhYmxlQ29uZmlnLCB7XG4gICAgICAgICAgICBkYXRhOiBtZXRhZGF0YSxcbiAgICAgICAgICAgIGNvbHVtbnM6IGNvbHVtbnMsXG4gICAgICAgIH0pKTtcbiAgICAgICAgJCgnI21ldGFkYXRhLXRhYmxlLXByb2dyZXNzJykuaGlkZSgpXG4gICAgfSwgNSlcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvcHJvamVjdC9kZXRhaWxzL21ldGFkYXRhLmpzeCIsIi8qIGdsb2JhbCBkYiAqL1xuLyogZ2xvYmFsIGJpb20gKi9cbi8qIGdsb2JhbCBwaGluY2hQcmV2aWV3UGF0aCAqL1xuZnVuY3Rpb24gYWRqdXN0SWZyYW1lSGVpZ2h0KCkge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAkKCcjaW5zcGVjdC13aXRoLXBoaW5jaC1pZnJhbWUnKS5hdHRyKCdoZWlnaHQnLCAkKCcjaW5zcGVjdC13aXRoLXBoaW5jaC1pZnJhbWUnKS5jb250ZW50cygpLmhlaWdodCgpICsgMjApXG4gICAgfSwgMTAwKVxufVxuXG4kKCdkb2N1bWVudCcpLnJlYWR5KCgpID0+IHtcbiAgICAvLyBTZXQgYWN0aW9uIGZvciBjbGljayBvbiBpbnNwZWN0IHdpdGggUGhpbmNoXG4gICAgLy8gZGIgaXMgdGhlIGJyb3dzZXIgd2Vic3RvcmFnZVxuICAgIGRiLm9wZW4oe1xuICAgICAgICBzZXJ2ZXI6IFwiQmlvbURhdGFcIixcbiAgICAgICAgdmVyc2lvbjogMSxcbiAgICAgICAgc2NoZW1hOiB7XG4gICAgICAgICAgICBcImJpb21cIjoge1xuICAgICAgICAgICAgICAgIGtleToge1xuICAgICAgICAgICAgICAgICAgICBrZXlQYXRoOiAnaWQnLFxuICAgICAgICAgICAgICAgICAgICBhdXRvSW5jcmVtZW50OiB0cnVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSkuZG9uZShmdW5jdGlvbiAoc2VydmVyKSB7XG4gICAgICAgIHZhciBiaW9tVG9TdG9yZSA9IHt9O1xuICAgICAgICBiaW9tVG9TdG9yZS5uYW1lID0gYmlvbS5pZDtcbiAgICAgICAgbGV0IGJpb21TdHJpbmcgPSBiaW9tLnRvU3RyaW5nKCk7XG4gICAgICAgIGJpb21Ub1N0b3JlLnNpemUgPSBiaW9tU3RyaW5nLmxlbmd0aDtcbiAgICAgICAgYmlvbVRvU3RvcmUuZGF0YSA9IGJpb21TdHJpbmc7XG4gICAgICAgIGxldCBkID0gbmV3IERhdGUoKTtcbiAgICAgICAgYmlvbVRvU3RvcmUuZGF0ZSA9IGQuZ2V0VVRDRnVsbFllYXIoKSArIFwiLVwiICsgKGQuZ2V0VVRDTW9udGgoKSArIDEpICsgXCItXCIgKyBkLmdldFVUQ0RhdGUoKSArIFwiVFwiICsgZC5nZXRVVENIb3VycygpICsgXCI6XCIgKyBkLmdldFVUQ01pbnV0ZXMoKSArIFwiOlwiICsgZC5nZXRVVENTZWNvbmRzKCkgKyBcIiBVVENcIjtcbiAgICAgICAgc2VydmVyLmJpb20uYWRkKGJpb21Ub1N0b3JlKS5kb25lKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICAkKCcjaW5zcGVjdC13aXRoLXBoaW5jaC1pZnJhbWUnKS5zaG93KCk7XG4gICAgICAgICAgICAkKCcjaW5zcGVjdC13aXRoLXBoaW5jaC1pZnJhbWUnKS5hdHRyKCdzcmMnLCBwaGluY2hQcmV2aWV3UGF0aCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gQWRqdXN0IHNpemUgb2YgaWZyYW1lIGFmdGVyIGxvYWRpbmcgb2YgUGhpbmNoXG4gICAgJCgnI2luc3BlY3Qtd2l0aC1waGluY2gtaWZyYW1lJykub24oXCJsb2FkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2V0VGltZW91dChhZGp1c3RJZnJhbWVIZWlnaHQsIDEwMDApO1xuICAgIH0pO1xuXG4gICAgJCgnI2luc3BlY3Qtd2l0aC1waGluY2gtdGFiJykub24oJ2NsaWNrJywgYWRqdXN0SWZyYW1lSGVpZ2h0KVxufSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L3Byb2plY3QvZGV0YWlscy9waGluY2guanN4IiwiLyogZ2xvYmFsIGludGVybmFsUHJvamVjdElkICovXG4vKiBnbG9iYWwgZGJ2ZXJzaW9uICovXG5cbiQoJ2RvY3VtZW50JykucmVhZHkoKCkgPT4ge1xuICAgIGdldEFuZFNob3dUcmFpdHMoJyN0cmFpdC10YWJsZScsICdyb3dzJyk7XG4gICAgZ2V0QW5kU2hvd1RyYWl0cygnI3RyYWl0LXRhYmxlLXNhbXBsZScsICdjb2x1bW5zJyk7XG5cbiAgICBmdW5jdGlvbiBnZXRBbmRTaG93VHJhaXRzKGlkLCBkaW1lbnNpb24pe1xuICAgICAgICB2YXIgd2Vic2VydmljZVVybCA9IFJvdXRpbmcuZ2VuZXJhdGUoJ2FwaScsIHsnbmFtZXNwYWNlJzogJ2RldGFpbHMnLCAnY2xhc3NuYW1lJzogJ3RyYWl0c09mT3JnYW5pc21zJ30pO1xuICAgICAgICAvLyBFeHRyYWN0IHJvdyBmZW5uZWNfaWRzIGZyb20gYmlvbVxuICAgICAgICB2YXIgZmVubmVjX2lkcyA9IGJpb20uZ2V0TWV0YWRhdGEoe2RpbWVuc2lvbjogZGltZW5zaW9uLCBhdHRyaWJ1dGU6IFsnZmVubmVjJywgZGJ2ZXJzaW9uLCAnZmVubmVjX2lkJ119KVxuICAgICAgICAgICAgLmZpbHRlciggZWxlbWVudCA9PiBlbGVtZW50ICE9PSBudWxsICk7XG5cbiAgICAgICAgLy8gR2V0IHRyYWl0cyBmb3Igcm93c1xuICAgICAgICAkLmFqYXgod2Vic2VydmljZVVybCwge1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIFwiZGJ2ZXJzaW9uXCI6IGRidmVyc2lvbixcbiAgICAgICAgICAgICAgICBcImZlbm5lY19pZHNcIjogZmVubmVjX2lkc1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIGxldCB0cmFpdHMgPSBbXTtcbiAgICAgICAgICAgICAgICAkLmVhY2goZGF0YSwgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRoaXNUcmFpdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBrZXksXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFpdDogdmFsdWVbJ3RyYWl0X3R5cGUnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiB2YWx1ZVsndHJhaXRfZW50cnlfaWRzJ10ubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmFuZ2U6IDEwMCAqIHZhbHVlWydmZW5uZWNfaWRzJ10ubGVuZ3RoIC8gZmVubmVjX2lkcy5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgdHJhaXRzLnB1c2godGhpc1RyYWl0KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpbml0VHJhaXRzT2ZQcm9qZWN0VGFibGUoaWQsIGRpbWVuc2lvbiwgdHJhaXRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gSW5pdCB0cmFpdHMgb2YgcHJvamVjdCB0YWJsZSB3aXRoIHZhbHVlc1xuICAgIGZ1bmN0aW9uIGluaXRUcmFpdHNPZlByb2plY3RUYWJsZSh0YWJsZUlkLCBkaW1lbnNpb24sIHRyYWl0cykge1xuICAgICAgICBsZXQgbWV0YWRhdGFLZXlzID0gZ2V0TWV0YWRhdGFLZXlzKGJpb20sIGRpbWVuc2lvbilcbiAgICAgICAgJCh0YWJsZUlkKS5EYXRhVGFibGUoe1xuICAgICAgICAgICAgZGF0YTogdHJhaXRzLFxuICAgICAgICAgICAgY29sdW1uczogW1xuICAgICAgICAgICAgICAgIHtkYXRhOiAndHJhaXQnfSxcbiAgICAgICAgICAgICAgICB7ZGF0YTogJ2NvdW50J30sXG4gICAgICAgICAgICAgICAge2RhdGE6ICdyYW5nZSd9LFxuICAgICAgICAgICAgICAgIHtkYXRhOiBudWxsfSxcbiAgICAgICAgICAgICAgICB7ZGF0YTogbnVsbH0sXG4gICAgICAgICAgICAgICAge2RhdGE6IG51bGx9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgb3JkZXI6IFsyLCBcImRlc2NcIl0sXG4gICAgICAgICAgICBjb2x1bW5EZWZzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRzOiAyLFxuICAgICAgICAgICAgICAgICAgICByZW5kZXI6IGRhdGEgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICc8c3BhbiB0aXRsZT1cIicgKyBkYXRhIC8gMTAwICsgJ1wiPjwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwicHJvZ3Jlc3NcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtYmFyIHByb2dyZXNzLWJhci10cmFpdFwiIHJvbGU9XCJwcm9ncmVzc2JhclwiIHN0eWxlPVwid2lkdGg6ICcgKyBkYXRhICsgJyVcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgIE1hdGgucm91bmQoZGF0YSkgKyAnJTwvZGl2PjwvZGl2PicsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0aXRsZS1udW1lcmljJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRzOiAwLFxuICAgICAgICAgICAgICAgICAgICByZW5kZXI6IChkYXRhLCB0eXBlLCBmdWxsKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaHJlZiA9IFJvdXRpbmcuZ2VuZXJhdGUoJ3RyYWl0X2RldGFpbHMnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RidmVyc2lvbic6IGRidmVyc2lvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAndHJhaXRfdHlwZV9pZCc6IGZ1bGwuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICc8YSBocmVmPVwiJyArIGhyZWYgKyAnXCI+JyArIGZ1bGwudHJhaXQgKyAnPC9hPic7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0czogMyxcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyOiAoZGF0YSwgdHlwZSwgZnVsbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhyZWYgPSBSb3V0aW5nLmdlbmVyYXRlKCdwcm9qZWN0X3RyYWl0X2RldGFpbHMnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RidmVyc2lvbic6IGRidmVyc2lvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAndHJhaXRfdHlwZV9pZCc6IGZ1bGwuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3Byb2plY3RfaWQnOiBpbnRlcm5hbFByb2plY3RJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGltZW5zaW9uJzogZGltZW5zaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnPGEgaHJlZj1cIicgKyBocmVmICsgJ1wiPjxpIGNsYXNzPVwiZmEgZmEtc2VhcmNoXCI+PC9pPjwvYT4nO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldHM6IDQsXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlcjogKGRhdGEsIHR5cGUsIGZ1bGwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfLmluZGV4T2YobWV0YWRhdGFLZXlzLCBmdWxsLnRyYWl0KSAhPSAtMSA/ICc8aSBjbGFzcz1cImZhIGZhLWNoZWNrXCI+PC9pPicgOiAnJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldHM6IDUsXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlcjogKGRhdGEsIHR5cGUsIGZ1bGwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfLmluZGV4T2YobWV0YWRhdGFLZXlzLCBmdWxsLnRyYWl0KSAhPSAtMSA/ICc8YSBvbmNsaWNrPVwicmVtb3ZlVHJhaXRGcm9tUHJvamVjdFRhYmxlQWN0aW9uKCcrXCInXCIrZnVsbC50cmFpdCtcIicsJ1wiK2RpbWVuc2lvbitcIidcIisnKVwiPjxpIGNsYXNzPVwiZmEgZmEtdHJhc2hcIj48L2k+PC9hPicgOiAnPGEgb25jbGljaz1cImFkZFRyYWl0VG9Qcm9qZWN0VGFibGVBY3Rpb24oJytmdWxsLmlkKycsJytcIidcIitkaW1lbnNpb24rXCInXCIrJylcIj48aSBjbGFzcz1cImZhIGZhLXBsdXNcIj48L2k+PC9hPic7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuXG5mdW5jdGlvbiBhZGRUcmFpdFRvUHJvamVjdFRhYmxlQWN0aW9uKHRyYWl0VHlwZUlkLCBkaW1lbnNpb24pe1xuICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IFJvdXRpbmcuZ2VuZXJhdGUoJ2FwaScsIHsnbmFtZXNwYWNlJzogJ2RldGFpbHMnLCAnY2xhc3NuYW1lJzogJ1RyYWl0T2ZQcm9qZWN0J30pLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIFwiZGJ2ZXJzaW9uXCI6IGRidmVyc2lvbixcbiAgICAgICAgICAgICAgICBcImludGVybmFsX3Byb2plY3RfaWRcIjogaW50ZXJuYWxQcm9qZWN0SWQsXG4gICAgICAgICAgICAgICAgXCJ0cmFpdF90eXBlX2lkXCI6IHRyYWl0VHlwZUlkLFxuICAgICAgICAgICAgICAgIFwiaW5jbHVkZV9jaXRhdGlvbnNcIjogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIHZhciB0cmFpdFZhbHVlcztcbiAgICAgICAgICAgICAgICBpZihkYXRhLnRyYWl0X2Zvcm1hdCA9PT0gJ251bWVyaWNhbCcpe1xuICAgICAgICAgICAgICAgICAgICB0cmFpdFZhbHVlcyA9IGNvbmRlbnNlTnVtZXJpY2FsVHJhaXRWYWx1ZXMoZGF0YS52YWx1ZXMpXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdHJhaXRWYWx1ZXMgPSBjb25kZW5zZUNhdGVnb3JpY2FsVHJhaXRWYWx1ZXMoZGF0YS52YWx1ZXMpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFkZFRyYWl0VG9Qcm9qZWN0KGRhdGEubmFtZSwgdHJhaXRWYWx1ZXMsIGRhdGEuY2l0YXRpb25zLCBiaW9tLCBkaW1lbnNpb24sIGRidmVyc2lvbiwgaW50ZXJuYWxQcm9qZWN0SWQsICgpID0+IHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVRyYWl0RnJvbVByb2plY3RUYWJsZUFjdGlvbih0cmFpdE5hbWUsIGRpbWVuc2lvbil7XG4gICAgcmVtb3ZlVHJhaXRGcm9tUHJvamVjdCh0cmFpdE5hbWUsIGJpb20sIGRpbWVuc2lvbiwgZGJ2ZXJzaW9uLCBpbnRlcm5hbFByb2plY3RJZCwgKCkgPT4gd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpKVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9SZXNvdXJjZXMvY2xpZW50L2pzeC9wcm9qZWN0L2RldGFpbHMvdHJhaXQuanN4Il0sInNvdXJjZVJvb3QiOiIifQ==