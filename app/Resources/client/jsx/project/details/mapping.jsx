/* global dbversion */
/* global biom */
$('document').ready(() => {
    // Calculate values for mapping overview table
    let sampleOrganismIDs = biom.getMetadata({dimension: 'columns', attribute: ['fennec', dbversion, 'organism_id']}).filter(element => element !== null);
    let otuOrganismIDs = biom.getMetadata({dimension: 'rows', attribute: ['fennec', dbversion, 'organism_id']}).filter(element => element !== null);
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
        var taxids = biom.getMetadata({dimension: dimension, attribute: 'ncbi_taxid'});
        let organism_ids = new Array(taxids.length).fill(null);
        var taxid_total_count = 0;
        var taxid_mapped_count = 0;
        for (let i = 0; i < taxids.length; i++) {
            if (taxids[i] !== null) {
                taxid_total_count++;
                if (taxids[i] in ncbi2organism_id && ncbi2organism_id[taxids[i]] !== null) {
                    taxid_mapped_count++;
                    organism_ids[i] = ncbi2organism_id[taxids[i]];
                }
            }
        }
        biom.addMetadata({dimension: dimension, attribute: ['fennec', dbversion, 'organism_id'], values: organism_ids});
        biom.addMetadata({dimension: dimension, attribute: ['fennec', dbversion, 'assignment_method'], defaultValue: 'ncbi_taxid'});
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
        var fennec_id = biom.getMetadata({dimension: dimension, attribute: ['fennec', dbversion, 'organism_id']});
        var id_header = dimension === 'rows' ? 'OTU_ID' : 'Sample_ID';
        var csv = id_header + "\tNCBI_taxid\tFennec_ID\n";
        for(var i=0; i<ids.length; i++){
            csv += ids[i]+"\t"+ncbi_ids[i]+"\t"+fennec_id[i]+"\n";
        }
        var blob = new Blob([csv], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "mapping.csv");
    });
});