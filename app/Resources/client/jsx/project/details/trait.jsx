/* global internalProjectId */
/* global dbversion */

$('document').ready(() => {
    var traits = [];
    var webserviceUrl = Routing.generate('api', {'namespace': 'details', 'classname': 'traitsOfOrganisms'});
    var metadataKeys = getMetadataKeys(biom, 'rows')

    // Extract row fennec_ids from biom
    var fennec_ids = biom.getMetadata({dimension: 'rows', attribute: ['fennec', dbversion, 'fennec_id']})
        .filter( element => element !== null );

    // Get traits for rows
    $.ajax(webserviceUrl, {
        data: {
            "dbversion": dbversion,
            "fennec_ids": fennec_ids
        },
        method: "POST",
        success: function (data) {
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
                            'project_id': internalProjectId
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
                        return _.indexOf(metadataKeys, full.trait) != -1 ? '<a onclick="removeTraitFromProjectTableAction('+full.trait+')"><i class="fa fa-trash"></i></a>' : '<a onclick="addTraitToProjectTableAction('+full.id+')"><i class="fa fa-plus"></i></a>';
                    }
                }
            ]
        });
    }
});

function addTraitToProjectTableAction(traitTypeId){
    $.ajax({
            url: Routing.generate('api', {'namespace': 'details', 'classname': 'TraitOfProject'}),
            data: {
                "dbversion": dbversion,
                "internal_project_id": internalProjectId,
                "trait_type_id": traitTypeId,
                "include_citations": true
            },
            method: "POST",
            success: function (data) {
                var traitValues;
                if(data.trait_format === 'numerical'){
                    traitValues = condenseNumericalTraitValues(data.values)
                } else {
                    traitValues = condenseCategoricalTraitValues(data.values)
                }
                addTraitToProject(data.name, traitValues, data.citations, biom, dbversion, internalProjectId, () => window.location.reload())
            }
        });
}

function removeTraitFromProjectTableAction(traitName){
    removeTraitFromProject(traitName, biom, dbversion, internalProjectId, () => window.location.reload())
}