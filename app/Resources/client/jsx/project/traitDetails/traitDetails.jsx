$('document').ready(() => {
    $('#add-trait-to-project-button').on('click', function () {
        var trait_metadata = biom.getMetadata({dimension: 'rows', attribute: ['fennec', dbversion, 'fennec_id']}).map(
            function (value) {
                if(value in traitValues){
                    return traitValues[value];
                }
                return null;
            }
        );
        biom.addMetadata({dimension: 'rows', attribute: traitName, values: trait_metadata});
        let webserviceUrl = Routing.generate('api', {'namespace': 'edit', 'classname': 'updateProject'});
        $.ajax(webserviceUrl, {
            data: {
                "dbversion": dbversion,
                "project_id": internalProjectId,
                "biom": biom.toString()
            },
            method: "POST",
            success: () => showMessageDialog('Successfully added '+traitName+ ' to metadata.', 'success'),
            error: (error) => showMessageDialog(error, 'danger')
        });
    });
});