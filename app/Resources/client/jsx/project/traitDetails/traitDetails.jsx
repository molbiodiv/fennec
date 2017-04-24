/*
 * global traitValues
 * global traitCitations
 */
$('document').ready(() => {
    $('#add-trait-to-project-button').on('click', function () {
        addTraitToProject(traitName, traitValues, traitCitations, biom, dbversion, internalProjectId, () => showMessageDialog('Successfully added ' + traitName + ' to metadata.', 'success'));
    });

    let projectUrl = Routing.generate('project_details', {'dbversion': dbversion, 'project_id': internalProjectId})+"#traits"
    $('#page-title').html(
        `<a href="${projectUrl}"><i class="fa fa-arrow-circle-left" style="padding-right: 10px"></i></a>`+$('#page-title').html()
    )
});