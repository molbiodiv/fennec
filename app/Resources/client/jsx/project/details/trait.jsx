/* global internalProjectId */
/* global dbversion */

const addTraitToProject = require('../helpers/addTraitToProject');
const removeTraitFromProject = require('../helpers/removeTraitFromProject');
const biomPromise = require('./biom')
let biom

$('document').ready(async () => {
    biom = await biomPromise
    getAndShowTraits('#trait-table', 'rows');
    getAndShowTraits('#trait-table-sample', 'columns');

    function getAndShowTraits(id, dimension){
        var webserviceUrl = Routing.generate('api', {'namespace': 'details', 'classname': 'traitsOfOrganisms', 'dbversion': dbversion});
        // Extract row fennec_ids from biom
        var fennec_ids = biom.getMetadata({dimension: dimension, attribute: ['fennec', dbversion, 'fennec_id']})
            .filter( element => element !== null );
        // Get traits for rows
        $.ajax(webserviceUrl, {
            data: {
                "dbversion": dbversion,
                "fennec_ids": fennec_ids
            },
            method: "POST",
            success: function (data) {
                let traits = [];
                $.each(data, function (key, value) {
                    var thisTrait = {
                        id: key,
                        trait: value['traitType'],
                        count: value['traitEntryIds'].length,
                        range: 100 * value['fennec'].length / fennec_ids.length
                    };
                    traits.push(thisTrait);
                });
                initTraitsOfProjectTable(id, dimension, traits);
            }
        });
    }

    // Init traits of project table with values
    function initTraitsOfProjectTable(tableId, dimension, traits) {
        let metadataKeys = getMetadataKeys(biom, dimension)
        $(tableId).DataTable({
            data: traits,
            columns: [
                {data: 'trait'},
                {data: 'count'},
                {data: 'range'},
                {data: null},
                {data: null},
                {data: null}
            ],
            order: [2, "desc"],
            columnDefs: [
                {
                    targets: 2,
                    render: data =>
                        '<span title="' + data / 100 + '"></span>' +
                        '<div class="progress">' +
                        '<div class="progress-bar progress-bar-trait" role="progressbar" style="width: ' + data + '%">' +
                        Math.round(data) + '%</div></div>',
                    type: 'title-numeric'
                },
                {
                    targets: 0,
                    render: (data, type, full) => {
                        var href = Routing.generate('trait_details', {
                            'dbversion': dbversion,
                            'trait_type_id': full.id
                        });
                        return '<a href="' + href + '">' + full.trait + '</a>';
                    }
                },
                {
                    targets: 3,
                    render: (data, type, full) => {
                        var href = Routing.generate('project_trait_details', {
                            'dbversion': dbversion,
                            'trait_type_id': full.id,
                            'project_id': internalProjectId,
                            'dimension': dimension
                        });
                        return '<a href="' + href + '"><i class="fa fa-search"></i></a>';
                    }
                },
                {
                    targets: 4,
                    render: (data, type, full) => {
                        return _.indexOf(metadataKeys, full.trait) != -1 ? '<i class="fa fa-check"></i>' : ''
                    }
                },
                {
                    targets: 5,
                    render: (data, type, full) => {
                        return _.indexOf(metadataKeys, full.trait) != -1 ? '<a onclick="removeTraitFromProjectTableAction('+"'"+full.trait+"','"+dimension+"'"+')"><i class="fa fa-trash"></i></a>' : '<a onclick="addTraitToProjectTableAction('+full.id+','+"'"+dimension+"'"+')"><i class="fa fa-plus"></i></a>';
                    }
                }
            ]
        });
    }
});

function addTraitToProjectTableAction(traitTypeId, dimension){
    $.ajax({
            url: Routing.generate('api', {'namespace': 'details', 'classname': 'TraitOfProject', 'dbversion': dbversion}),
            data: {
                "dbversion": dbversion,
                "internal_project_id": internalProjectId,
                "trait_type_id": traitTypeId,
                "include_citations": true,
                "dimension": dimension
            },
            method: "POST",
            success: function (data) {
                var traitValues;
                if(data.trait_format === 'numerical'){
                    traitValues = condenseNumericalTraitValues(data.values)
                } else {
                    traitValues = condenseCategoricalTraitValues(data.values)
                }
                addTraitToProject(data.name, traitValues, data.citations, biom, dimension, dbversion, internalProjectId, () => window.location.reload())
            }
        });
}

function removeTraitFromProjectTableAction(traitName, dimension){
    removeTraitFromProject(traitName, biom, dimension, dbversion, internalProjectId, () => window.location.reload())
}

// Make action functions global for now in order to work with the onclick string
global.addTraitToProjectTableAction = addTraitToProjectTableAction;
global.removeTraitFromProjectTableAction = removeTraitFromProjectTableAction;