/* global internalProjectId */
/* global dbversion */

const addTraitToProject = require('../helpers/addTraitToProject');
const removeTraitFromProject = require('../helpers/removeTraitFromProject');
const biomPromise = require('./biom');
let biom;

$('document').ready(async () => {
    biom = await biomPromise;
    let attribute = $('#project-data').data('attribute');
    $('#project-show-trait-otu').on('click', () => getAndShowTraits('#trait-table', 'rows', attribute));
    $('#project-show-trait-sample').on('click', () => getAndShowTraits('#trait-table-sample', 'columns', attribute));

    function getAndShowTraits(id, dimension, attribute){
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
        let traitEntryIds = []
        let traitData = []
        $.each(rawData, function (key, value) {
            traitEntryIds = _.concat(traitEntryIds, value.traitEntryIds)
            traitData.push({
                'entries': value.traitEntryIds,
                'traitType': value['traitType'],
                'traitTypeId': key,
                'fennec': value['fennec']
            })
        })
        var webserviceUrl = Routing.generate('api_details_trait_entries', {'dbversion': dbversion});
        $.ajax(webserviceUrl, {
            method: "POST",
            data: {
                'trait_entry_ids': traitEntryIds,
                'trait_format': 'categorical_free'
            },
            success: function (data) {
                let fullData = traitData.map(x => Object.assign({}, x, {
                    entries: x.entries.map(traitEntryId => data[traitEntryId])
                }))
                initTraitsOfProjectTable(tableId, dimension, fullData)
                $('#trait-table-progress').hide();
            }
        });
    }

    // Init traits of project table with values
    function initTraitsOfProjectTable(tableId, dimension, traits) {
        let metadataKeys = getMetadataKeys(biom, dimension)
        let fennec_ids = biom.getMetadata({dimension: dimension, attribute: ['fennec', dbversion, 'fennec_id']})
        let number_of_unique_fennec_ids = _.uniq(fennec_ids).length
        console.log(traits)
        let dataTableOptions = {
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

// Make action functions global for now in order to work with the onclick string
global.addTraitToProjectTableAction = addTraitToProjectTableAction;
global.removeTraitFromProjectTableAction = removeTraitFromProjectTableAction;