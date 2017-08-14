function addTraitToProject(traitName, traitValues, traitCitations, biom, dimension, dbVersion,internalProjectId, action) {
    console.log(arguments)
    var trait_metadata = biom.getMetadata({dimension: dimension, attribute: ['fennec', dbversion, 'fennec_id']}).map(
        function (value) {
            if (value in traitValues) {
                return traitValues[value];
            }
            return null;
        }
    );
    var trait_citations = biom.getMetadata({dimension: dimension, attribute: ['fennec', dbversion, 'fennec_id']}).map(
        function (value) {
            if (value in traitCitations) {
                return traitCitations[value];
            }
            return [];
        }
    );
    biom.addMetadata({dimension: dimension, attribute: traitName, values: trait_metadata});
    biom.addMetadata({dimension: dimension, attribute: ['trait_citations', traitName], values: trait_citations});
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

module.exports = addTraitToProject;