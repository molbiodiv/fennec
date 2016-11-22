'use strict';

/* global dbversion */
/* global biom */
/* global internalProjectId */
/* global blackbirdPreviewPath */
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
    var method = 'ncbi_taxid';

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
                    ids: uniq_ids
                },
                method: 'POST',
                success: function success(data) {
                    handleMappingResult(dimension, ids, data, method);
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
        if (method === 'ncbi_taxid') {
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
            'ncbi_taxid': 'byNcbiTaxid',
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
        if (method === 'ncbi_taxid') {
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
        $('#mapping-action-busy-indicator').hide();
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