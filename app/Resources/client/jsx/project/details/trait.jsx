/* global internalProjectId */
/* global dbversion */

$('document').ready(() => {
    var traits = [];
    var webserviceUrl = Routing.generate('api', {'namespace': 'details', 'classname': 'traitsOfOrganisms'});

    // Extract row organism_ids from biom
    var organism_ids = biom.getMetadata({dimension: 'rows', attribute: ['fennec', dbversion, 'organism_id']})
        .filter( element => element !== null );

    // Get traits for rows
    $.ajax(webserviceUrl, {
        data: {
            "dbversion": dbversion,
            "organism_ids": organism_ids
        },
        method: "POST",
        success: function (data) {
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
            columns: [
                {data: 'trait'},
                {data: 'count'},
                {data: 'range'},
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
                        return '<a href="' + href + '">Details</a>';
                    }
                }
            ]
        });
    }
});