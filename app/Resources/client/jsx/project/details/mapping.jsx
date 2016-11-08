/* global dbversion */
/* global biom */
/* global _ */
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
    var method = 'ncbi_taxid';

    // Set action for click on mapping "GO" button
    $('#mapping-action-button').on('click', function () {
        dimension = $('#mapping-dimension-select').val();
        method = $('#mapping-method-select').val();
        let ids = getIdsForMethod(method, dimension);
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
                    ids: uniq_ids
                },
                method: 'POST',
                success: function (data) {
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
        let ids = [];
        if(method === 'ncbi_taxid'){
            ids = biom.getMetadata({dimension: dimension, attribute: 'ncbi_taxid'});
        } else if(method === 'organism_name'){
            ids = biom[dimension].map((element) => element.id);
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
            'ncbi_taxid': 'byNcbiTaxid',
            'organism_name': 'byOrganismName'
        };
        let webserviceUrl = Routing.generate('api', {'namespace': 'mapping', 'classname': method2service[method]});
        return webserviceUrl;
    }

    /**
     * Returns a string representation for the IDs used for mapping in the chosen method
     * @param method
     * @return {string}
     */
    function getIdStringForMethod(method) {
        let idString = "";
        if (method === 'ncbi_taxid'){
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
     * @param {Array} mapping from ids to organism_ids as returned by webservice
     * @param {string} method of mapping
     */
    function handleMappingResult(dimension, idsFromBiom, mapping, method) {
        let organism_ids = new Array(idsFromBiom.length).fill(null);
        var idsFromBiomNotNullCount = 0;
        var idsFromBiomMappedCount = 0;
        for (let i = 0; i < idsFromBiom.length; i++) {
            if (idsFromBiom[i] !== null) {
                idsFromBiomNotNullCount++;
                if (idsFromBiom[i] in mapping && mapping[idsFromBiom[i]] !== null) {
                    idsFromBiomMappedCount++;
                    organism_ids[i] = mapping[idsFromBiom[i]];
                }
            }
        }
        biom.addMetadata({dimension: dimension, attribute: ['fennec', dbversion, 'organism_id'], values: organism_ids});
        biom.addMetadata({dimension: dimension, attribute: ['fennec', dbversion, 'assignment_method'], defaultValue: method});
        var idString = getIdStringForMethod(method);
        $('#mapping-action-busy-indicator').hide();
        $('#mapping-results-section').show();
        $('#mapping-results').text(`From a total of ${idsFromBiom.length} organisms:  ${idsFromBiomNotNullCount} have a ${idString}, of which ${idsFromBiomMappedCount} could be mapped to organism_ids.`);
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
        let mappingIds = getIdsForMethod(method, dimension);
        let fennecIds = biom.getMetadata({dimension: dimension, attribute: ['fennec', dbversion, 'organism_id']});
        let idHeader = dimension === 'rows' ? 'OTU_ID' : 'Sample_ID';
        let idString = getIdStringForMethod(method);
        var csv = `${idHeader}\t${idString}\tFennec_ID\n`;
        for(var i=0; i<ids.length; i++){
            csv += ids[i]+"\t"+mappingIds[i]+"\t"+fennecIds[i]+"\n";
        }
        var blob = new Blob([csv], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "mapping.csv");
    });
});