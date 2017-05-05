'use strict';

function addTraitToProject(traitName, traitValues, traitCitations, biom, dimension, dbVersion, internalProjectId, action) {
    console.log(arguments);
    var trait_metadata = biom.getMetadata({ dimension: dimension, attribute: ['fennec', dbversion, 'fennec_id'] }).map(function (value) {
        if (value in traitValues) {
            return traitValues[value];
        }
        return null;
    });
    var trait_citations = biom.getMetadata({ dimension: dimension, attribute: ['fennec', dbversion, 'fennec_id'] }).map(function (value) {
        if (value in traitCitations) {
            return traitCitations[value];
        }
        return [];
    });
    biom.addMetadata({ dimension: dimension, attribute: traitName, values: trait_metadata });
    biom.addMetadata({ dimension: dimension, attribute: ['trait_citations', traitName], values: trait_citations });
    var webserviceUrl = Routing.generate('api', { 'namespace': 'edit', 'classname': 'updateProject' });
    $.ajax(webserviceUrl, {
        data: {
            "dbversion": dbVersion,
            "project_id": internalProjectId,
            "biom": biom.toString()
        },
        method: "POST",
        success: action,
        error: function error(_error) {
            return showMessageDialog(_error, 'danger');
        }
    });
}
'use strict';

function removeTraitFromProject(traitName, biom, dimension, dbVersion, internalProjectId, action) {
    var entries = dimension === 'columns' ? biom.columns : biom.rows;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = entries[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var entry = _step.value;

            if (entry.metadata != null) {
                delete entry.metadata[traitName];
                if (entry.metadata.trait_citations != null) {
                    delete entry.metadata.trait_citations[traitName];
                }
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    var webserviceUrl = Routing.generate('api', { 'namespace': 'edit', 'classname': 'updateProject' });
    $.ajax(webserviceUrl, {
        data: {
            "dbversion": dbVersion,
            "project_id": internalProjectId,
            "biom": biom.toString()
        },
        method: "POST",
        success: action,
        error: function error(_error) {
            return showMessageDialog(_error, 'danger');
        }
    });
}