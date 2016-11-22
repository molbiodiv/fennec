/* global dbversion */
/* global biom */
/* global internalProjectId */
/* global blackbirdPreviewPath */
$('document').ready(function () {
    // Set header of page to project-id
    $('.page-header').text(biom.id);

    // Fill overview table with values
    $('#project-overview-table-id').text(biom.id);
    $('#project-overview-table-comment').text(biom.comment);
    $('#project-overview-table-rows').text(biom.shape[0]);
    $('#project-overview-table-cols').text(biom.shape[1]);
    $('#project-overview-table-nnz').text(biom.nnz + " (" + (100 * biom.nnz / (biom.shape[0] * biom.shape[1])).toFixed(2) + "%)");

    // Set action if edit dialog is shown
    $('#editProjectDialog').on('shown.bs.modal', function () {
        $('#editProjectDialogProjectID').val(biom.id);
        $('#editProjectDialogComment').val(biom.comment);
        $('#editProjectDialogProjectID').focus();
    });

    // Set action if edit dialog is saved
    $('#editProjectDialogSaveButton').click(function () {
        biom.id = $('#editProjectDialogProjectID').val();
        biom.comment = $('#editProjectDialogComment').val();
        saveBiomToDB();
    });

    $('#project-export-as-biom-v1').click(() => {
        exportProjectAsBiom(false);
    });

    $('#project-export-as-biom-v2').click(() => {
        exportProjectAsBiom(true);
    });

});

/**
 * Saves the current value of the global biom variable to the postgres database
 */
function saveBiomToDB() {
    biom.write().then(function (biomJson) {
        var webserviceUrl = Routing.generate('api', {'namespace': 'edit', 'classname': 'updateProject'});
        $.ajax(webserviceUrl, {
            data: {
                "dbversion": dbversion,
                "project_id": internalProjectId,
                "biom": biomJson
            },
            method: "POST",
            success: function () {
                location.reload();
            }
        });
    }, function (failure) {
        console.log(failure);
    });
}

/**
 * Opens a file download dialog of the current project in biom format
 * @param {boolean} asHdf5
 */
function exportProjectAsBiom(asHdf5) {
    let conversionServerURL = Routing.generate('biomcs_convert');
    let contentType = asHdf5 ? "application/octet-stream" : "text/plain";
    biom.write({conversionServer: conversionServerURL, asHdf5: asHdf5}).then(function (biomContent) {
        var blob = new Blob([biomContent], {type: contentType});
        saveAs(blob, biom.id+".biom");
    }, function (failure) {
        showMessageDialog(failure+"", 'danger');
    });
}
