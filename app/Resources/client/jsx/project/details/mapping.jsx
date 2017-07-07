/* global dbversion */
/* global biom */
/* global _ */
$('document').ready(() => {
    // Calculate values for mapping overview table
    let sampleOrganismIDs = biom.getMetadata({dimension: 'columns', attribute: ['fennec', dbversion, 'fennec_id']}).filter(element => element !== null);
    let otuOrganismIDs = biom.getMetadata({dimension: 'rows', attribute: ['fennec', dbversion, 'fennec_id']}).filter(element => element !== null);
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

    let methods = {ncbi_taxonomy: "NCBI taxid", organism_name: "Scientific name", iucn_redlist: "IUCN id", EOL: "EOL id"};
    $.each(methods, (key, value) => {
        addOptionToSelectpicker(key, value, 'mapping-method-select');
    })

    let sampleMetadataKeys = getMetadataKeys(biom, 'columns');
    addOptionToSelectpicker('ID', 'ID', 'mapping-metadata-sample-select')
    $.each(sampleMetadataKeys, (key, value) => {
        addOptionToSelectpicker('md:'+value, value, 'mapping-metadata-sample-select')
    })

    let observationMetadataKeys = getMetadataKeys(biom, 'rows');
    addOptionToSelectpicker('ID', 'ID', 'mapping-metadata-observation-select')
    $.each(observationMetadataKeys, (key, value) => {
        addOptionToSelectpicker('md:'+value, value, 'mapping-metadata-observation-select')
    })

    $('#mapping-dimension-select').on('change', () => {
        if($('#mapping-dimension-select').val() === 'rows'){
            $('#mapping-metadata-sample-select').selectpicker('hide');
            $('#mapping-metadata-observation-select').selectpicker('show');
        } else {
            $('#mapping-metadata-sample-select').selectpicker('show');
            $('#mapping-metadata-observation-select').selectpicker('hide');
        }
    })

    $('.selectpicker').selectpicker('refresh')
    $('#mapping-dimension-select').change();

    // Add semi-global dimension variable (stores last mapped dimension)
    var dimension = 'rows';
    var method = 'ncbi_taxonomy';
    var attribute = '';

    // Set action for click on mapping "GO" button
    $('#mapping-action-button').on('click', function () {
        dimension = $('#mapping-dimension-select').val();
        method = $('#mapping-method-select').val();
        if(dimension === 'rows'){
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
                    showMessageDialog('There was a mapping error: '+text, 'danger');
                    console.log(error);
                },
                complete: () => {$('#mapping-action-busy-indicator').hide();}
            });
        }
    });

    function addOptionToSelectpicker(value, text, id) {
        let option = $('<option>').prop('value', value).text(text)
        $('#'+id).append(option)
    }

    /**
     * Returns the array with search id for the respective method in the given dimension
     * @param dimension
     * @param attribute
     * @return {Array}
     */
    function getIdsForAttribute(dimension, attribute) {
        let ids = [];
        if(attribute.substr(0,3) === 'md:'){
            ids = biom.getMetadata({dimension: dimension, attribute: attribute.substr(3)});
        } else {
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
            'ncbi_taxonomy': 'byDbxrefId',
            'EOL': 'byDbxrefId',
            'iucn_redlist': 'byDbxrefId',
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
        return methods[method];
    }

    /**
     * Create the results component from the returned mapping and store result in global biom object
     * @param {string} dimension
     * @param {Array} idsFromBiom those are the ids used for mapping in the order they appear in the biom file
     * @param {Array} mapping from ids to fennec_ids as returned by webservice
     * @param {string} method of mapping
     */
    function handleMappingResult(dimension, idsFromBiom, mapping, method) {
        let fennec_ids = new Array(idsFromBiom.length).fill(null);
        var idsFromBiomNotNullCount = 0;
        var idsFromBiomMappedCount = 0;
        for (let i = 0; i < idsFromBiom.length; i++) {
            if (idsFromBiom[i] !== null) {
                idsFromBiomNotNullCount++;
                if (idsFromBiom[i] in mapping && mapping[idsFromBiom[i]] !== null && !Array.isArray(mapping[idsFromBiom[i]])) {
                    idsFromBiomMappedCount++;
                    fennec_ids[i] = mapping[idsFromBiom[i]];
                }
            }
        }
        biom.addMetadata({dimension: dimension, attribute: ['fennec', dbversion, 'fennec_id'], values: fennec_ids});
        biom.addMetadata({dimension: dimension, attribute: ['fennec', dbversion, 'assignment_method'], defaultValue: method});
        var idString = getIdStringForMethod(method);
        $('#mapping-results-section').show();
        $('#mapping-results').text(`From a total of ${idsFromBiom.length} organisms:  ${idsFromBiomNotNullCount} have a ${idString}, of which ${idsFromBiomMappedCount} could be mapped to fennec_ids.`);
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
        let fennecIds = biom.getMetadata({dimension: dimension, attribute: ['fennec', dbversion, 'fennec_id']});
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