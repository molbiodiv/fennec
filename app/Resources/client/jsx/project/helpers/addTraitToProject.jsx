function addTraitToProject(traitName, traitValues, traitCitations, biom, dbVersion,internalProjectId, action) {
    console.log('bla')
    var trait_metadata = biom.getMetadata({dimension: 'rows', attribute: ['fennec', dbversion, 'fennec_id']}).map(
        function (value) {
            if (value in traitValues) {
                return traitValues[value];
            }
            return null;
        }
    );
    var trait_citations = biom.getMetadata({dimension: 'rows', attribute: ['fennec', dbversion, 'fennec_id']}).map(
        function (value) {
            if (value in traitCitations) {
                return traitCitations[value];
            }
            return [];
        }
    );
    biom.addMetadata({dimension: 'rows', attribute: traitName, values: trait_metadata});
    biom.addMetadata({dimension: 'rows', attribute: ['trait_citations', traitName], values: trait_citations});
    let webserviceUrl = Routing.generate('api', {'namespace': 'edit', 'classname': 'updateProject'});
    $.ajax(webserviceUrl, {
        data: {
            "dbversion": dbVersion,
            "project_id": internalProjectId,
            "biom": biom.toString()
        },
        method: "POST",
        success: action,
        error: (error) => showMessageDialog(error, 'danger')
    });
}