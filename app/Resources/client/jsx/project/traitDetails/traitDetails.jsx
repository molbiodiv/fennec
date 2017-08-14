const biomPromise = require('../details/biom');
const _ = require('lodash');
const $ = require('jquery');
const addTraitToProject = require('../helpers/addTraitToProject');

$('document').ready(async () => {
    let biom = await biomPromise;
    let projectData = $('#project-data');
    let internalProjectId = projectData.data('internal-project-id');
    let traitFormat = projectData.data('trait-format');
    let traitValues = projectData.data('trait-values');
    let traitName = projectData.data('trait-name');
    let traitCitations = projectData.data('trait-citations');
    let dimension = projectData.data('dimension');
    let dbversion = $('#globals').data('dbversion');

    $('#add-trait-to-project-button').on('click', function () {
        addTraitToProject(traitName, traitValues, traitCitations, biom, dimension, dbversion, internalProjectId, () => showMessageDialog('Successfully added ' + traitName + ' to metadata.', 'success'));
    });

    let projectUrl = Routing.generate('project_details', {'dbversion': dbversion, 'project_id': internalProjectId})+"#traits";
    let pageTitle = $('#page-title');
    pageTitle.html(
        `<a href="${projectUrl}"><i class="fa fa-arrow-circle-left" style="padding-right: 10px"></i></a>`+pageTitle.html()
    );

    if(traitFormat === 'categorical_free'){
        traitValues = condenseCategoricalTraitValues(traitValues);
        let counts = _.countBy(traitValues);
        counts['NA'] = biom.shape[0] - _.sum(Object.values(counts));
        drawPieChart(counts);
    } else if(traitFormat === 'numerical'){
        traitValues = condenseNumericalTraitValues(traitValues);
        drawHistogram(Object.values(traitValues));
    }
});