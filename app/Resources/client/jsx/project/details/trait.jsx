/* global internalProjectId */
/* global dbversion */

import {TraitEntryFilter} from "../../helpers/traitEntryfilters";

const addTraitToProject = require('../helpers/addTraitToProject');
const removeTraitFromProject = require('../helpers/removeTraitFromProject');
const biomPromise = require('./biom');
let biom;
let traitData = {}
let traitEntryFilter = new TraitEntryFilter(traitData);

$('document').ready(async () => {
    biom = await biomPromise;
    let attribute = $('#project-data').data('attribute');
    $('#project-show-trait-otu').on('click', () => getAndShowTraits('#trait-table', 'rows'));
    $('#project-show-trait-sample').on('click', () => getAndShowTraits('#trait-table-sample', 'columns'));
    $('#trait-filter-apply').on('click', () => applyTraitEntryFilter());

    $('#trait-filter-by-userdb').on('change', () => {
        if($('#trait-filter-by-userdb').prop("checked")){
            $('#trait-filter-by-userdb-card').show()
        } else {
            $('#trait-filter-by-userdb-card').hide()
        }
    })

    $('#trait-filter-by-coverage').slider({
        range: true,
        min: 0,
        max: 100,
        values: [20, 70]
    });

    function getAndShowTraits(id, dimension){
        $('#panel-trait-table').hide();
        $('#trait-filter-by-provider-card').empty()
        $('#panel-trait-filters').hide();
        $('#trait-table-progress').show();
        // Extract row fennec_ids from biom
        var fennec_ids = biom.getMetadata({dimension: dimension, attribute: ['fennec', dbversion, 'fennec_id']})
            .filter( element => element !== null );
        // Get traits for rows
        var webserviceUrl = Routing.generate('api_details_traits_of_organisms', {'dbversion': dbversion});
        $.ajax(webserviceUrl, {
            method: "POST",
            data: {
                'fennecIds': fennec_ids
            },
            success: function (data) {
                getTraitEntries(data, id, dimension);
            }
        });
    }

    function getTraitEntries(rawData, tableId, dimension){
        if(rawData.length === 0){
            showMessageDialog("No traits found", 'info')
            $('#trait-table-progress').hide();
            return;
        }
        let traitEntryIds = {'categorical_free': [], 'numerical': []}
        let traitData = []
        let provider = []
        $.each(rawData, function (key, value) {
            let traitFormat = value['traitFormat']
            traitEntryIds[traitFormat] = _.concat(traitEntryIds[traitFormat], value.traitEntryIds)
            traitData.push({
                'entries': value.traitEntryIds,
                'traitType': value['traitType'],
                'traitTypeId': key,
                'fennec': value['fennec'],
                'traitFormat': traitFormat
            })
        })
        var webserviceUrl = Routing.generate('api_details_trait_entries', {'dbversion': dbversion});
        $.ajax(webserviceUrl, {
            method: "POST",
            data: {
                'trait_entry_ids': traitEntryIds['categorical_free'],
                'trait_format': 'categorical_free'
            },
            success: function (categorical_data) {
                let providerCategoricalEntries = _.uniq(Object.values(categorical_data).map(x => x.provider));
                let fullData = traitData.map(x => {
                    if(x.traitFormat !== 'categorical_free'){
                        return x;
                    }
                    return Object.assign({}, x, {
                        entries: x.entries.map(traitEntryId => categorical_data[traitEntryId])
                    })
                });
                $.ajax(webserviceUrl, {
                    method: "POST",
                    data: {
                        'trait_entry_ids': traitEntryIds['numerical'],
                        'trait_format': 'numerical'
                    },
                    success: function(numerical_data){
                        let providerNumericalEntries = _.uniq(Object.values(numerical_data).map(x => x.provider));
                        let provider = providerCategoricalEntries.concat(providerNumericalEntries)
                        $.each(provider, function(key, value){
                            $('#trait-filter-by-provider-card').append("<input class='form-check-input' type='checkbox' " +
                                "id='trait-filter-by-"+value+"' value='"+value+"'> "+value+" <br>")
                        })
                        $('#trait-filter-by-provider-card').append("<input class='form-check-input' type='checkbox' " +
                            "id='trait-filter-by-userdb' value='userImport'> user import<br>")
                        fullData = fullData.map(x => {
                            if(x.traitFormat !== 'numerical'){
                                return x;
                            }
                            return Object.assign({}, x, {
                                entries: x.entries.map(traitEntryId => numerical_data[traitEntryId])
                            })
                        });
                        $(tableId).show();
                        $('#panel-trait-table').show();
                        $('#panel-trait-filters').show();
                        traitEntryFilter = new TraitEntryFilter(fullData)
                        initTraitsOfProjectTable(tableId, dimension, traitEntryFilter.applyFilter())
                        $('#trait-table-progress').hide();
                    }
                })
            }
        });
    }

    // Init traits of project table with values
    function initTraitsOfProjectTable(tableId, dimension, traits) {
        let metadataKeys = getMetadataKeys(biom, dimension)
        let fennec_ids = biom.getMetadata({dimension: dimension, attribute: ['fennec', dbversion, 'fennec_id']})
        let number_of_unique_fennec_ids = _.uniq(fennec_ids).length
        let dataTableOptions = {
            destroy: true,
            data: traits,
            columns: [
                {data: 'traitType'},
                {data: null},
                {data: null},
                {data: null},
                {data: null},
                {data: null}
            ],
            order: [2, "desc"],
            columnDefs: [
                {
                    targets: 0,
                    render: (data, type, full) => {
                        var href = Routing.generate('trait_details', {
                            'dbversion': dbversion,
                            'attribute': attribute,
                            'trait_type_id': full.traitTypeId
                        });
                        return '<a href="' + href + '">' + full.traitType + '</a>';
                    }
                },
                {
                    targets: 1,
                    render: (data, type, full) => full.entries.length
                },
                {
                    targets: 2,
                    render: (data, type, full) => {
                        let range = 100 * full['fennec'].length / number_of_unique_fennec_ids
                        return '<span title="' + range / 100 + '"></span>' +
                            '<div class="progress">' +
                            '<div class="progress-bar progress-bar-trait" role="progressbar" style="width: ' + range + '%">' +
                            Math.round(range) + '%</div></div>'
                    }
                },
                {
                    targets: 3,
                    render: (data, type, full) => {
                        var href = Routing.generate('project_trait_details', {
                            'dbversion': dbversion,
                            'trait_type_id': full.traitTypeId,
                            'project_id': internalProjectId,
                            'dimension': dimension,
                            'attribute': attribute
                        });
                        return '<a href="' + href + '"><i class="fa fa-search"></i></a>';
                    }
                },
                {
                    targets: 4,
                    render: (data, type, full) => {
                        return _.indexOf(metadataKeys, full.traitType) != -1 ? '<i class="fa fa-check"></i>' : ''
                    }
                },
                {
                    targets: 5,
                    render: (data, type, full) => {
                        return _.indexOf(metadataKeys, full.traitType) != -1 ? '<a onclick="removeTraitFromProjectTableAction('+"'"+full.traitType+"','"+dimension+"'"+')"><i class="fa fa-trash"></i></a>' : '<a onclick="addTraitToProjectTableAction('+full.traitTypeId+','+"'"+dimension+"'"+')"><i class="fa fa-plus"></i></a>';
                    }
                }
            ]
        };
        if (permission === 'view'){
            dataTableOptions.columnDefs[4].visible = false;
        }
        $(tableId).DataTable(dataTableOptions);
    }
});

function addTraitToProjectTableAction(traitTypeId, dimension){
    $.ajax({
            url: Routing.generate('api_details_trait_of_project', {'dbversion': dbversion}),
            method: "POST",
            data: {
                'projectId': internalProjectId,
                'traitTypeId': traitTypeId,
                'includeCitations': true,
                'dimension': dimension
            },
            success: function (data) {
                var traitValues;
                if(data.trait_format === 'numerical'){
                    traitValues = condenseNumericalTraitValues(data.values)
                } else {
                    traitValues = condenseCategoricalTraitValues(data.values)
                }
                addTraitToProject(data.type, traitValues, data.citations, biom, dimension, dbversion, internalProjectId, () => window.location.reload())
            }
        });
}

function removeTraitFromProjectTableAction(traitName, dimension){
    removeTraitFromProject(traitName, biom, dimension, dbversion, internalProjectId, () => window.location.reload())
}

function applyTraitEntryFilter(){
    let user = $('#trait-filter-by-user').val()
    let format = $('#trait-filter-by-format').val()
    let userBlacklist = [user]
    let providerBlacklist = []
    let traitFormatBlacklist = []
    if($('#trait-filter-by-ncbi').prop("checked")){
        providerBlacklist.push($('#trait-filter-by-ncbi').val())
    }
    if($('#trait-filter-by-iucn').prop("checked")){
        providerBlacklist.push($('#trait-filter-by-iucn').val())
    }
    if($('#trait-filter-by-eol').prop("checked")){
        providerBlacklist.push($('#trait-filter-by-eol').val())
    }
    if($('#trait-filter-by-eppo').prop("checked")){
        providerBlacklist.push($('#trait-filter-by-eppo').val())
    }
    if($('#trait-filter-by-leda').prop("checked")){
        providerBlacklist.push($('#trait-filter-by-leda').val())
    }
    if(format != "none"){
        traitFormatBlacklist = [format]
    }
    let filter = {
        providerBlacklist: providerBlacklist,
        userBlacklist: userBlacklist,
        traitFormatBlacklist: traitFormatBlacklist
    }
    traitEntryFilter.filter = filter
    let table = $('#trait-table').DataTable()
    table.clear()
    table.rows.add(traitEntryFilter.applyFilter())
    table.draw()
}

// Make action functions global for now in order to work with the onclick string
global.addTraitToProjectTableAction = addTraitToProjectTableAction;
global.removeTraitFromProjectTableAction = removeTraitFromProjectTableAction;