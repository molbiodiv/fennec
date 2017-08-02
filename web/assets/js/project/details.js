/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/Resources/client/jsx/project/details.jsx":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("./app/Resources/client/jsx/project/details/details.jsx");
__webpack_require__("./app/Resources/client/jsx/project/details/mapping.jsx");
__webpack_require__("./app/Resources/client/jsx/project/details/metadata.jsx");
__webpack_require__("./app/Resources/client/jsx/project/details/phinch.jsx");
__webpack_require__("./app/Resources/client/jsx/project/details/trait.jsx");

/***/ }),

/***/ "./app/Resources/client/jsx/project/details/details.jsx":
/***/ (function(module, exports) {

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

/***/ }),

/***/ "./app/Resources/client/jsx/project/details/mapping.jsx":
/***/ (function(module, exports) {

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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

/***/ }),

/***/ "./app/Resources/client/jsx/project/details/metadata.jsx":
/***/ (function(module, exports) {

$('document').ready(() => {
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

/***/ }),

/***/ "./app/Resources/client/jsx/project/details/phinch.jsx":
/***/ (function(module, exports) {

/* global db */
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

/***/ }),

/***/ "./app/Resources/client/jsx/project/details/trait.jsx":
/***/ (function(module, exports) {

/* global internalProjectId */
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

/***/ }),

/***/ 2:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./app/Resources/client/jsx/project/details.jsx");


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYjFhMmE3MGM5YTAzMGJhMWIwYjkiLCJ3ZWJwYWNrOi8vLy4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L3Byb2plY3QvZGV0YWlscy5qc3giLCJ3ZWJwYWNrOi8vLy4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L3Byb2plY3QvZGV0YWlscy9kZXRhaWxzLmpzeCIsIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvcHJvamVjdC9kZXRhaWxzL21hcHBpbmcuanN4Iiwid2VicGFjazovLy8uL2FwcC9SZXNvdXJjZXMvY2xpZW50L2pzeC9wcm9qZWN0L2RldGFpbHMvbWV0YWRhdGEuanN4Iiwid2VicGFjazovLy8uL2FwcC9SZXNvdXJjZXMvY2xpZW50L2pzeC9wcm9qZWN0L2RldGFpbHMvcGhpbmNoLmpzeCIsIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvcHJvamVjdC9kZXRhaWxzL3RyYWl0LmpzeCJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiJCIsInJlYWR5IiwidGV4dCIsImJpb20iLCJpZCIsImNvbW1lbnQiLCJzaGFwZSIsIm5ueiIsInRvRml4ZWQiLCJvbiIsInZhbCIsImZvY3VzIiwiY2xpY2siLCJzYXZlQmlvbVRvREIiLCJleHBvcnRQcm9qZWN0QXNCaW9tIiwiZXhwb3J0UHNldWRvVGF4VGFibGUiLCJleHBvcnRUcmFpdENpdGF0aW9uc1RhYmxlIiwiYWRkTWV0YWRhdGFTYW1wbGUiLCJhZGRNZXRhZGF0YU9ic2VydmF0aW9uIiwiYXBwZW5kIiwiZ2V0TWV0YWRhdGFLZXlzIiwibWFwIiwidHJhbnNwb3NlIiwid3JpdGUiLCJ0aGVuIiwiYmlvbUpzb24iLCJ3ZWJzZXJ2aWNlVXJsIiwiUm91dGluZyIsImdlbmVyYXRlIiwiYWpheCIsImRhdGEiLCJkYnZlcnNpb24iLCJpbnRlcm5hbFByb2plY3RJZCIsIm1ldGhvZCIsInN1Y2Nlc3MiLCJsb2NhdGlvbiIsInJlbG9hZCIsImZhaWx1cmUiLCJjb25zb2xlIiwibG9nIiwid2luZG93IiwiYXNIZGY1IiwiY29udmVyc2lvblNlcnZlclVSTCIsImNvbnRlbnRUeXBlIiwiY29udmVyc2lvblNlcnZlciIsImJpb21Db250ZW50IiwiYmxvYiIsIkJsb2IiLCJ0eXBlIiwic2F2ZUFzIiwic2hvd01lc3NhZ2VEaWFsb2ciLCJ0YXgiLCJfIiwiY2xvbmVEZWVwIiwiZ2V0TWV0YWRhdGEiLCJkaW1lbnNpb24iLCJhdHRyaWJ1dGUiLCJoZWFkZXIiLCJuZXh0TGV2ZWwiLCJtYXgiLCJlbGVtIiwibGVuZ3RoIiwib3R1aWRzIiwicm93cyIsInIiLCJ2IiwiaSIsInVuc2hpZnQiLCJzbGljZSIsInRyYWl0IiwiT2JqZWN0Iiwia2V5cyIsIm1ldGFkYXRhIiwidHJhaXRWYWx1ZXMiLCJvdXQiLCJqb2luIiwiZW50cmllcyIsImVudHJ5IiwiZmVubmVjX2lkIiwiZ2V0IiwidHJhaXRUeXBlIiwidGMiLCJldmVudCIsImZpbGVzIiwidGFyZ2V0IiwiZnIiLCJGaWxlUmVhZGVyIiwib25sb2FkIiwiYWRkTWV0YWRhdGFUb0ZpbGUiLCJyZXN1bHQiLCJ1cGRhdGVQcm9qZWN0IiwicmVhZEFzVGV4dCIsInRvU3RyaW5nIiwiZXJyb3IiLCJjYWxsYmFjayIsImNzdkRhdGEiLCJQYXBhIiwicGFyc2UiLCJza2lwRW1wdHlMaW5lcyIsImVycm9ycyIsIm1lc3NhZ2UiLCJyb3ciLCJzYW1wbGVNZXRhZGF0YSIsIm1ldGFkYXRhS2V5cyIsImlkS2V5Iiwic3BsaWNlIiwia2V5IiwiZWFjaCIsInZhbHVlIiwiYWRkTWV0YWRhdGEiLCJpZHNGcm9tQmlvbSIsIm1hcHBpbmciLCJmZW5uZWNfaWRzIiwiQXJyYXkiLCJmaWxsIiwiZmVubmVjSWRzMnNjaW5hbWVzIiwiZ2V0U2NpbmFtZXMiLCJ2YWx1ZXMiLCJzY2luYW1lcyIsImlkc0Zyb21CaW9tTm90TnVsbENvdW50IiwiaWRzRnJvbUJpb21NYXBwZWRDb3VudCIsImlzQXJyYXkiLCJkZWZhdWx0VmFsdWUiLCJpZFN0cmluZyIsImdldElkU3RyaW5nRm9yTWV0aG9kIiwic2hvdyIsImUiLCJoaWRlIiwiaGFuZGxlTWFwcGluZ1Jlc3VsdCIsInNhbXBsZU9yZ2FuaXNtSURzIiwiZmlsdGVyIiwiZWxlbWVudCIsIm90dU9yZ2FuaXNtSURzIiwibWFwcGVkU2FtcGxlcyIsInBlcmNlbnRhZ2VNYXBwZWRTYW1wbGVzIiwibWFwcGVkT1RVcyIsInBlcmNlbnRhZ2VNYXBwZWRPVFVzIiwiY3NzIiwiYXR0ciIsIm1ldGhvZHMiLCJuY2JpX3RheG9ub215Iiwib3JnYW5pc21fbmFtZSIsIml1Y25fcmVkbGlzdCIsIkVPTCIsImFkZE9wdGlvblRvU2VsZWN0cGlja2VyIiwic2FtcGxlTWV0YWRhdGFLZXlzIiwib2JzZXJ2YXRpb25NZXRhZGF0YUtleXMiLCJzZWxlY3RwaWNrZXIiLCJjaGFuZ2UiLCJpZHMiLCJnZXRJZHNGb3JBdHRyaWJ1dGUiLCJ1bmlxX2lkcyIsInVuaXEiLCJnZXRXZWJzZXJ2aWNlVXJsRm9yTWV0aG9kIiwiZGIiLCJzdGF0dXMiLCJjb21wbGV0ZSIsIm9wdGlvbiIsInByb3AiLCJzdWJzdHIiLCJtZXRob2Qyc2VydmljZSIsImZsYXR0ZW4iLCJ4IiwibWFwcGluZ0lkcyIsImZlbm5lY0lkcyIsImlkSGVhZGVyIiwiY3N2IiwiaW5pdFRhYmxlIiwidGFibGVDb25maWciLCJvcmRlciIsImRvbSIsImJ1dHRvbnMiLCJzY3JvbGxYIiwiZ2V0VGFibGVEYXRhIiwiZGltTWV0YWRhdGEiLCJzdW0iLCJnZXREYXRhQ29sdW1uIiwiZ2V0RGF0YVJvdyIsIm0iLCJjb2x1bW5zIiwidGl0bGUiLCJzZXRUaW1lb3V0IiwiRGF0YVRhYmxlIiwiYXNzaWduIiwiYWRqdXN0SWZyYW1lSGVpZ2h0IiwiY29udGVudHMiLCJoZWlnaHQiLCJvcGVuIiwic2VydmVyIiwidmVyc2lvbiIsInNjaGVtYSIsImtleVBhdGgiLCJhdXRvSW5jcmVtZW50IiwiZG9uZSIsImJpb21Ub1N0b3JlIiwibmFtZSIsImJpb21TdHJpbmciLCJzaXplIiwiZCIsIkRhdGUiLCJkYXRlIiwiZ2V0VVRDRnVsbFllYXIiLCJnZXRVVENNb250aCIsImdldFVUQ0RhdGUiLCJnZXRVVENIb3VycyIsImdldFVUQ01pbnV0ZXMiLCJnZXRVVENTZWNvbmRzIiwiYWRkIiwiaXRlbSIsInBoaW5jaFByZXZpZXdQYXRoIiwiZ2V0QW5kU2hvd1RyYWl0cyIsInRyYWl0cyIsInRoaXNUcmFpdCIsImNvdW50IiwicmFuZ2UiLCJwdXNoIiwiaW5pdFRyYWl0c09mUHJvamVjdFRhYmxlIiwidGFibGVJZCIsImNvbHVtbkRlZnMiLCJ0YXJnZXRzIiwicmVuZGVyIiwiTWF0aCIsInJvdW5kIiwiZnVsbCIsImhyZWYiLCJpbmRleE9mIiwiYWRkVHJhaXRUb1Byb2plY3RUYWJsZUFjdGlvbiIsInRyYWl0VHlwZUlkIiwidXJsIiwidHJhaXRfZm9ybWF0IiwiY29uZGVuc2VOdW1lcmljYWxUcmFpdFZhbHVlcyIsImNvbmRlbnNlQ2F0ZWdvcmljYWxUcmFpdFZhbHVlcyIsImFkZFRyYWl0VG9Qcm9qZWN0IiwiY2l0YXRpb25zIiwicmVtb3ZlVHJhaXRGcm9tUHJvamVjdFRhYmxlQWN0aW9uIiwidHJhaXROYW1lIiwicmVtb3ZlVHJhaXRGcm9tUHJvamVjdCJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7OztB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U0NDLGlCQUFTLFVBQVVKLElBQVYsRUFBZ0I7QUFDckIsZ0JBQUkyQyxXQUFKO0FBQ0EsZ0JBQUczQyxLQUFLdU0sWUFBTCxLQUFzQixXQUF6QixFQUFxQztBQUNqQzVKLDhCQUFjNkosNkJBQTZCeE0sS0FBS3VGLE1BQWxDLENBQWQ7QUFDSCxhQUZELE1BRU87QUFDSDVDLDhCQUFjOEosK0JBQStCek0sS0FBS3VGLE1BQXBDLENBQWQ7QUFDSDtBQUNEbUgsOEJBQWtCMU0sS0FBS3FLLElBQXZCLEVBQTZCMUgsV0FBN0IsRUFBMEMzQyxLQUFLMk0sU0FBL0MsRUFBMER0TyxJQUExRCxFQUFnRW9ELFNBQWhFLEVBQTJFeEIsU0FBM0UsRUFBc0ZDLGlCQUF0RixFQUF5RyxNQUFNUSxPQUFPTCxRQUFQLENBQWdCQyxNQUFoQixFQUEvRztBQUNIO0FBakJGLEtBQVA7QUFtQkg7O0FBRUQsU0FBU3NNLGlDQUFULENBQTJDQyxTQUEzQyxFQUFzRHBMLFNBQXRELEVBQWdFO0FBQzVEcUwsMkJBQXVCRCxTQUF2QixFQUFrQ3hPLElBQWxDLEVBQXdDb0QsU0FBeEMsRUFBbUR4QixTQUFuRCxFQUE4REMsaUJBQTlELEVBQWlGLE1BQU1RLE9BQU9MLFFBQVAsQ0FBZ0JDLE1BQWhCLEVBQXZGO0FBQ0gsQyIsImZpbGUiOiJwcm9qZWN0L2RldGFpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvanMvXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgYjFhMmE3MGM5YTAzMGJhMWIwYjkiLCJyZXF1aXJlKCcuL2RldGFpbHMvZGV0YWlscy5qc3gnKVxucmVxdWlyZSgnLi9kZXRhaWxzL21hcHBpbmcuanN4JylcbnJlcXVpcmUoJy4vZGV0YWlscy9tZXRhZGF0YS5qc3gnKVxucmVxdWlyZSgnLi9kZXRhaWxzL3BoaW5jaC5qc3gnKVxucmVxdWlyZSgnLi9kZXRhaWxzL3RyYWl0LmpzeCcpXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L3Byb2plY3QvZGV0YWlscy5qc3giLCIvKiBnbG9iYWwgZGJ2ZXJzaW9uICovXG4vKiBnbG9iYWwgYmlvbSAqL1xuLyogZ2xvYmFsIF8gKi9cbi8qIGdsb2JhbCAkICovXG4vKiBnbG9iYWwgaW50ZXJuYWxQcm9qZWN0SWQgKi9cbiQoJ2RvY3VtZW50JykucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgIC8vIFNldCBoZWFkZXIgb2YgcGFnZSB0byBwcm9qZWN0LWlkXG4gICAgJCgnLnBhZ2UtaGVhZGVyJykudGV4dChiaW9tLmlkKTtcblxuICAgIC8vIEZpbGwgb3ZlcnZpZXcgdGFibGUgd2l0aCB2YWx1ZXNcbiAgICAkKCcjcHJvamVjdC1vdmVydmlldy10YWJsZS1pZCcpLnRleHQoYmlvbS5pZCk7XG4gICAgJCgnI3Byb2plY3Qtb3ZlcnZpZXctdGFibGUtY29tbWVudCcpLnRleHQoYmlvbS5jb21tZW50KTtcbiAgICAkKCcjcHJvamVjdC1vdmVydmlldy10YWJsZS1yb3dzJykudGV4dChiaW9tLnNoYXBlWzBdKTtcbiAgICAkKCcjcHJvamVjdC1vdmVydmlldy10YWJsZS1jb2xzJykudGV4dChiaW9tLnNoYXBlWzFdKTtcbiAgICAkKCcjcHJvamVjdC1vdmVydmlldy10YWJsZS1ubnonKS50ZXh0KGJpb20ubm56ICsgXCIgKFwiICsgKDEwMCAqIGJpb20ubm56IC8gKGJpb20uc2hhcGVbMF0gKiBiaW9tLnNoYXBlWzFdKSkudG9GaXhlZCgyKSArIFwiJSlcIik7XG5cbiAgICAvLyBTZXQgYWN0aW9uIGlmIGVkaXQgZGlhbG9nIGlzIHNob3duXG4gICAgJCgnI2VkaXRQcm9qZWN0RGlhbG9nJykub24oJ3Nob3duLmJzLm1vZGFsJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAkKCcjZWRpdFByb2plY3REaWFsb2dQcm9qZWN0SUQnKS52YWwoYmlvbS5pZCk7XG4gICAgICAgICQoJyNlZGl0UHJvamVjdERpYWxvZ0NvbW1lbnQnKS52YWwoYmlvbS5jb21tZW50KTtcbiAgICAgICAgJCgnI2VkaXRQcm9qZWN0RGlhbG9nUHJvamVjdElEJykuZm9jdXMoKTtcbiAgICB9KTtcblxuICAgIC8vIFNldCBhY3Rpb24gaWYgZWRpdCBkaWFsb2cgaXMgc2F2ZWRcbiAgICAkKCcjZWRpdFByb2plY3REaWFsb2dTYXZlQnV0dG9uJykuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICBiaW9tLmlkID0gJCgnI2VkaXRQcm9qZWN0RGlhbG9nUHJvamVjdElEJykudmFsKCk7XG4gICAgICAgIGJpb20uY29tbWVudCA9ICQoJyNlZGl0UHJvamVjdERpYWxvZ0NvbW1lbnQnKS52YWwoKTtcbiAgICAgICAgc2F2ZUJpb21Ub0RCKCk7XG4gICAgfSk7XG5cbiAgICAkKCcjcHJvamVjdC1leHBvcnQtYXMtYmlvbS12MScpLmNsaWNrKCgpID0+IHtcbiAgICAgICAgZXhwb3J0UHJvamVjdEFzQmlvbShmYWxzZSk7XG4gICAgfSk7XG5cbiAgICAkKCcjcHJvamVjdC1leHBvcnQtYXMtYmlvbS12MicpLmNsaWNrKCgpID0+IHtcbiAgICAgICAgZXhwb3J0UHJvamVjdEFzQmlvbSh0cnVlKTtcbiAgICB9KTtcblxuICAgICQoJyNwcm9qZWN0LWV4cG9ydC1wc2V1ZG8tdGF4LWJpb20nKS5jbGljayhleHBvcnRQc2V1ZG9UYXhUYWJsZSk7XG5cbiAgICAkKCcjcHJvamVjdC1leHBvcnQtdHJhaXQtY2l0YXRpb24tb3R1cycpLmNsaWNrKCgpPT5leHBvcnRUcmFpdENpdGF0aW9uc1RhYmxlKCdyb3dzJykpO1xuICAgICQoJyNwcm9qZWN0LWV4cG9ydC10cmFpdC1jaXRhdGlvbi1zYW1wbGVzJykuY2xpY2soKCk9PmV4cG9ydFRyYWl0Q2l0YXRpb25zVGFibGUoJ2NvbHVtbnMnKSk7XG5cbiAgICAkKCcjcHJvamVjdC1hZGQtbWV0YWRhdGEtc2FtcGxlJykub24oXCJjaGFuZ2VcIiwgYWRkTWV0YWRhdGFTYW1wbGUpO1xuICAgICQoJyNwcm9qZWN0LWFkZC1tZXRhZGF0YS1vYnNlcnZhdGlvbicpLm9uKFwiY2hhbmdlXCIsIGFkZE1ldGFkYXRhT2JzZXJ2YXRpb24pO1xuXG4gICAgJCgnI21ldGFkYXRhLW92ZXJ2aWV3LXNhbXBsZScpLmFwcGVuZChnZXRNZXRhZGF0YUtleXMoYmlvbSwgJ2NvbHVtbnMnKS5tYXAoKHRleHQpID0+ICQoXCI8bGk+XCIpLnRleHQodGV4dCkpKTtcbiAgICAkKCcjbWV0YWRhdGEtb3ZlcnZpZXctb2JzZXJ2YXRpb24nKS5hcHBlbmQoZ2V0TWV0YWRhdGFLZXlzKGJpb20sICdyb3dzJykubWFwKCh0ZXh0KSA9PiAkKFwiPGxpPlwiKS50ZXh0KHRleHQpKSk7XG5cbiAgICAkKCcjcHJvamVjdC10cmFuc3Bvc2UnKS5jbGljaygoKSA9PiB7XG4gICAgICAgIGJpb20udHJhbnNwb3NlKCk7XG4gICAgICAgIHNhdmVCaW9tVG9EQigpO1xuICAgIH0pO1xufSk7XG5cbi8qKlxuICogU2F2ZXMgdGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIGdsb2JhbCBiaW9tIHZhcmlhYmxlIHRvIHRoZSBwb3N0Z3JlcyBkYXRhYmFzZVxuICovXG5mdW5jdGlvbiBzYXZlQmlvbVRvREIoKSB7XG4gICAgYmlvbS53cml0ZSgpLnRoZW4oZnVuY3Rpb24gKGJpb21Kc29uKSB7XG4gICAgICAgIHZhciB3ZWJzZXJ2aWNlVXJsID0gUm91dGluZy5nZW5lcmF0ZSgnYXBpJywgeyduYW1lc3BhY2UnOiAnZWRpdCcsICdjbGFzc25hbWUnOiAndXBkYXRlUHJvamVjdCd9KTtcbiAgICAgICAgJC5hamF4KHdlYnNlcnZpY2VVcmwsIHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBcImRidmVyc2lvblwiOiBkYnZlcnNpb24sXG4gICAgICAgICAgICAgICAgXCJwcm9qZWN0X2lkXCI6IGludGVybmFsUHJvamVjdElkLFxuICAgICAgICAgICAgICAgIFwiYmlvbVwiOiBiaW9tSnNvblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgbG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sIGZ1bmN0aW9uIChmYWlsdXJlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGZhaWx1cmUpO1xuICAgIH0pO1xufVxuXG4vLyBleHBvcnQgZ2xvYmFsbHlcbndpbmRvdy5zYXZlQmlvbVRvREIgPSBzYXZlQmlvbVRvREI7XG5cbi8qKlxuICogT3BlbnMgYSBmaWxlIGRvd25sb2FkIGRpYWxvZyBvZiB0aGUgY3VycmVudCBwcm9qZWN0IGluIGJpb20gZm9ybWF0XG4gKiBAcGFyYW0ge2Jvb2xlYW59IGFzSGRmNVxuICovXG5mdW5jdGlvbiBleHBvcnRQcm9qZWN0QXNCaW9tKGFzSGRmNSkge1xuICAgIGxldCBjb252ZXJzaW9uU2VydmVyVVJMID0gUm91dGluZy5nZW5lcmF0ZSgnYmlvbWNzX2NvbnZlcnQnKTtcbiAgICBsZXQgY29udGVudFR5cGUgPSBhc0hkZjUgPyBcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiIDogXCJ0ZXh0L3BsYWluXCI7XG4gICAgYmlvbS53cml0ZSh7Y29udmVyc2lvblNlcnZlcjogY29udmVyc2lvblNlcnZlclVSTCwgYXNIZGY1OiBhc0hkZjV9KS50aGVuKGZ1bmN0aW9uIChiaW9tQ29udGVudCkge1xuICAgICAgICB2YXIgYmxvYiA9IG5ldyBCbG9iKFtiaW9tQ29udGVudF0sIHt0eXBlOiBjb250ZW50VHlwZX0pO1xuICAgICAgICBzYXZlQXMoYmxvYiwgYmlvbS5pZCtcIi5iaW9tXCIpO1xuICAgIH0sIGZ1bmN0aW9uIChmYWlsdXJlKSB7XG4gICAgICAgIHNob3dNZXNzYWdlRGlhbG9nKGZhaWx1cmUrXCJcIiwgJ2RhbmdlcicpO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIE9wZW5zIGEgZmlsZSBkb3dubG9hZCBkaWFsb2cgb2YgdGhlIGN1cnJlbnQgcHJvamVjdCBpbiB0c3YgZm9ybWF0IChwc2V1ZG8gdGF4b25vbXkpXG4gKi9cbmZ1bmN0aW9uIGV4cG9ydFBzZXVkb1RheFRhYmxlKCkge1xuICAgIGxldCBjb250ZW50VHlwZSA9IFwidGV4dC9wbGFpblwiO1xuICAgIGxldCB0YXggPSBfLmNsb25lRGVlcChiaW9tLmdldE1ldGFkYXRhKHtkaW1lbnNpb246ICdyb3dzJywgYXR0cmlidXRlOiAndGF4b25vbXknfSkpO1xuICAgIGxldCBoZWFkZXIgPSBbJ09UVUlEJywgJ2tpbmdkb20nLCAncGh5bHVtJywgJ2NsYXNzJywgJ29yZGVyJywgJ2ZhbWlseScsICdnZW51cycsICdzcGVjaWVzJ107XG4gICAgbGV0IG5leHRMZXZlbCA9IF8ubWF4KHRheC5tYXAoZWxlbSA9PiBlbGVtLmxlbmd0aCkpO1xuICAgIGxldCBvdHVpZHMgPSBiaW9tLnJvd3MubWFwKHIgPT4gci5pZCk7XG4gICAgdGF4Lm1hcCgodixpKSA9PiB2LnVuc2hpZnQob3R1aWRzW2ldKSk7XG4gICAgbmV4dExldmVsKys7XG4gICAgaGVhZGVyID0gaGVhZGVyLnNsaWNlKDAsIG5leHRMZXZlbCk7XG4gICAgZm9yKGxldCB0cmFpdCBvZiBPYmplY3Qua2V5cyhiaW9tLnJvd3NbMF0ubWV0YWRhdGEpKXtcbiAgICAgICAgaWYodHJhaXQgPT09ICd0YXhvbm9teScpe1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHRyYWl0VmFsdWVzID0gYmlvbS5nZXRNZXRhZGF0YSh7ZGltZW5zaW9uOiAncm93cycsIGF0dHJpYnV0ZTogdHJhaXR9KTtcbiAgICAgICAgaGVhZGVyW25leHRMZXZlbF0gPSB0cmFpdDtcbiAgICAgICAgdGF4Lm1hcCgodixpKSA9PiB2W25leHRMZXZlbF0gPSB0cmFpdFZhbHVlc1tpXSk7XG4gICAgICAgIG5leHRMZXZlbCsrO1xuICAgIH1cbiAgICBsZXQgb3V0ID0gXy5qb2luKGhlYWRlciwgXCJcXHRcIik7XG4gICAgb3V0ICs9IFwiXFxuXCI7XG4gICAgb3V0ICs9IF8uam9pbih0YXgubWFwKHYgPT4gXy5qb2luKHYsXCJcXHRcIikpLCBcIlxcblwiKTtcbiAgICBjb25zdCBibG9iID0gbmV3IEJsb2IoW291dF0sIHt0eXBlOiBjb250ZW50VHlwZX0pO1xuICAgIHNhdmVBcyhibG9iLCBiaW9tLmlkK1wiLnRzdlwiKTtcbn1cblxuLyoqXG4gKiBPcGVucyBhIGZpbGUgZG93bmxvYWQgZGlhbG9nIG9mIGFsbCB0cmFpdCBjaXRhdGlvbnMgZm9yIHRoaXMgcHJvamVjdFxuICovXG5mdW5jdGlvbiBleHBvcnRUcmFpdENpdGF0aW9uc1RhYmxlKGRpbWVuc2lvbikge1xuICAgIGNvbnN0IGNvbnRlbnRUeXBlID0gXCJ0ZXh0L3BsYWluXCI7XG4gICAgbGV0IG91dCA9IF8uam9pbihbKGRpbWVuc2lvbj09PVwicm93c1wiID8gJyNPVFVJZCcgOiAnI1NhbXBsZUlkJyksICdmZW5uZWNfaWQnLCAndHJhaXRUeXBlJywgJ2NpdGF0aW9uJywgJ3ZhbHVlJ10sIFwiXFx0XCIpK1wiXFxuXCI7XG4gICAgbGV0IGVudHJpZXMgPSBiaW9tW2RpbWVuc2lvbl1cbiAgICBmb3IobGV0IGVudHJ5IG9mIGVudHJpZXMpe1xuICAgICAgICBsZXQgaWQgPSBlbnRyeS5pZDtcbiAgICAgICAgbGV0IGZlbm5lY19pZCA9IF8uZ2V0KGVudHJ5LCBbJ21ldGFkYXRhJywgJ2Zlbm5lYycsIGRidmVyc2lvbiwgJ2Zlbm5lY19pZCddKSB8fCAnJztcbiAgICAgICAgZm9yKGxldCB0cmFpdFR5cGUgb2YgT2JqZWN0LmtleXMoXy5nZXQoZW50cnksIFsnbWV0YWRhdGEnLCAndHJhaXRfY2l0YXRpb25zJ10pfHx7fSkpe1xuICAgICAgICAgICAgZm9yKGxldCB0YyBvZiBfLmdldChlbnRyeSwgWydtZXRhZGF0YScsICd0cmFpdF9jaXRhdGlvbnMnLCB0cmFpdFR5cGVdKSl7XG4gICAgICAgICAgICAgICAgb3V0ICs9IF8uam9pbihbaWQsIGZlbm5lY19pZCwgdHJhaXRUeXBlLCB0Y1snY2l0YXRpb24nXSwgdGNbJ3ZhbHVlJ11dLCBcIlxcdFwiKStcIlxcblwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbb3V0XSwge3R5cGU6IGNvbnRlbnRUeXBlfSk7XG4gICAgc2F2ZUFzKGJsb2IsIGJpb20uaWQrKGRpbWVuc2lvbj09PVwicm93c1wiID8gXCIuT1RVXCIgOiBcIi5zYW1wbGVcIikrXCIuY2l0YXRpb25zLnRzdlwiKTtcbn1cblxuLyoqXG4gKiBBZGQgc2FtcGxlIG1ldGFkYXRhIGZyb20gc2VsZWN0ZWQgZmlsZXNcbiAqIEBwYXJhbSB7ZXZlbnR9IGV2ZW50XG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gYWRkTWV0YWRhdGFTYW1wbGUoZXZlbnQpXG57XG4gICAgbGV0IGZpbGVzID0gZXZlbnQudGFyZ2V0LmZpbGVzO1xuICAgIGxldCBmciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgICBmci5vbmxvYWQgPSAoKSA9PiBhZGRNZXRhZGF0YVRvRmlsZShmci5yZXN1bHQsIHVwZGF0ZVByb2plY3QsICdjb2x1bW5zJylcbiAgICBmci5yZWFkQXNUZXh0KGZpbGVzWzBdKTtcbn1cblxuLyoqXG4gKiBBZGQgb2JzZXJ2YXRpb24gbWV0YWRhdGEgZnJvbSBzZWxlY3RlZCBmaWxlc1xuICogQHBhcmFtIHtldmVudH0gZXZlbnRcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5mdW5jdGlvbiBhZGRNZXRhZGF0YU9ic2VydmF0aW9uKGV2ZW50KVxue1xuICAgIGxldCBmaWxlcyA9IGV2ZW50LnRhcmdldC5maWxlcztcbiAgICBsZXQgZnIgPSBuZXcgRmlsZVJlYWRlcigpXG4gICAgZnIub25sb2FkID0gKCkgPT4gYWRkTWV0YWRhdGFUb0ZpbGUoZnIucmVzdWx0LCB1cGRhdGVQcm9qZWN0LCAncm93cycpXG4gICAgZnIucmVhZEFzVGV4dChmaWxlc1swXSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVByb2plY3QoKSB7XG4gICAgbGV0IHdlYnNlcnZpY2VVcmwgPSBSb3V0aW5nLmdlbmVyYXRlKCdhcGknLCB7J25hbWVzcGFjZSc6ICdlZGl0JywgJ2NsYXNzbmFtZSc6ICd1cGRhdGVQcm9qZWN0J30pO1xuICAgICQuYWpheCh3ZWJzZXJ2aWNlVXJsLCB7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIFwiZGJ2ZXJzaW9uXCI6IGRidmVyc2lvbixcbiAgICAgICAgICAgIFwicHJvamVjdF9pZFwiOiBpbnRlcm5hbFByb2plY3RJZCxcbiAgICAgICAgICAgIFwiYmlvbVwiOiBiaW9tLnRvU3RyaW5nKClcbiAgICAgICAgfSxcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgc3VjY2VzczogKCkgPT4gc2hvd01lc3NhZ2VEaWFsb2coJ1N1Y2Nlc3NmdWxseSBhZGRlZCBtZXRhZGF0YS4nLCAnc3VjY2VzcycpLFxuICAgICAgICBlcnJvcjogKGVycm9yKSA9PiBzaG93TWVzc2FnZURpYWxvZyhlcnJvciwgJ2RhbmdlcicpXG4gICAgfSk7XG59XG5cbi8qKlxuICogQWRkIHNhbXBsZSBtZXRhZGF0YSBjb250ZW50IHRvIGZpbGVcbiAqIEBwYXJhbSB7U3RyaW5nfSByZXN1bHRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcGFyYW0ge1N0cmluZ30gZGltZW5zaW9uXG4gKi9cbmZ1bmN0aW9uIGFkZE1ldGFkYXRhVG9GaWxlKHJlc3VsdCwgY2FsbGJhY2ssIGRpbWVuc2lvbj0nY29sdW1ucycpe1xuICAgIGxldCBjc3ZEYXRhID0gUGFwYS5wYXJzZShyZXN1bHQsIHtoZWFkZXI6IHRydWUsIHNraXBFbXB0eUxpbmVzOiB0cnVlfSlcbiAgICBpZihjc3ZEYXRhLmVycm9ycy5sZW5ndGggPiAwKXtcbiAgICAgICAgc2hvd01lc3NhZ2VEaWFsb2coY3N2RGF0YS5lcnJvcnNbMF0ubWVzc2FnZSsnIGxpbmU6ICcrY3N2RGF0YS5lcnJvcnNbMF0ucm93LCAnZGFuZ2VyJyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYoY3N2RGF0YS5kYXRhLmxlbmd0aCA9PT0gMCl7XG4gICAgICAgIHNob3dNZXNzYWdlRGlhbG9nKFwiQ291bGQgbm90IHBhcnNlIGZpbGUuIE5vIGRhdGEgZm91bmQuXCIsICdkYW5nZXInKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgc2FtcGxlTWV0YWRhdGEgPSB7fVxuICAgIGxldCBtZXRhZGF0YUtleXMgPSBPYmplY3Qua2V5cyhjc3ZEYXRhLmRhdGFbMF0pO1xuICAgIGxldCBpZEtleSA9IG1ldGFkYXRhS2V5cy5zcGxpY2UoMCwxKVswXTtcbiAgICBmb3IobGV0IGtleSBvZiBtZXRhZGF0YUtleXMpe1xuICAgICAgICBzYW1wbGVNZXRhZGF0YVtrZXldID0ge31cbiAgICB9XG4gICAgZm9yKGxldCByb3cgb2YgY3N2RGF0YS5kYXRhKXtcbiAgICAgICAgJC5lYWNoKHJvdywgKGtleSwgdmFsdWUpID0+IHtcbiAgICAgICAgICAgIGlmKGtleSAhPT0gaWRLZXkpe1xuICAgICAgICAgICAgICAgIHNhbXBsZU1ldGFkYXRhW2tleV1bcm93W2lkS2V5XV0gPSB2YWx1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbiAgICAkLmVhY2goc2FtcGxlTWV0YWRhdGEsIChrZXksdmFsdWUpPT57XG4gICAgICAgIGJpb20uYWRkTWV0YWRhdGEoeydkaW1lbnNpb24nOiBkaW1lbnNpb24sICdhdHRyaWJ1dGUnOiBrZXksICd2YWx1ZXMnOiB2YWx1ZX0pXG4gICAgfSlcbiAgICBjYWxsYmFjaygpO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L3Byb2plY3QvZGV0YWlscy9kZXRhaWxzLmpzeCIsIi8qIGdsb2JhbCBkYnZlcnNpb24gKi9cbi8qIGdsb2JhbCBiaW9tICovXG4vKiBnbG9iYWwgXyAqL1xuXG4kKCdkb2N1bWVudCcpLnJlYWR5KCgpID0+IHtcbiAgICAvLyBDYWxjdWxhdGUgdmFsdWVzIGZvciBtYXBwaW5nIG92ZXJ2aWV3IHRhYmxlXG4gICAgbGV0IHNhbXBsZU9yZ2FuaXNtSURzID0gYmlvbS5nZXRNZXRhZGF0YSh7ZGltZW5zaW9uOiAnY29sdW1ucycsIGF0dHJpYnV0ZTogWydmZW5uZWMnLCBkYnZlcnNpb24sICdmZW5uZWNfaWQnXX0pLmZpbHRlcihlbGVtZW50ID0+IGVsZW1lbnQgIT09IG51bGwpO1xuICAgIGxldCBvdHVPcmdhbmlzbUlEcyA9IGJpb20uZ2V0TWV0YWRhdGEoe2RpbWVuc2lvbjogJ3Jvd3MnLCBhdHRyaWJ1dGU6IFsnZmVubmVjJywgZGJ2ZXJzaW9uLCAnZmVubmVjX2lkJ119KS5maWx0ZXIoZWxlbWVudCA9PiBlbGVtZW50ICE9PSBudWxsKTtcbiAgICB2YXIgbWFwcGVkU2FtcGxlcyA9IHNhbXBsZU9yZ2FuaXNtSURzLmxlbmd0aDtcbiAgICB2YXIgcGVyY2VudGFnZU1hcHBlZFNhbXBsZXMgPSAxMDAgKiBtYXBwZWRTYW1wbGVzIC8gYmlvbS5zaGFwZVsxXTtcbiAgICB2YXIgbWFwcGVkT1RVcyA9IG90dU9yZ2FuaXNtSURzLmxlbmd0aDtcbiAgICB2YXIgcGVyY2VudGFnZU1hcHBlZE9UVXMgPSAxMDAgKiBtYXBwZWRPVFVzIC8gYmlvbS5zaGFwZVswXTtcblxuICAgIC8vIEFkZCB2YWx1ZXMgdG8gbWFwcGluZyBvdmVydmlldyB0YWJsZVxuICAgICQoJyNtYXBwaW5nLW90dScpLnRleHQobWFwcGVkT1RVcyk7XG4gICAgJCgnI3Byb2dyZXNzLWJhci1tYXBwaW5nLW90dScpLmNzcygnd2lkdGgnLCBwZXJjZW50YWdlTWFwcGVkT1RVcyArICclJykuYXR0cignYXJpYS12YWx1ZW5vdycsIHBlcmNlbnRhZ2VNYXBwZWRPVFVzKTtcbiAgICAkKCcjcHJvZ3Jlc3MtYmFyLW1hcHBpbmctb3R1JykudGV4dChwZXJjZW50YWdlTWFwcGVkT1RVcy50b0ZpeGVkKDApICsgJyUnKTtcbiAgICAkKCcjbWFwcGluZy1zYW1wbGUnKS50ZXh0KG1hcHBlZFNhbXBsZXMpO1xuICAgICQoJyNwcm9ncmVzcy1iYXItbWFwcGluZy1zYW1wbGUnKS5jc3MoJ3dpZHRoJywgcGVyY2VudGFnZU1hcHBlZFNhbXBsZXMgKyAnJScpLmF0dHIoJ2FyaWEtdmFsdWVub3cnLCBwZXJjZW50YWdlTWFwcGVkU2FtcGxlcyk7XG4gICAgJCgnI3Byb2dyZXNzLWJhci1tYXBwaW5nLXNhbXBsZScpLnRleHQocGVyY2VudGFnZU1hcHBlZFNhbXBsZXMudG9GaXhlZCgwKSArICclJyk7XG5cbiAgICBsZXQgbWV0aG9kcyA9IHtuY2JpX3RheG9ub215OiBcIk5DQkkgdGF4aWRcIiwgb3JnYW5pc21fbmFtZTogXCJTY2llbnRpZmljIG5hbWVcIiwgaXVjbl9yZWRsaXN0OiBcIklVQ04gaWRcIiwgRU9MOiBcIkVPTCBpZFwifTtcbiAgICAkLmVhY2gobWV0aG9kcywgKGtleSwgdmFsdWUpID0+IHtcbiAgICAgICAgYWRkT3B0aW9uVG9TZWxlY3RwaWNrZXIoa2V5LCB2YWx1ZSwgJ21hcHBpbmctbWV0aG9kLXNlbGVjdCcpO1xuICAgIH0pXG5cbiAgICBsZXQgc2FtcGxlTWV0YWRhdGFLZXlzID0gZ2V0TWV0YWRhdGFLZXlzKGJpb20sICdjb2x1bW5zJyk7XG4gICAgYWRkT3B0aW9uVG9TZWxlY3RwaWNrZXIoJ0lEJywgJ0lEJywgJ21hcHBpbmctbWV0YWRhdGEtc2FtcGxlLXNlbGVjdCcpXG4gICAgJC5lYWNoKHNhbXBsZU1ldGFkYXRhS2V5cywgKGtleSwgdmFsdWUpID0+IHtcbiAgICAgICAgYWRkT3B0aW9uVG9TZWxlY3RwaWNrZXIoJ21kOicrdmFsdWUsIHZhbHVlLCAnbWFwcGluZy1tZXRhZGF0YS1zYW1wbGUtc2VsZWN0JylcbiAgICB9KVxuXG4gICAgbGV0IG9ic2VydmF0aW9uTWV0YWRhdGFLZXlzID0gZ2V0TWV0YWRhdGFLZXlzKGJpb20sICdyb3dzJyk7XG4gICAgYWRkT3B0aW9uVG9TZWxlY3RwaWNrZXIoJ0lEJywgJ0lEJywgJ21hcHBpbmctbWV0YWRhdGEtb2JzZXJ2YXRpb24tc2VsZWN0JylcbiAgICAkLmVhY2gob2JzZXJ2YXRpb25NZXRhZGF0YUtleXMsIChrZXksIHZhbHVlKSA9PiB7XG4gICAgICAgIGFkZE9wdGlvblRvU2VsZWN0cGlja2VyKCdtZDonK3ZhbHVlLCB2YWx1ZSwgJ21hcHBpbmctbWV0YWRhdGEtb2JzZXJ2YXRpb24tc2VsZWN0JylcbiAgICB9KVxuXG4gICAgJCgnI21hcHBpbmctZGltZW5zaW9uLXNlbGVjdCcpLm9uKCdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAgIGlmKCQoJyNtYXBwaW5nLWRpbWVuc2lvbi1zZWxlY3QnKS52YWwoKSA9PT0gJ3Jvd3MnKXtcbiAgICAgICAgICAgICQoJyNtYXBwaW5nLW1ldGFkYXRhLXNhbXBsZS1zZWxlY3QnKS5zZWxlY3RwaWNrZXIoJ2hpZGUnKTtcbiAgICAgICAgICAgICQoJyNtYXBwaW5nLW1ldGFkYXRhLW9ic2VydmF0aW9uLXNlbGVjdCcpLnNlbGVjdHBpY2tlcignc2hvdycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCgnI21hcHBpbmctbWV0YWRhdGEtc2FtcGxlLXNlbGVjdCcpLnNlbGVjdHBpY2tlcignc2hvdycpO1xuICAgICAgICAgICAgJCgnI21hcHBpbmctbWV0YWRhdGEtb2JzZXJ2YXRpb24tc2VsZWN0Jykuc2VsZWN0cGlja2VyKCdoaWRlJyk7XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgJCgnLnNlbGVjdHBpY2tlcicpLnNlbGVjdHBpY2tlcigncmVmcmVzaCcpXG4gICAgJCgnI21hcHBpbmctZGltZW5zaW9uLXNlbGVjdCcpLmNoYW5nZSgpO1xuXG4gICAgLy8gQWRkIHNlbWktZ2xvYmFsIGRpbWVuc2lvbiB2YXJpYWJsZSAoc3RvcmVzIGxhc3QgbWFwcGVkIGRpbWVuc2lvbilcbiAgICB2YXIgZGltZW5zaW9uID0gJ3Jvd3MnO1xuICAgIHZhciBtZXRob2QgPSAnbmNiaV90YXhvbm9teSc7XG4gICAgdmFyIGF0dHJpYnV0ZSA9ICcnO1xuXG4gICAgLy8gU2V0IGFjdGlvbiBmb3IgY2xpY2sgb24gbWFwcGluZyBcIkdPXCIgYnV0dG9uXG4gICAgJCgnI21hcHBpbmctYWN0aW9uLWJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZGltZW5zaW9uID0gJCgnI21hcHBpbmctZGltZW5zaW9uLXNlbGVjdCcpLnZhbCgpO1xuICAgICAgICBtZXRob2QgPSAkKCcjbWFwcGluZy1tZXRob2Qtc2VsZWN0JykudmFsKCk7XG4gICAgICAgIGlmKGRpbWVuc2lvbiA9PT0gJ3Jvd3MnKXtcbiAgICAgICAgICAgIGF0dHJpYnV0ZSA9ICQoJyNtYXBwaW5nLW1ldGFkYXRhLW9ic2VydmF0aW9uLXNlbGVjdCcpLnZhbCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXR0cmlidXRlID0gJCgnI21hcHBpbmctbWV0YWRhdGEtc2FtcGxlLXNlbGVjdCcpLnZhbCgpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBpZHMgPSBnZXRJZHNGb3JBdHRyaWJ1dGUoZGltZW5zaW9uLCBhdHRyaWJ1dGUpO1xuICAgICAgICBsZXQgdW5pcV9pZHMgPSBpZHMuZmlsdGVyKHZhbHVlID0+IHZhbHVlICE9PSBudWxsKTtcbiAgICAgICAgdW5pcV9pZHMgPSBfLnVuaXEodW5pcV9pZHMpO1xuICAgICAgICAkKCcjbWFwcGluZy1hY3Rpb24tYnVzeS1pbmRpY2F0b3InKS5zaG93KCk7XG4gICAgICAgICQoJyNtYXBwaW5nLXJlc3VsdHMtc2VjdGlvbicpLmhpZGUoKTtcbiAgICAgICAgaWYgKHVuaXFfaWRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgaGFuZGxlTWFwcGluZ1Jlc3VsdChkaW1lbnNpb24sIGlkcywgW10sIG1ldGhvZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgd2Vic2VydmljZVVybCA9IGdldFdlYnNlcnZpY2VVcmxGb3JNZXRob2QobWV0aG9kKTtcbiAgICAgICAgICAgICQuYWpheCh3ZWJzZXJ2aWNlVXJsLCB7XG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBkYnZlcnNpb246IGRidmVyc2lvbixcbiAgICAgICAgICAgICAgICAgICAgaWRzOiB1bmlxX2lkcyxcbiAgICAgICAgICAgICAgICAgICAgZGI6IG1ldGhvZFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlTWFwcGluZ1Jlc3VsdChkaW1lbnNpb24sIGlkcywgZGF0YSwgbWV0aG9kKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoZXJyb3IsIHN0YXR1cywgdGV4dCkge1xuICAgICAgICAgICAgICAgICAgICBzaG93TWVzc2FnZURpYWxvZygnVGhlcmUgd2FzIGEgbWFwcGluZyBlcnJvcjogJyt0ZXh0LCAnZGFuZ2VyJyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNvbXBsZXRlOiAoKSA9PiB7JCgnI21hcHBpbmctYWN0aW9uLWJ1c3ktaW5kaWNhdG9yJykuaGlkZSgpO31cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBhZGRPcHRpb25Ub1NlbGVjdHBpY2tlcih2YWx1ZSwgdGV4dCwgaWQpIHtcbiAgICAgICAgbGV0IG9wdGlvbiA9ICQoJzxvcHRpb24+JykucHJvcCgndmFsdWUnLCB2YWx1ZSkudGV4dCh0ZXh0KVxuICAgICAgICAkKCcjJytpZCkuYXBwZW5kKG9wdGlvbilcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBhcnJheSB3aXRoIHNlYXJjaCBpZCBmb3IgdGhlIHJlc3BlY3RpdmUgbWV0aG9kIGluIHRoZSBnaXZlbiBkaW1lbnNpb25cbiAgICAgKiBAcGFyYW0gZGltZW5zaW9uXG4gICAgICogQHBhcmFtIGF0dHJpYnV0ZVxuICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldElkc0ZvckF0dHJpYnV0ZShkaW1lbnNpb24sIGF0dHJpYnV0ZSkge1xuICAgICAgICBsZXQgaWRzID0gW107XG4gICAgICAgIGlmKGF0dHJpYnV0ZS5zdWJzdHIoMCwzKSA9PT0gJ21kOicpe1xuICAgICAgICAgICAgaWRzID0gYmlvbS5nZXRNZXRhZGF0YSh7ZGltZW5zaW9uOiBkaW1lbnNpb24sIGF0dHJpYnV0ZTogYXR0cmlidXRlLnN1YnN0cigzKX0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWRzID0gYmlvbVtkaW1lbnNpb25dLm1hcCgoZWxlbWVudCkgPT4gZWxlbWVudC5pZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlkcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSB3ZWJzZXJ2aWNlVXJsIGZvciB0aGUgZ2l2ZW4gbWFwcGluZyBtZXRob2RcbiAgICAgKiBAcGFyYW0gbWV0aG9kXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldFdlYnNlcnZpY2VVcmxGb3JNZXRob2QobWV0aG9kKSB7XG4gICAgICAgIGxldCBtZXRob2Qyc2VydmljZSA9IHtcbiAgICAgICAgICAgICduY2JpX3RheG9ub215JzogJ2J5RGJ4cmVmSWQnLFxuICAgICAgICAgICAgJ0VPTCc6ICdieURieHJlZklkJyxcbiAgICAgICAgICAgICdpdWNuX3JlZGxpc3QnOiAnYnlEYnhyZWZJZCcsXG4gICAgICAgICAgICAnb3JnYW5pc21fbmFtZSc6ICdieU9yZ2FuaXNtTmFtZSdcbiAgICAgICAgfTtcbiAgICAgICAgbGV0IHdlYnNlcnZpY2VVcmwgPSBSb3V0aW5nLmdlbmVyYXRlKCdhcGknLCB7J25hbWVzcGFjZSc6ICdtYXBwaW5nJywgJ2NsYXNzbmFtZSc6IG1ldGhvZDJzZXJ2aWNlW21ldGhvZF19KTtcbiAgICAgICAgcmV0dXJuIHdlYnNlcnZpY2VVcmw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBmb3IgdGhlIElEcyB1c2VkIGZvciBtYXBwaW5nIGluIHRoZSBjaG9zZW4gbWV0aG9kXG4gICAgICogQHBhcmFtIG1ldGhvZFxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRJZFN0cmluZ0Zvck1ldGhvZChtZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIG1ldGhvZHNbbWV0aG9kXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgdGhlIHJlc3VsdHMgY29tcG9uZW50IGZyb20gdGhlIHJldHVybmVkIG1hcHBpbmcgYW5kIHN0b3JlIHJlc3VsdCBpbiBnbG9iYWwgYmlvbSBvYmplY3RcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZGltZW5zaW9uXG4gICAgICogQHBhcmFtIHtBcnJheX0gaWRzRnJvbUJpb20gdGhvc2UgYXJlIHRoZSBpZHMgdXNlZCBmb3IgbWFwcGluZyBpbiB0aGUgb3JkZXIgdGhleSBhcHBlYXIgaW4gdGhlIGJpb20gZmlsZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IG1hcHBpbmcgZnJvbSBpZHMgdG8gZmVubmVjX2lkcyBhcyByZXR1cm5lZCBieSB3ZWJzZXJ2aWNlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZCBvZiBtYXBwaW5nXG4gICAgICovXG4gICAgYXN5bmMgZnVuY3Rpb24gaGFuZGxlTWFwcGluZ1Jlc3VsdChkaW1lbnNpb24sIGlkc0Zyb21CaW9tLCBtYXBwaW5nLCBtZXRob2QpIHtcbiAgICAgICAgdHJ5e1xuICAgICAgICAgICAgbGV0IGZlbm5lY19pZHMgPSBuZXcgQXJyYXkoaWRzRnJvbUJpb20ubGVuZ3RoKS5maWxsKG51bGwpO1xuICAgICAgICAgICAgbGV0IGZlbm5lY0lkczJzY2luYW1lcyA9IGF3YWl0IGdldFNjaW5hbWVzKE9iamVjdC52YWx1ZXMobWFwcGluZykpXG4gICAgICAgICAgICBsZXQgc2NpbmFtZXMgPSBuZXcgQXJyYXkoaWRzRnJvbUJpb20ubGVuZ3RoKS5maWxsKCd1bm1hcHBlZCcpO1xuICAgICAgICAgICAgdmFyIGlkc0Zyb21CaW9tTm90TnVsbENvdW50ID0gMDtcbiAgICAgICAgICAgIHZhciBpZHNGcm9tQmlvbU1hcHBlZENvdW50ID0gMDtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaWRzRnJvbUJpb20ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaWRzRnJvbUJpb21baV0gIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgaWRzRnJvbUJpb21Ob3ROdWxsQ291bnQrKztcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlkc0Zyb21CaW9tW2ldIGluIG1hcHBpbmcgJiYgbWFwcGluZ1tpZHNGcm9tQmlvbVtpXV0gIT09IG51bGwgJiYgIUFycmF5LmlzQXJyYXkobWFwcGluZ1tpZHNGcm9tQmlvbVtpXV0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZHNGcm9tQmlvbU1hcHBlZENvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICBmZW5uZWNfaWRzW2ldID0gbWFwcGluZ1tpZHNGcm9tQmlvbVtpXV07XG4gICAgICAgICAgICAgICAgICAgICAgICBzY2luYW1lc1tpXSA9IGZlbm5lY0lkczJzY2luYW1lc1tmZW5uZWNfaWRzW2ldXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJpb20uYWRkTWV0YWRhdGEoe2RpbWVuc2lvbjogZGltZW5zaW9uLCBhdHRyaWJ1dGU6IFsnZmVubmVjJywgZGJ2ZXJzaW9uLCAnZmVubmVjX2lkJ10sIHZhbHVlczogZmVubmVjX2lkc30pO1xuICAgICAgICAgICAgYmlvbS5hZGRNZXRhZGF0YSh7ZGltZW5zaW9uOiBkaW1lbnNpb24sIGF0dHJpYnV0ZTogWydmZW5uZWMnLCBkYnZlcnNpb24sICdhc3NpZ25tZW50X21ldGhvZCddLCBkZWZhdWx0VmFsdWU6IG1ldGhvZH0pO1xuICAgICAgICAgICAgYmlvbS5hZGRNZXRhZGF0YSh7ZGltZW5zaW9uOiBkaW1lbnNpb24sIGF0dHJpYnV0ZTogWydmZW5uZWMnLCBkYnZlcnNpb24sICdzY2llbnRpZmljX25hbWUnXSwgdmFsdWVzOiBzY2luYW1lc30pO1xuICAgICAgICAgICAgdmFyIGlkU3RyaW5nID0gZ2V0SWRTdHJpbmdGb3JNZXRob2QobWV0aG9kKTtcbiAgICAgICAgICAgICQoJyNtYXBwaW5nLXJlc3VsdHMtc2VjdGlvbicpLnNob3coKTtcbiAgICAgICAgICAgICQoJyNtYXBwaW5nLXJlc3VsdHMnKS50ZXh0KGBGcm9tIGEgdG90YWwgb2YgJHtpZHNGcm9tQmlvbS5sZW5ndGh9IG9yZ2FuaXNtczogICR7aWRzRnJvbUJpb21Ob3ROdWxsQ291bnR9IGhhdmUgYSAke2lkU3RyaW5nfSwgb2Ygd2hpY2ggJHtpZHNGcm9tQmlvbU1hcHBlZENvdW50fSBjb3VsZCBiZSBtYXBwZWQgdG8gZmVubmVjX2lkcy5gKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICBzaG93TWVzc2FnZURpYWxvZygnVGhlcmUgd2FzIGFuIGVycm9yOiAnK2UubWVzc2FnZSwgJ2RhbmdlcicpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgIH1cbiAgICAgICAgJCgnI21hcHBpbmctYWN0aW9uLWJ1c3ktaW5kaWNhdG9yJykuaGlkZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBtYXAgZnJvbSBmZW5uZWNfaWQgdG8gc2NpZW50aWZpYyBuYW1lXG4gICAgICogQHBhcmFtIGZlbm5lY19pZHMgKGFycmF5IG9mIGlkcywgbWF5IGNvbnRhaW4gc3ViLWFycmF5cyBhbmQgbnVsbDogWzEsMixbMyw0XSxudWxsLDVdKVxuICAgICAqIEByZXR1cm4ge1Byb21pc2UuPHZvaWQ+fVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldFNjaW5hbWVzKGZlbm5lY19pZHMpe1xuICAgICAgICBsZXQgd2Vic2VydmljZVVybCA9IFJvdXRpbmcuZ2VuZXJhdGUoJ2FwaScsIHsnbmFtZXNwYWNlJzogJ2xpc3RpbmcnLCAnY2xhc3NuYW1lJzogJ3NjaW5hbWVzJ30pO1xuICAgICAgICByZXR1cm4gJC5hamF4KHdlYnNlcnZpY2VVcmwsIHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBkYnZlcnNpb246IGRidmVyc2lvbixcbiAgICAgICAgICAgICAgICBpZHM6IF8uZmxhdHRlbihmZW5uZWNfaWRzKS5maWx0ZXIoeCA9PiB4ICE9PSBudWxsKSxcbiAgICAgICAgICAgICAgICBkYjogbWV0aG9kXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCdcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gU2V0IGFjdGlvbiBmb3IgY2xpY2sgb24gbWFwcGluZyBcIlNhdmUgdG8gZGF0YWJhc2VcIiBidXR0b25cbiAgICAkKCcjbWFwcGluZy1zYXZlLWJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2F2ZUJpb21Ub0RCKCk7XG4gICAgfSk7XG5cbiAgICAvLyBTZXQgYWN0aW9uIGZvciBjbGljayBvbiBtYXBwaW5nIFwiRG93bmxvYWQgYXMgY3N2XCIgYnV0dG9uXG4gICAgJCgnI21hcHBpbmctZG93bmxvYWQtY3N2LWJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IGlkcyA9IGJpb21bZGltZW5zaW9uXS5tYXAoZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50LmlkO1xuICAgICAgICB9KTtcbiAgICAgICAgbGV0IG1hcHBpbmdJZHMgPSBnZXRJZHNGb3JBdHRyaWJ1dGUoZGltZW5zaW9uLCBhdHRyaWJ1dGUpO1xuICAgICAgICBsZXQgZmVubmVjSWRzID0gYmlvbS5nZXRNZXRhZGF0YSh7ZGltZW5zaW9uOiBkaW1lbnNpb24sIGF0dHJpYnV0ZTogWydmZW5uZWMnLCBkYnZlcnNpb24sICdmZW5uZWNfaWQnXX0pO1xuICAgICAgICBsZXQgaWRIZWFkZXIgPSBkaW1lbnNpb24gPT09ICdyb3dzJyA/ICdPVFVfSUQnIDogJ1NhbXBsZV9JRCc7XG4gICAgICAgIGxldCBpZFN0cmluZyA9IGdldElkU3RyaW5nRm9yTWV0aG9kKG1ldGhvZCk7XG4gICAgICAgIHZhciBjc3YgPSBgJHtpZEhlYWRlcn1cXHQke2lkU3RyaW5nfVxcdEZlbm5lY19JRFxcbmA7XG4gICAgICAgIGZvcih2YXIgaT0wOyBpPGlkcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICBjc3YgKz0gaWRzW2ldK1wiXFx0XCIrbWFwcGluZ0lkc1tpXStcIlxcdFwiK2Zlbm5lY0lkc1tpXStcIlxcblwiO1xuICAgICAgICB9XG4gICAgICAgIHZhciBibG9iID0gbmV3IEJsb2IoW2Nzdl0sIHt0eXBlOiBcInRleHQvcGxhaW47Y2hhcnNldD11dGYtOFwifSk7XG4gICAgICAgIHNhdmVBcyhibG9iLCBcIm1hcHBpbmcuY3N2XCIpO1xuICAgIH0pO1xufSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L3Byb2plY3QvZGV0YWlscy9tYXBwaW5nLmpzeCIsIiQoJ2RvY3VtZW50JykucmVhZHkoKCkgPT4ge1xuICAgICQoJyNwcm9qZWN0LWV4cGxvcmUtb3R1LW1ldGFkYXRhJykuY2xpY2soKCkgPT4ge1xuICAgICAgICBpbml0VGFibGUoJ3Jvd3MnLCAnb2JzZXJ2YXRpb24tbWV0YWRhdGEtdGFibGUnKVxuICAgIH0pXG4gICAgJCgnI3Byb2plY3QtZXhwbG9yZS1zYW1wbGUtbWV0YWRhdGEnKS5jbGljaygoKSA9PiB7XG4gICAgICAgIGluaXRUYWJsZSgnY29sdW1ucycsICdzYW1wbGUtbWV0YWRhdGEtdGFibGUnKVxuICAgIH0pXG59KTtcblxuY29uc3QgdGFibGVDb25maWcgPSB7XG4gICAgb3JkZXI6IFsxLCBcImRlc2NcIl0sXG4gICAgZG9tOiAnQmZydGlwJyxcbiAgICBidXR0b25zOiBbXG4gICAgICAgICdjb2x2aXMnXG4gICAgXSxcbiAgICBzY3JvbGxYOiB0cnVlLFxufVxuXG5jb25zdCBnZXRUYWJsZURhdGEgPSAoZGltZW5zaW9uKSA9PiB7XG4gICAgaWYoZGltZW5zaW9uICE9PSAnY29sdW1ucycgJiYgZGltZW5zaW9uICE9PSAncm93cycpe1xuICAgICAgICByZXR1cm4gW1tdLFtdXVxuICAgIH1cbiAgICBsZXQgZGltTWV0YWRhdGEgPSBiaW9tW2RpbWVuc2lvbl0ubWFwKHggPT4ge1xuICAgICAgICBsZXQga2V5ID0gKGRpbWVuc2lvbiA9PT0gJ2NvbHVtbnMnID8gJ1NhbXBsZSBJRCcgOiAnT1RVIElEJylcbiAgICAgICAgbGV0IG1ldGFkYXRhID0ge31cbiAgICAgICAgbWV0YWRhdGFba2V5XSA9ICB4LmlkXG4gICAgICAgIGlmKGRpbWVuc2lvbiA9PT0gJ2NvbHVtbnMnKXtcbiAgICAgICAgICAgIG1ldGFkYXRhW1wiVG90YWwgQ291bnRcIl0gPSBfLnN1bShiaW9tLmdldERhdGFDb2x1bW4oeC5pZCkpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtZXRhZGF0YVtcIlRvdGFsIENvdW50XCJdID0gXy5zdW0oYmlvbS5nZXREYXRhUm93KHguaWQpKVxuICAgICAgICB9XG4gICAgICAgIGZvcihsZXQgbSBvZiBPYmplY3Qua2V5cyh4Lm1ldGFkYXRhKSl7XG4gICAgICAgICAgICBpZihtID09PSAnZmVubmVjJyl7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtZXRhZGF0YVttXSA9IHgubWV0YWRhdGFbbV1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWV0YWRhdGFcbiAgICB9KVxuICAgIGxldCBjb2x1bW5zID0gT2JqZWN0LmtleXMoZGltTWV0YWRhdGFbMF0pLm1hcCh4ID0+ICh7ZGF0YTogeCwgdGl0bGU6IHh9KSlcbiAgICByZXR1cm4gW2RpbU1ldGFkYXRhLCBjb2x1bW5zXVxufVxuXG5jb25zdCBpbml0VGFibGUgPSAoZGltZW5zaW9uLCBpZCkgPT4ge1xuICAgICQoJyNtZXRhZGF0YS10YWJsZS1wcm9ncmVzcycpLnNob3coKVxuICAgIC8vIFRoZSB0aW1lb3V0IGlzIHVzZWQgdG8gbWFrZSB0aGUgYnVzeSBpbmRpY2F0b3Igc2hvdyB1cCBiZWZvcmUgdGhlIGhlYXZ5IGNvbXB1dGF0aW9uIHN0YXJ0c1xuICAgIC8vIFdlYiB3b3JrZXJzIGFyZSBhIGJldHRlciBzb2x1dGlvbiB0byBhY2hpZXZlIHRoaXMgZ29hbCBhbmQgYXZvaWQgaGFuZ2luZyBvZiB0aGUgaW50ZXJmYWNlIGluIHRoZSBmdXR1cmVcbiAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGxldCBbbWV0YWRhdGEsIGNvbHVtbnNdID0gZ2V0VGFibGVEYXRhKGRpbWVuc2lvbilcbiAgICAgICAgJChgIyR7aWR9YCkuRGF0YVRhYmxlKE9iamVjdC5hc3NpZ24oe30sIHRhYmxlQ29uZmlnLCB7XG4gICAgICAgICAgICBkYXRhOiBtZXRhZGF0YSxcbiAgICAgICAgICAgIGNvbHVtbnM6IGNvbHVtbnMsXG4gICAgICAgIH0pKTtcbiAgICAgICAgJCgnI21ldGFkYXRhLXRhYmxlLXByb2dyZXNzJykuaGlkZSgpXG4gICAgfSwgNSlcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvcHJvamVjdC9kZXRhaWxzL21ldGFkYXRhLmpzeCIsIi8qIGdsb2JhbCBkYiAqL1xuLyogZ2xvYmFsIGJpb20gKi9cbi8qIGdsb2JhbCBwaGluY2hQcmV2aWV3UGF0aCAqL1xuZnVuY3Rpb24gYWRqdXN0SWZyYW1lSGVpZ2h0KCkge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAkKCcjaW5zcGVjdC13aXRoLXBoaW5jaC1pZnJhbWUnKS5hdHRyKCdoZWlnaHQnLCAkKCcjaW5zcGVjdC13aXRoLXBoaW5jaC1pZnJhbWUnKS5jb250ZW50cygpLmhlaWdodCgpICsgMjApXG4gICAgfSwgMTAwKVxufVxuXG4kKCdkb2N1bWVudCcpLnJlYWR5KCgpID0+IHtcbiAgICAvLyBTZXQgYWN0aW9uIGZvciBjbGljayBvbiBpbnNwZWN0IHdpdGggUGhpbmNoXG4gICAgLy8gZGIgaXMgdGhlIGJyb3dzZXIgd2Vic3RvcmFnZVxuICAgIGRiLm9wZW4oe1xuICAgICAgICBzZXJ2ZXI6IFwiQmlvbURhdGFcIixcbiAgICAgICAgdmVyc2lvbjogMSxcbiAgICAgICAgc2NoZW1hOiB7XG4gICAgICAgICAgICBcImJpb21cIjoge1xuICAgICAgICAgICAgICAgIGtleToge1xuICAgICAgICAgICAgICAgICAgICBrZXlQYXRoOiAnaWQnLFxuICAgICAgICAgICAgICAgICAgICBhdXRvSW5jcmVtZW50OiB0cnVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSkuZG9uZShmdW5jdGlvbiAoc2VydmVyKSB7XG4gICAgICAgIHZhciBiaW9tVG9TdG9yZSA9IHt9O1xuICAgICAgICBiaW9tVG9TdG9yZS5uYW1lID0gYmlvbS5pZDtcbiAgICAgICAgbGV0IGJpb21TdHJpbmcgPSBiaW9tLnRvU3RyaW5nKCk7XG4gICAgICAgIGJpb21Ub1N0b3JlLnNpemUgPSBiaW9tU3RyaW5nLmxlbmd0aDtcbiAgICAgICAgYmlvbVRvU3RvcmUuZGF0YSA9IGJpb21TdHJpbmc7XG4gICAgICAgIGxldCBkID0gbmV3IERhdGUoKTtcbiAgICAgICAgYmlvbVRvU3RvcmUuZGF0ZSA9IGQuZ2V0VVRDRnVsbFllYXIoKSArIFwiLVwiICsgKGQuZ2V0VVRDTW9udGgoKSArIDEpICsgXCItXCIgKyBkLmdldFVUQ0RhdGUoKSArIFwiVFwiICsgZC5nZXRVVENIb3VycygpICsgXCI6XCIgKyBkLmdldFVUQ01pbnV0ZXMoKSArIFwiOlwiICsgZC5nZXRVVENTZWNvbmRzKCkgKyBcIiBVVENcIjtcbiAgICAgICAgc2VydmVyLmJpb20uYWRkKGJpb21Ub1N0b3JlKS5kb25lKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICAkKCcjaW5zcGVjdC13aXRoLXBoaW5jaC1pZnJhbWUnKS5zaG93KCk7XG4gICAgICAgICAgICAkKCcjaW5zcGVjdC13aXRoLXBoaW5jaC1pZnJhbWUnKS5hdHRyKCdzcmMnLCBwaGluY2hQcmV2aWV3UGF0aCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gQWRqdXN0IHNpemUgb2YgaWZyYW1lIGFmdGVyIGxvYWRpbmcgb2YgUGhpbmNoXG4gICAgJCgnI2luc3BlY3Qtd2l0aC1waGluY2gtaWZyYW1lJykub24oXCJsb2FkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2V0VGltZW91dChhZGp1c3RJZnJhbWVIZWlnaHQsIDEwMDApO1xuICAgIH0pO1xuXG4gICAgJCgnI2luc3BlY3Qtd2l0aC1waGluY2gtdGFiJykub24oJ2NsaWNrJywgYWRqdXN0SWZyYW1lSGVpZ2h0KVxufSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L3Byb2plY3QvZGV0YWlscy9waGluY2guanN4IiwiLyogZ2xvYmFsIGludGVybmFsUHJvamVjdElkICovXG4vKiBnbG9iYWwgZGJ2ZXJzaW9uICovXG5cbiQoJ2RvY3VtZW50JykucmVhZHkoKCkgPT4ge1xuICAgIGdldEFuZFNob3dUcmFpdHMoJyN0cmFpdC10YWJsZScsICdyb3dzJyk7XG4gICAgZ2V0QW5kU2hvd1RyYWl0cygnI3RyYWl0LXRhYmxlLXNhbXBsZScsICdjb2x1bW5zJyk7XG5cbiAgICBmdW5jdGlvbiBnZXRBbmRTaG93VHJhaXRzKGlkLCBkaW1lbnNpb24pe1xuICAgICAgICB2YXIgd2Vic2VydmljZVVybCA9IFJvdXRpbmcuZ2VuZXJhdGUoJ2FwaScsIHsnbmFtZXNwYWNlJzogJ2RldGFpbHMnLCAnY2xhc3NuYW1lJzogJ3RyYWl0c09mT3JnYW5pc21zJ30pO1xuICAgICAgICAvLyBFeHRyYWN0IHJvdyBmZW5uZWNfaWRzIGZyb20gYmlvbVxuICAgICAgICB2YXIgZmVubmVjX2lkcyA9IGJpb20uZ2V0TWV0YWRhdGEoe2RpbWVuc2lvbjogZGltZW5zaW9uLCBhdHRyaWJ1dGU6IFsnZmVubmVjJywgZGJ2ZXJzaW9uLCAnZmVubmVjX2lkJ119KVxuICAgICAgICAgICAgLmZpbHRlciggZWxlbWVudCA9PiBlbGVtZW50ICE9PSBudWxsICk7XG5cbiAgICAgICAgLy8gR2V0IHRyYWl0cyBmb3Igcm93c1xuICAgICAgICAkLmFqYXgod2Vic2VydmljZVVybCwge1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIFwiZGJ2ZXJzaW9uXCI6IGRidmVyc2lvbixcbiAgICAgICAgICAgICAgICBcImZlbm5lY19pZHNcIjogZmVubmVjX2lkc1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIGxldCB0cmFpdHMgPSBbXTtcbiAgICAgICAgICAgICAgICAkLmVhY2goZGF0YSwgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRoaXNUcmFpdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBrZXksXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFpdDogdmFsdWVbJ3RyYWl0X3R5cGUnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiB2YWx1ZVsndHJhaXRfZW50cnlfaWRzJ10ubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmFuZ2U6IDEwMCAqIHZhbHVlWydmZW5uZWNfaWRzJ10ubGVuZ3RoIC8gZmVubmVjX2lkcy5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgdHJhaXRzLnB1c2godGhpc1RyYWl0KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpbml0VHJhaXRzT2ZQcm9qZWN0VGFibGUoaWQsIGRpbWVuc2lvbiwgdHJhaXRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gSW5pdCB0cmFpdHMgb2YgcHJvamVjdCB0YWJsZSB3aXRoIHZhbHVlc1xuICAgIGZ1bmN0aW9uIGluaXRUcmFpdHNPZlByb2plY3RUYWJsZSh0YWJsZUlkLCBkaW1lbnNpb24sIHRyYWl0cykge1xuICAgICAgICBsZXQgbWV0YWRhdGFLZXlzID0gZ2V0TWV0YWRhdGFLZXlzKGJpb20sIGRpbWVuc2lvbilcbiAgICAgICAgJCh0YWJsZUlkKS5EYXRhVGFibGUoe1xuICAgICAgICAgICAgZGF0YTogdHJhaXRzLFxuICAgICAgICAgICAgY29sdW1uczogW1xuICAgICAgICAgICAgICAgIHtkYXRhOiAndHJhaXQnfSxcbiAgICAgICAgICAgICAgICB7ZGF0YTogJ2NvdW50J30sXG4gICAgICAgICAgICAgICAge2RhdGE6ICdyYW5nZSd9LFxuICAgICAgICAgICAgICAgIHtkYXRhOiBudWxsfSxcbiAgICAgICAgICAgICAgICB7ZGF0YTogbnVsbH0sXG4gICAgICAgICAgICAgICAge2RhdGE6IG51bGx9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgb3JkZXI6IFsyLCBcImRlc2NcIl0sXG4gICAgICAgICAgICBjb2x1bW5EZWZzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRzOiAyLFxuICAgICAgICAgICAgICAgICAgICByZW5kZXI6IGRhdGEgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICc8c3BhbiB0aXRsZT1cIicgKyBkYXRhIC8gMTAwICsgJ1wiPjwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwicHJvZ3Jlc3NcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtYmFyIHByb2dyZXNzLWJhci10cmFpdFwiIHJvbGU9XCJwcm9ncmVzc2JhclwiIHN0eWxlPVwid2lkdGg6ICcgKyBkYXRhICsgJyVcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgIE1hdGgucm91bmQoZGF0YSkgKyAnJTwvZGl2PjwvZGl2PicsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0aXRsZS1udW1lcmljJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRzOiAwLFxuICAgICAgICAgICAgICAgICAgICByZW5kZXI6IChkYXRhLCB0eXBlLCBmdWxsKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaHJlZiA9IFJvdXRpbmcuZ2VuZXJhdGUoJ3RyYWl0X2RldGFpbHMnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RidmVyc2lvbic6IGRidmVyc2lvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAndHJhaXRfdHlwZV9pZCc6IGZ1bGwuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICc8YSBocmVmPVwiJyArIGhyZWYgKyAnXCI+JyArIGZ1bGwudHJhaXQgKyAnPC9hPic7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0czogMyxcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyOiAoZGF0YSwgdHlwZSwgZnVsbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhyZWYgPSBSb3V0aW5nLmdlbmVyYXRlKCdwcm9qZWN0X3RyYWl0X2RldGFpbHMnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RidmVyc2lvbic6IGRidmVyc2lvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAndHJhaXRfdHlwZV9pZCc6IGZ1bGwuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3Byb2plY3RfaWQnOiBpbnRlcm5hbFByb2plY3RJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGltZW5zaW9uJzogZGltZW5zaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnPGEgaHJlZj1cIicgKyBocmVmICsgJ1wiPjxpIGNsYXNzPVwiZmEgZmEtc2VhcmNoXCI+PC9pPjwvYT4nO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldHM6IDQsXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlcjogKGRhdGEsIHR5cGUsIGZ1bGwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfLmluZGV4T2YobWV0YWRhdGFLZXlzLCBmdWxsLnRyYWl0KSAhPSAtMSA/ICc8aSBjbGFzcz1cImZhIGZhLWNoZWNrXCI+PC9pPicgOiAnJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldHM6IDUsXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlcjogKGRhdGEsIHR5cGUsIGZ1bGwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfLmluZGV4T2YobWV0YWRhdGFLZXlzLCBmdWxsLnRyYWl0KSAhPSAtMSA/ICc8YSBvbmNsaWNrPVwicmVtb3ZlVHJhaXRGcm9tUHJvamVjdFRhYmxlQWN0aW9uKCcrXCInXCIrZnVsbC50cmFpdCtcIicsJ1wiK2RpbWVuc2lvbitcIidcIisnKVwiPjxpIGNsYXNzPVwiZmEgZmEtdHJhc2hcIj48L2k+PC9hPicgOiAnPGEgb25jbGljaz1cImFkZFRyYWl0VG9Qcm9qZWN0VGFibGVBY3Rpb24oJytmdWxsLmlkKycsJytcIidcIitkaW1lbnNpb24rXCInXCIrJylcIj48aSBjbGFzcz1cImZhIGZhLXBsdXNcIj48L2k+PC9hPic7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuXG5mdW5jdGlvbiBhZGRUcmFpdFRvUHJvamVjdFRhYmxlQWN0aW9uKHRyYWl0VHlwZUlkLCBkaW1lbnNpb24pe1xuICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IFJvdXRpbmcuZ2VuZXJhdGUoJ2FwaScsIHsnbmFtZXNwYWNlJzogJ2RldGFpbHMnLCAnY2xhc3NuYW1lJzogJ1RyYWl0T2ZQcm9qZWN0J30pLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIFwiZGJ2ZXJzaW9uXCI6IGRidmVyc2lvbixcbiAgICAgICAgICAgICAgICBcImludGVybmFsX3Byb2plY3RfaWRcIjogaW50ZXJuYWxQcm9qZWN0SWQsXG4gICAgICAgICAgICAgICAgXCJ0cmFpdF90eXBlX2lkXCI6IHRyYWl0VHlwZUlkLFxuICAgICAgICAgICAgICAgIFwiaW5jbHVkZV9jaXRhdGlvbnNcIjogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIHZhciB0cmFpdFZhbHVlcztcbiAgICAgICAgICAgICAgICBpZihkYXRhLnRyYWl0X2Zvcm1hdCA9PT0gJ251bWVyaWNhbCcpe1xuICAgICAgICAgICAgICAgICAgICB0cmFpdFZhbHVlcyA9IGNvbmRlbnNlTnVtZXJpY2FsVHJhaXRWYWx1ZXMoZGF0YS52YWx1ZXMpXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdHJhaXRWYWx1ZXMgPSBjb25kZW5zZUNhdGVnb3JpY2FsVHJhaXRWYWx1ZXMoZGF0YS52YWx1ZXMpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFkZFRyYWl0VG9Qcm9qZWN0KGRhdGEubmFtZSwgdHJhaXRWYWx1ZXMsIGRhdGEuY2l0YXRpb25zLCBiaW9tLCBkaW1lbnNpb24sIGRidmVyc2lvbiwgaW50ZXJuYWxQcm9qZWN0SWQsICgpID0+IHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVRyYWl0RnJvbVByb2plY3RUYWJsZUFjdGlvbih0cmFpdE5hbWUsIGRpbWVuc2lvbil7XG4gICAgcmVtb3ZlVHJhaXRGcm9tUHJvamVjdCh0cmFpdE5hbWUsIGJpb20sIGRpbWVuc2lvbiwgZGJ2ZXJzaW9uLCBpbnRlcm5hbFByb2plY3RJZCwgKCkgPT4gd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpKVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9SZXNvdXJjZXMvY2xpZW50L2pzeC9wcm9qZWN0L2RldGFpbHMvdHJhaXQuanN4Il0sInNvdXJjZVJvb3QiOiIifQ==