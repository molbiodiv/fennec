function removeTraitFromProject(traitName, biom, dbVersion,internalProjectId, action) {
    for(let row of biom.rows){
        if(row.metadata != null){
            delete row.metadata[traitName]
            if(row.metadata.trait_citations != null){
                delete row.metadata.trait_citations[traitName]
            }
        }
    }
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