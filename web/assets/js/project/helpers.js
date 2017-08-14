webpackJsonp([4],{

/***/ "./app/Resources/client/jsx/project/helpers.jsx":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("./app/Resources/client/jsx/project/helpers/addTraitToProject.jsx");
__webpack_require__("./app/Resources/client/jsx/project/helpers/removeTraitFromProject.jsx");

/***/ }),

/***/ "./app/Resources/client/jsx/project/helpers/addTraitToProject.jsx":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {function addTraitToProject(traitName, traitValues, traitCitations, biom, dimension, dbVersion, internalProjectId, action) {
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

module.exports = addTraitToProject;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ "./app/Resources/client/jsx/project/helpers/removeTraitFromProject.jsx":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {function removeTraitFromProject(traitName, biom, dimension, dbVersion, internalProjectId, action) {
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

module.exports = removeTraitFromProject;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./app/Resources/client/jsx/project/helpers.jsx");


/***/ })

},[1]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvcHJvamVjdC9oZWxwZXJzLmpzeCIsIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvcHJvamVjdC9oZWxwZXJzL2FkZFRyYWl0VG9Qcm9qZWN0LmpzeCIsIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvcHJvamVjdC9oZWxwZXJzL3JlbW92ZVRyYWl0RnJvbVByb2plY3QuanN4Il0sIm5hbWVzIjpbInJlcXVpcmUiLCJhZGRUcmFpdFRvUHJvamVjdCIsInRyYWl0TmFtZSIsInRyYWl0VmFsdWVzIiwidHJhaXRDaXRhdGlvbnMiLCJiaW9tIiwiZGltZW5zaW9uIiwiZGJWZXJzaW9uIiwiaW50ZXJuYWxQcm9qZWN0SWQiLCJhY3Rpb24iLCJjb25zb2xlIiwibG9nIiwiYXJndW1lbnRzIiwidHJhaXRfbWV0YWRhdGEiLCJnZXRNZXRhZGF0YSIsImF0dHJpYnV0ZSIsImRidmVyc2lvbiIsIm1hcCIsInZhbHVlIiwidHJhaXRfY2l0YXRpb25zIiwiYWRkTWV0YWRhdGEiLCJ2YWx1ZXMiLCJ3ZWJzZXJ2aWNlVXJsIiwiUm91dGluZyIsImdlbmVyYXRlIiwiJCIsImFqYXgiLCJkYXRhIiwidG9TdHJpbmciLCJtZXRob2QiLCJzdWNjZXNzIiwiZXJyb3IiLCJzaG93TWVzc2FnZURpYWxvZyIsIm1vZHVsZSIsImV4cG9ydHMiLCJyZW1vdmVUcmFpdEZyb21Qcm9qZWN0IiwiZW50cmllcyIsImNvbHVtbnMiLCJyb3dzIiwiZW50cnkiLCJtZXRhZGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxtQkFBQUEsQ0FBUSxrRUFBUjtBQUNBLG1CQUFBQSxDQUFRLHVFQUFSLEU7Ozs7Ozs7QUNEQSxrREFBU0MsaUJBQVQsQ0FBMkJDLFNBQTNCLEVBQXNDQyxXQUF0QyxFQUFtREMsY0FBbkQsRUFBbUVDLElBQW5FLEVBQXlFQyxTQUF6RSxFQUFvRkMsU0FBcEYsRUFB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QWNDLGlCQUZaO0FBR0Ysb0JBQVFILEtBQUt1QixRQUFMO0FBSE4sU0FEWTtBQU1sQkMsZ0JBQVEsTUFOVTtBQU9sQkMsaUJBQVNyQixNQVBTO0FBUWxCc0IsZUFBTyxlQUFDQSxNQUFEO0FBQUEsbUJBQVdDLGtCQUFrQkQsTUFBbEIsRUFBeUIsUUFBekIsQ0FBWDtBQUFBO0FBUlcsS0FBdEI7QUFVSDs7QUFFREUsT0FBT0MsT0FBUCxHQUFpQkMsc0JBQWpCLEMiLCJmaWxlIjoicHJvamVjdC9oZWxwZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnLi9oZWxwZXJzL2FkZFRyYWl0VG9Qcm9qZWN0LmpzeCcpXG5yZXF1aXJlKCcuL2hlbHBlcnMvcmVtb3ZlVHJhaXRGcm9tUHJvamVjdC5qc3gnKVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9SZXNvdXJjZXMvY2xpZW50L2pzeC9wcm9qZWN0L2hlbHBlcnMuanN4IiwiZnVuY3Rpb24gYWRkVHJhaXRUb1Byb2plY3QodHJhaXROYW1lLCB0cmFpdFZhbHVlcywgdHJhaXRDaXRhdGlvbnMsIGJpb20sIGRpbWVuc2lvbiwgZGJWZXJzaW9uLGludGVybmFsUHJvamVjdElkLCBhY3Rpb24pIHtcbiAgICBjb25zb2xlLmxvZyhhcmd1bWVudHMpXG4gICAgdmFyIHRyYWl0X21ldGFkYXRhID0gYmlvbS5nZXRNZXRhZGF0YSh7ZGltZW5zaW9uOiBkaW1lbnNpb24sIGF0dHJpYnV0ZTogWydmZW5uZWMnLCBkYnZlcnNpb24sICdmZW5uZWNfaWQnXX0pLm1hcChcbiAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgaW4gdHJhaXRWYWx1ZXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJhaXRWYWx1ZXNbdmFsdWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICApO1xuICAgIHZhciB0cmFpdF9jaXRhdGlvbnMgPSBiaW9tLmdldE1ldGFkYXRhKHtkaW1lbnNpb246IGRpbWVuc2lvbiwgYXR0cmlidXRlOiBbJ2Zlbm5lYycsIGRidmVyc2lvbiwgJ2Zlbm5lY19pZCddfSkubWFwKFxuICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSBpbiB0cmFpdENpdGF0aW9ucykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cmFpdENpdGF0aW9uc1t2YWx1ZV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICApO1xuICAgIGJpb20uYWRkTWV0YWRhdGEoe2RpbWVuc2lvbjogZGltZW5zaW9uLCBhdHRyaWJ1dGU6IHRyYWl0TmFtZSwgdmFsdWVzOiB0cmFpdF9tZXRhZGF0YX0pO1xuICAgIGJpb20uYWRkTWV0YWRhdGEoe2RpbWVuc2lvbjogZGltZW5zaW9uLCBhdHRyaWJ1dGU6IFsndHJhaXRfY2l0YXRpb25zJywgdHJhaXROYW1lXSwgdmFsdWVzOiB0cmFpdF9jaXRhdGlvbnN9KTtcbiAgICBsZXQgd2Vic2VydmljZVVybCA9IFJvdXRpbmcuZ2VuZXJhdGUoJ2FwaScsIHsnbmFtZXNwYWNlJzogJ2VkaXQnLCAnY2xhc3NuYW1lJzogJ3VwZGF0ZVByb2plY3QnfSk7XG4gICAgJC5hamF4KHdlYnNlcnZpY2VVcmwsIHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgXCJkYnZlcnNpb25cIjogZGJWZXJzaW9uLFxuICAgICAgICAgICAgXCJwcm9qZWN0X2lkXCI6IGludGVybmFsUHJvamVjdElkLFxuICAgICAgICAgICAgXCJiaW9tXCI6IGJpb20udG9TdHJpbmcoKVxuICAgICAgICB9LFxuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICBzdWNjZXNzOiBhY3Rpb24sXG4gICAgICAgIGVycm9yOiAoZXJyb3IpID0+IHNob3dNZXNzYWdlRGlhbG9nKGVycm9yLCAnZGFuZ2VyJylcbiAgICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhZGRUcmFpdFRvUHJvamVjdDtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvcHJvamVjdC9oZWxwZXJzL2FkZFRyYWl0VG9Qcm9qZWN0LmpzeCIsImZ1bmN0aW9uIHJlbW92ZVRyYWl0RnJvbVByb2plY3QodHJhaXROYW1lLCBiaW9tLCBkaW1lbnNpb24sIGRiVmVyc2lvbixpbnRlcm5hbFByb2plY3RJZCwgYWN0aW9uKSB7XG4gICAgbGV0IGVudHJpZXMgPSBkaW1lbnNpb24gPT09ICdjb2x1bW5zJyA/IGJpb20uY29sdW1ucyA6IGJpb20ucm93c1xuICAgIGZvcihsZXQgZW50cnkgb2YgZW50cmllcyl7XG4gICAgICAgIGlmKGVudHJ5Lm1ldGFkYXRhICE9IG51bGwpe1xuICAgICAgICAgICAgZGVsZXRlIGVudHJ5Lm1ldGFkYXRhW3RyYWl0TmFtZV1cbiAgICAgICAgICAgIGlmKGVudHJ5Lm1ldGFkYXRhLnRyYWl0X2NpdGF0aW9ucyAhPSBudWxsKXtcbiAgICAgICAgICAgICAgICBkZWxldGUgZW50cnkubWV0YWRhdGEudHJhaXRfY2l0YXRpb25zW3RyYWl0TmFtZV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBsZXQgd2Vic2VydmljZVVybCA9IFJvdXRpbmcuZ2VuZXJhdGUoJ2FwaScsIHsnbmFtZXNwYWNlJzogJ2VkaXQnLCAnY2xhc3NuYW1lJzogJ3VwZGF0ZVByb2plY3QnfSk7XG4gICAgJC5hamF4KHdlYnNlcnZpY2VVcmwsIHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgXCJkYnZlcnNpb25cIjogZGJWZXJzaW9uLFxuICAgICAgICAgICAgXCJwcm9qZWN0X2lkXCI6IGludGVybmFsUHJvamVjdElkLFxuICAgICAgICAgICAgXCJiaW9tXCI6IGJpb20udG9TdHJpbmcoKVxuICAgICAgICB9LFxuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICBzdWNjZXNzOiBhY3Rpb24sXG4gICAgICAgIGVycm9yOiAoZXJyb3IpID0+IHNob3dNZXNzYWdlRGlhbG9nKGVycm9yLCAnZGFuZ2VyJylcbiAgICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZW1vdmVUcmFpdEZyb21Qcm9qZWN0O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9SZXNvdXJjZXMvY2xpZW50L2pzeC9wcm9qZWN0L2hlbHBlcnMvcmVtb3ZlVHJhaXRGcm9tUHJvamVjdC5qc3giXSwic291cmNlUm9vdCI6IiJ9