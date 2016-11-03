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
'use strict';

/* global dbversion */
/* global biom */
$('document').ready(function () {
    // Calculate values for mapping overview table
    var sampleOrganismIDs = biom.getMetadata({ dimension: 'columns', attribute: ['fennec', dbversion, 'organism_id'] }).filter(function (element) {
        return element !== null;
    });
    var otuOrganismIDs = biom.getMetadata({ dimension: 'rows', attribute: ['fennec', dbversion, 'organism_id'] }).filter(function (element) {
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

    // Set action for click on mapping "GO" button
    $('#mapping-action-button').on('click', function () {
        dimension = $('#mapping-dimension-select').val();
        var taxids = biom.getMetadata({ dimension: dimension, attribute: 'ncbi_taxid' });
        taxids = taxids.filter(function (value) {
            return value !== null;
        });
        taxids = _.uniq(taxids);
        $('#mapping-results-section').show();
        if (taxids.length === 0) {
            handleNcbiTaxidMappingResult(dimension, []);
        } else {
            var webserviceUrl = Routing.generate('api', { 'namespace': 'mapping', 'classname': 'byNcbiTaxid' });
            $.ajax(webserviceUrl, {
                data: {
                    dbversion: dbversion,
                    ids: taxids
                },
                method: 'POST',
                success: function success(data) {
                    handleNcbiTaxidMappingResult(dimension, data);
                }
            });
        }
    });

    /**
     * Create the results component from the returned mapping and store result in global biom object
     * @param {string} dimension
     * @param {Array} ncbi2organism_id mapping as returned by webservice
     */
    function handleNcbiTaxidMappingResult(dimension, ncbi2organism_id) {
        var taxids = biom.getMetadata({ dimension: dimension, attribute: 'ncbi_taxid' });
        var organism_ids = new Array(taxids.length).fill(null);
        var taxid_total_count = 0;
        var taxid_mapped_count = 0;
        for (var i = 0; i < taxids.length; i++) {
            if (taxids[i] !== null) {
                taxid_total_count++;
                if (taxids[i] in ncbi2organism_id && ncbi2organism_id[taxids[i]] !== null) {
                    taxid_mapped_count++;
                    organism_ids[i] = ncbi2organism_id[taxids[i]];
                }
            }
        }
        biom.addMetadata({ dimension: dimension, attribute: ['fennec', dbversion, 'organism_id'], values: organism_ids });
        biom.addMetadata({ dimension: dimension, attribute: ['fennec', dbversion, 'assignment_method'], defaultValue: 'ncbi_taxid' });
        $('#mapping-results').text("From a total of " + taxids.length + " organisms: " + taxid_total_count + " have a NCBI taxid, of which " + taxid_mapped_count + " could be mapped to organism_ids.");
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
        var ncbi_ids = biom.getMetadata({ dimension: dimension, attribute: 'ncbi_taxid' });
        var fennec_id = biom.getMetadata({ dimension: dimension, attribute: ['fennec', dbversion, 'organism_id'] });
        var id_header = dimension === 'rows' ? 'OTU_ID' : 'Sample_ID';
        var csv = id_header + "\tNCBI_taxid\tFennec_ID\n";
        for (var i = 0; i < ids.length; i++) {
            csv += ids[i] + "\t" + ncbi_ids[i] + "\t" + fennec_id[i] + "\n";
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

    // Extract row organism_ids from biom
    var organism_ids = biom.getMetadata({ dimension: 'rows', attribute: ['fennec', dbversion, 'organism_id'] }).filter(function (element) {
        return element !== null;
    });

    // Get traits for rows
    $.ajax(webserviceUrl, {
        data: {
            "dbversion": dbversion,
            "organism_ids": organism_ids
        },
        method: "POST",
        success: function success(data) {
            $.each(data, function (key, value) {
                var thisTrait = {
                    id: key,
                    trait: value['trait_type'],
                    count: value['trait_entry_ids'].length,
                    range: 100 * value['organism_ids'].length / organism_ids.length
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