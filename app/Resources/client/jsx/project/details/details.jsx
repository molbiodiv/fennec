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

    // save biom to database
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
                success: function (data) {
                    location.reload();
                }
            });
        }, function (failure) {
            console.log(failure);
        });
    }

    // Calculate values for mapping overview table
    var sampleMetadataFennec = biom.getMetadata({dimension: 'columns', attribute: 'fennec'});
    var mappedSamples = countOrganismIds(sampleMetadataFennec);
    var percentageMappedSamples = 100 * mappedSamples / biom.shape[1];
    var otuMetadataFennec = biom.getMetadata({dimesion: 'rows', attribute: 'fennec'});
    var mappedOTUs = countOrganismIds(otuMetadataFennec);
    var percentageMappedOTUs = 100 * mappedOTUs / biom.shape[0];
    function countOrganismIds(metadata) {
        var organismIds = 0;
        $.each(metadata, function (key, value) {
            if (hasOrganismId(value)) {
                organismIds++;
            }
        });
        return organismIds;
    }
    function hasOrganismId(value) {
        return value !== null && dbversion in value && 'organism_id' in value[dbversion] && value[dbversion].organism_id !== null;
    }

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
        var taxids = biom.getMetadata({dimension: dimension, attribute: 'ncbi_taxid'});
        taxids = taxids.filter(function (value) {
            return value !== null;
        });
        taxids = _.uniq(taxids);
        $('#mapping-results-section').show();
        if (taxids.length === 0) {
            handleNcbiTaxidMappingResult(dimension, []);
        } else {
            var webserviceUrl = Routing.generate('api', {'namespace': 'mapping', 'classname': 'byNcbiTaxid'});
            $.ajax(webserviceUrl, {
                data: {
                    dbversion: dbversion,
                    ids: taxids
                },
                method: 'POST',
                success: function (data) {
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
        var fennec = biom.getMetadata({dimension: dimension, attribute: 'fennec'});
        var taxids = biom.getMetadata({dimension: dimension, attribute: 'ncbi_taxid'});
        var taxid_total_count = 0;
        var taxid_mapped_count = 0;
        for (var i = 0; i < taxids.length; i++) {
            if (fennec[i] === null) {
                fennec[i] = {};
            }
            fennec[i][dbversion] = {
                'organism_id': null,
                'assignment_method': 'ncbi_taxid'
            };
            if (taxids[i] !== null) {
                taxid_total_count++;
                if (taxids[i] in ncbi2organism_id && ncbi2organism_id[taxids[i]] !== null) {
                    taxid_mapped_count++;
                    fennec[i][dbversion]['organism_id'] = ncbi2organism_id[taxids[i]];
                }
            }
        }
        biom.addMetadata({dimension: dimension, attribute: 'fennec', values: fennec});
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
        var ncbi_ids = biom.getMetadata({dimension: dimension, attribute: 'ncbi_taxid'});
        var fennec_id = biom.getMetadata({dimension: dimension, attribute: 'fennec'}).map(function (value) {
            return value[dbversion]['organism_id'];
        });
        var id_header = dimension === 'rows' ? 'OTU_ID' : 'Sample_ID';
        var csv = id_header + "\tNCBI_taxid\tFennec_ID\n";
        for(var i=0; i<ids.length; i++){
            csv += ids[i]+"\t"+ncbi_ids[i]+"\t"+fennec_id[i]+"\n";
        }
        var blob = new Blob([csv], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "mapping.csv");
    });


});