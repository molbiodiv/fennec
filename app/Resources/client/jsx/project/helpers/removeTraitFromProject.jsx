function removeTraitFromProject(traitName, biom, dimension, dbVersion,internalProjectId, action) {
    let entries = dimension === 'columns' ? biom.columns : biom.rows
    for(let entry of entries){
        if(entry.metadata != null){
            delete entry.metadata[traitName]
            if(entry.metadata.trait_citations != null){
                delete entry.metadata.trait_citations[traitName]
            }
        }
    }
    let webserviceUrl = Routing.generate('api_edit_update_project', {'dbversion': dbversion});
    $.ajax(webserviceUrl, {
        data: {
            "project_id": internalProjectId,
            "biom": biom.toString()
        },
        method: "POST",
        success: action,
        error: (error) => showMessageDialog(error, 'danger')
    });
}

module.exports = removeTraitFromProject;