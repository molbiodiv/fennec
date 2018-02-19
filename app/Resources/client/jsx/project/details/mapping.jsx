/* global dbversion */

const _ = require('lodash')
const $ = require('jquery')
const biomPromise = require('./biom')
// require('bootstrap-select')
const saveAs = require('file-saver').saveAs

$('document').ready(async () => {
    let biom = await biomPromise
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

    // For some reason the select boxes do not open on this page
    $(".bootstrap-select").click(function () {
         $(this).toggleClass("open");
    });
    $(".dropdown").click(function () {
         $(this).toggleClass("open");
    });

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
                method: 'POST',
                data: {
                    db: method,
                    ids: uniq_ids
                },
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
        let route = 'api_mapping_' + method2service[method]
        let webserviceUrl = Routing.generate(route, {'dbversion': dbversion});
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
    async function handleMappingResult(dimension, idsFromBiom, mapping, method) {
        try{
            let fennec_ids = new Array(idsFromBiom.length).fill(null);
            let fennecIds2scinames = await getScinames(Object.values(mapping))
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
            biom.addMetadata({dimension: dimension, attribute: ['fennec', dbversion, 'fennec_id'], values: fennec_ids});
            biom.addMetadata({dimension: dimension, attribute: ['fennec', dbversion, 'assignment_method'], defaultValue: method});
            biom.addMetadata({dimension: dimension, attribute: ['fennec', dbversion, 'scientific_name'], values: scinames});
            var idString = getIdStringForMethod(method);
            $('#mapping-results-section').show();
            $('#mapping-results').text(`From a total of ${idsFromBiom.length} organisms:  ${idsFromBiomNotNullCount} have a ${idString}, of which ${idsFromBiomMappedCount} could be mapped to fennec_ids.`);
        } catch (e){
            showMessageDialog('There was an error: '+e.message, 'danger');
            console.log(e);
        }
        $('#mapping-action-busy-indicator').hide();
    }

    /**
     * Get map from fennec_id to scientific name
     * @param fennec_ids (array of ids, may contain sub-arrays and null: [1,2,[3,4],null,5])
     * @return {Promise.<void>}
     */
    function getScinames(fennec_ids){
        let webserviceUrl = Routing.generate('api_listing_scinames', {'dbversion': dbversion, 'ids': _.flatten(fennec_ids).filter(x => x !== null)});
        return $.ajax(webserviceUrl, {
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