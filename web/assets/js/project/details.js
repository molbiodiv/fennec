'use strict';

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

    $('#project-export-as-biom-v1').click(function () {
        exportProjectAsBiom(false);
    });

    $('#project-export-as-biom-v2').click(function () {
        exportProjectAsBiom(true);
    });

    $('#project-export-pseudo-tax-biom').click(exportPseudoTaxTable);

    $('#project-export-trait-citation').click(exportTraitCitationsTable);

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
            success: function success() {
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
    var conversionServerURL = Routing.generate('biomcs_convert');
    var contentType = asHdf5 ? "application/octet-stream" : "text/plain";
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
    var contentType = "text/plain";
    var tax = _.cloneDeep(biom.getMetadata({ dimension: 'rows', attribute: 'taxonomy' }));
    var header = ['OTUID', 'kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'];
    var nextLevel = _.max(tax.map(function (elem) {
        return elem.length;
    }));
    var otuids = biom.rows.map(function (r) {
        return r.id;
    });
    tax.map(function (v, i) {
        return v.unshift(otuids[i]);
    });
    nextLevel++;
    header = header.slice(0, nextLevel);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        var _loop = function _loop() {
            var trait = _step.value;

            if (trait === 'taxonomy') {
                return 'continue';
            }
            var traitValues = biom.getMetadata({ dimension: 'rows', attribute: trait });
            header[nextLevel] = trait;
            tax.map(function (v, i) {
                return v[nextLevel] = traitValues[i];
            });
            nextLevel++;
        };

        for (var _iterator = Object.keys(biom.rows[0].metadata)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _ret = _loop();

            if (_ret === 'continue') continue;
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    var out = _.join(header, "\t");
    out += "\n";
    out += _.join(tax.map(function (v) {
        return _.join(v, "\t");
    }), "\n");
    var blob = new Blob([out], { type: contentType });
    saveAs(blob, biom.id + ".tsv");
}

/**
 * Opens a file download dialog of all trait citations for this project
 */
function exportTraitCitationsTable() {
    var contentType = "text/plain";
    var out = _.join(['#OTUId', 'fennec_id', 'traitType', 'citation', 'value'], "\t") + "\n";
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = biom.rows[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var otu = _step2.value;

            var id = otu.id;
            var fennec_id = _.get(otu, ['metadata', 'fennec', dbversion, 'fennec_id']) || '';
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = Object.keys(_.get(otu, ['metadata', 'trait_citations']) || {})[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var traitType = _step3.value;
                    var _iteratorNormalCompletion4 = true;
                    var _didIteratorError4 = false;
                    var _iteratorError4 = undefined;

                    try {
                        for (var _iterator4 = _.get(otu, ['metadata', 'trait_citations', traitType])[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                            var tc = _step4.value;

                            out += _.join([id, fennec_id, traitType, tc['citation'], tc['value']], "\t") + "\n";
                        }
                    } catch (err) {
                        _didIteratorError4 = true;
                        _iteratorError4 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                _iterator4.return();
                            }
                        } finally {
                            if (_didIteratorError4) {
                                throw _iteratorError4;
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    var blob = new Blob([out], { type: contentType });
    saveAs(blob, biom.id + ".citations.tsv");
}
'use strict';

/* global dbversion */
/* global biom */
/* global _ */
$('document').ready(function () {
    // Calculate values for mapping overview table
    var sampleOrganismIDs = biom.getMetadata({ dimension: 'columns', attribute: ['fennec', dbversion, 'fennec_id'] }).filter(function (element) {
        return element !== null;
    });
    var otuOrganismIDs = biom.getMetadata({ dimension: 'rows', attribute: ['fennec', dbversion, 'fennec_id'] }).filter(function (element) {
        return element !== null;
    });
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

    // Add semi-global dimension variable (stores last mapped dimension)
    var dimension = 'rows';
    var method = 'ncbi_taxonomy';

    // Set action for click on mapping "GO" button
    $('#mapping-action-button').on('click', function () {
        dimension = $('#mapping-dimension-select').val();
        method = $('#mapping-method-select').val();
        var ids = getIdsForMethod(method, dimension);
        var uniq_ids = ids.filter(function (value) {
            return value !== null;
        });
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
                success: function success(data) {
                    handleMappingResult(dimension, ids, data, method);
                },
                error: function error(_error, status, text) {
                    showMessageDialog('There was a mapping error: ' + text, 'danger');
                    console.log(_error);
                },
                complete: function complete() {
                    $('#mapping-action-busy-indicator').hide();
                }
            });
        }
    });

    /**
     * Returns the array with search id for the respective method in the given dimension
     * @param method
     * @param dimension
     * @return {Array}
     */
    function getIdsForMethod(method, dimension) {
        var ids = [];
        if (method === 'ncbi_taxonomy') {
            ids = biom.getMetadata({ dimension: dimension, attribute: 'ncbi_taxid' });
        } else if (method === 'organism_name') {
            ids = biom[dimension].map(function (element) {
                return element.id;
            });
        }
        return ids;
    }

    /**
     * Returns the webserviceUrl for the given mapping method
     * @param method
     * @return {string}
     */
    function getWebserviceUrlForMethod(method) {
        var method2service = {
            'ncbi_taxonomy': 'byDbxrefId',
            'organism_name': 'byOrganismName'
        };
        var webserviceUrl = Routing.generate('api', { 'namespace': 'mapping', 'classname': method2service[method] });
        return webserviceUrl;
    }

    /**
     * Returns a string representation for the IDs used for mapping in the chosen method
     * @param method
     * @return {string}
     */
    function getIdStringForMethod(method) {
        var idString = "";
        if (method === 'ncbi_taxonomy') {
            idString = "NCBI taxid";
        } else if (method === 'organism_name') {
            idString = "Organism name";
        }
        return idString;
    }

    /**
     * Create the results component from the returned mapping and store result in global biom object
     * @param {string} dimension
     * @param {Array} idsFromBiom those are the ids used for mapping in the order they appear in the biom file
     * @param {Array} mapping from ids to fennec_ids as returned by webservice
     * @param {string} method of mapping
     */
    function handleMappingResult(dimension, idsFromBiom, mapping, method) {
        var fennec_ids = new Array(idsFromBiom.length).fill(null);
        var idsFromBiomNotNullCount = 0;
        var idsFromBiomMappedCount = 0;
        for (var i = 0; i < idsFromBiom.length; i++) {
            if (idsFromBiom[i] !== null) {
                idsFromBiomNotNullCount++;
                if (idsFromBiom[i] in mapping && mapping[idsFromBiom[i]] !== null) {
                    idsFromBiomMappedCount++;
                    fennec_ids[i] = mapping[idsFromBiom[i]];
                }
            }
        }
        biom.addMetadata({ dimension: dimension, attribute: ['fennec', dbversion, 'fennec_id'], values: fennec_ids });
        biom.addMetadata({ dimension: dimension, attribute: ['fennec', dbversion, 'assignment_method'], defaultValue: method });
        var idString = getIdStringForMethod(method);
        $('#mapping-results-section').show();
        $('#mapping-results').text('From a total of ' + idsFromBiom.length + ' organisms:  ' + idsFromBiomNotNullCount + ' have a ' + idString + ', of which ' + idsFromBiomMappedCount + ' could be mapped to fennec_ids.');
    }

    // Set action for click on mapping "Save to database" button
    $('#mapping-save-button').on('click', function () {
        saveBiomToDB();
    });

    // Set action for click on mapping "Download as csv" button
    $('#mapping-download-csv-button').on('click', function () {
        var ids = biom[dimension].map(function (element) {
            return element.id;
        });
        var mappingIds = getIdsForMethod(method, dimension);
        var fennecIds = biom.getMetadata({ dimension: dimension, attribute: ['fennec', dbversion, 'fennec_id'] });
        var idHeader = dimension === 'rows' ? 'OTU_ID' : 'Sample_ID';
        var idString = getIdStringForMethod(method);
        var csv = idHeader + '\t' + idString + '\tFennec_ID\n';
        for (var i = 0; i < ids.length; i++) {
            csv += ids[i] + "\t" + mappingIds[i] + "\t" + fennecIds[i] + "\n";
        }
        var blob = new Blob([csv], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "mapping.csv");
    });
});
'use strict';

/* global db */
/* global biom */
/* global phinchPreviewPath */
$('document').ready(function () {
    // Set action for click on inspect with Phinch
    // db is the browser webstorage
    $('#inspect-with-phinch-button').click(function () {
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
            var biomString = biom.toString();
            biomToStore.size = biomString.length;
            biomToStore.data = biomString;
            var d = new Date();
            biomToStore.date = d.getUTCFullYear() + "-" + (d.getUTCMonth() + 1) + "-" + d.getUTCDate() + "T" + d.getUTCHours() + ":" + d.getUTCMinutes() + ":" + d.getUTCSeconds() + " UTC";
            server.biom.add(biomToStore).done(function (item) {
                $('#inspect-with-phinch-iframe').show();
                $('#inspect-with-phinch-iframe').attr('src', phinchPreviewPath);
            });
        });
    });

    // Adjust size of iframe after loading of Phinch
    $('#inspect-with-phinch-iframe').on("load", function () {
        setTimeout(function () {
            $('#inspect-with-phinch-iframe').attr('height', $('#inspect-with-phinch-iframe').contents().height() + 20);
        }, 1000);
    });
});
'use strict';

/* global internalProjectId */
/* global dbversion */

$('document').ready(function () {
    var traits = [];
    var webserviceUrl = Routing.generate('api', { 'namespace': 'details', 'classname': 'traitsOfOrganisms' });

    // Extract row fennec_ids from biom
    var fennec_ids = biom.getMetadata({ dimension: 'rows', attribute: ['fennec', dbversion, 'fennec_id'] }).filter(function (element) {
        return element !== null;
    });

    // Get traits for rows
    $.ajax(webserviceUrl, {
        data: {
            "dbversion": dbversion,
            "fennec_ids": fennec_ids
        },
        method: "POST",
        success: function success(data) {
            $.each(data, function (key, value) {
                var thisTrait = {
                    id: key,
                    trait: value['trait_type'],
                    count: value['trait_entry_ids'].length,
                    range: 100 * value['fennec_ids'].length / fennec_ids.length
                };
                traits.push(thisTrait);
            });
            initTraitsOfProjectTable();
        }
    });

    // Init traits of project table with values
    function initTraitsOfProjectTable() {
        $('#trait-table').DataTable({
            data: traits,
            columns: [{ data: 'trait' }, { data: 'count' }, { data: 'range' }, { data: null }],
            order: [2, "desc"],
            columnDefs: [{
                targets: 2,
                render: function render(data) {
                    return '<span title="' + data / 100 + '"></span>' + '<div class="progress">' + '<div class="progress-bar progress-bar-trait" role="progressbar" style="width: ' + data + '%">' + Math.round(data) + '%</div></div>';
                },
                type: 'title-numeric'
            }, {
                targets: 0,
                render: function render(data, type, full) {
                    var href = Routing.generate('trait_details', {
                        'dbversion': dbversion,
                        'trait_type_id': full.id
                    });
                    return '<a href="' + href + '">' + full.trait + '</a>';
                }
            }, {
                targets: 3,
                render: function render(data, type, full) {
                    var href = Routing.generate('project_trait_details', {
                        'dbversion': dbversion,
                        'trait_type_id': full.id,
                        'project_id': internalProjectId
                    });
                    return '<a href="' + href + '">Details</a>';
                }
            }]
        });
    }
});