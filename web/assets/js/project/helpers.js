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
    let webserviceUrl = Routing.generate('api', { 'namespace': 'edit', 'classname': 'updateProject' });
    $.ajax(webserviceUrl, {
        data: {
            "dbversion": dbVersion,
            "project_id": internalProjectId,
            "biom": biom.toString()
        },
        method: "POST",
        success: action,
        error: error => showMessageDialog(error, 'danger')
    });
}

module.exports = addTraitToProject;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ "./app/Resources/client/jsx/project/helpers/removeTraitFromProject.jsx":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {function removeTraitFromProject(traitName, biom, dimension, dbVersion, internalProjectId, action) {
    let entries = dimension === 'columns' ? biom.columns : biom.rows;
    for (let entry of entries) {
        if (entry.metadata != null) {
            delete entry.metadata[traitName];
            if (entry.metadata.trait_citations != null) {
                delete entry.metadata.trait_citations[traitName];
            }
        }
    }
    let webserviceUrl = Routing.generate('api', { 'namespace': 'edit', 'classname': 'updateProject' });
    $.ajax(webserviceUrl, {
        data: {
            "dbversion": dbVersion,
            "project_id": internalProjectId,
            "biom": biom.toString()
        },
        method: "POST",
        success: action,
        error: error => showMessageDialog(error, 'danger')
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvcHJvamVjdC9oZWxwZXJzLmpzeCIsIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvcHJvamVjdC9oZWxwZXJzL2FkZFRyYWl0VG9Qcm9qZWN0LmpzeCIsIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvcHJvamVjdC9oZWxwZXJzL3JlbW92ZVRyYWl0RnJvbVByb2plY3QuanN4Il0sIm5hbWVzIjpbInJlcXVpcmUiLCJhZGRUcmFpdFRvUHJvamVjdCIsInRyYWl0TmFtZSIsInRyYWl0VmFsdWVzIiwidHJhaXRDaXRhdGlvbnMiLCJiaW9tIiwiZGltZW5zaW9uIiwiZGJWZXJzaW9uIiwiaW50ZXJuYWxQcm9qZWN0SWQiLCJhY3Rpb24iLCJjb25zb2xlIiwibG9nIiwiYXJndW1lbnRzIiwidHJhaXRfbWV0YWRhdGEiLCJnZXRNZXRhZGF0YSIsImF0dHJpYnV0ZSIsImRidmVyc2lvbiIsIm1hcCIsInZhbHVlIiwidHJhaXRfY2l0YXRpb25zIiwiYWRkTWV0YWRhdGEiLCJ2YWx1ZXMiLCJ3ZWJzZXJ2aWNlVXJsIiwiUm91dGluZyIsImdlbmVyYXRlIiwiJCIsImFqYXgiLCJkYXRhIiwidG9TdHJpbmciLCJtZXRob2QiLCJzdWNjZXNzIiwiZXJyb3IiLCJzaG93TWVzc2FnZURpYWxvZyIsIm1vZHVsZSIsImV4cG9ydHMiLCJyZW1vdmVUcmFpdEZyb21Qcm9qZWN0IiwiZW50cmllcyIsImNvbHVtbnMiLCJyb3dzIiwiZW50cnkiLCJtZXRhZGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxtQkFBQUEsQ0FBUSxrRUFBUjtBQUNBLG1CQUFBQSxDQUFRLHVFQUFSLEU7Ozs7Ozs7QUNEQSxrREFBU0MsaUJBQVQsQ0FBMkJDLFNBQTNCLEVBQXNDQyxXQUF0QyxFQUFtREMsY0FBbkQsRUFBbUVDLElBQW5FLEVBQXlFQyxTQUF6RSxFQUFvRkMsU0FBcEYsRUFB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eUIsUUFBekI7QUFSQSxLQUF0QjtBQVVIOztBQUVERSxPQUFPQyxPQUFQLEdBQWlCQyxzQkFBakIsQyIsImZpbGUiOiJwcm9qZWN0L2hlbHBlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCcuL2hlbHBlcnMvYWRkVHJhaXRUb1Byb2plY3QuanN4JylcbnJlcXVpcmUoJy4vaGVscGVycy9yZW1vdmVUcmFpdEZyb21Qcm9qZWN0LmpzeCcpXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L3Byb2plY3QvaGVscGVycy5qc3giLCJmdW5jdGlvbiBhZGRUcmFpdFRvUHJvamVjdCh0cmFpdE5hbWUsIHRyYWl0VmFsdWVzLCB0cmFpdENpdGF0aW9ucywgYmlvbSwgZGltZW5zaW9uLCBkYlZlcnNpb24saW50ZXJuYWxQcm9qZWN0SWQsIGFjdGlvbikge1xuICAgIGNvbnNvbGUubG9nKGFyZ3VtZW50cylcbiAgICB2YXIgdHJhaXRfbWV0YWRhdGEgPSBiaW9tLmdldE1ldGFkYXRhKHtkaW1lbnNpb246IGRpbWVuc2lvbiwgYXR0cmlidXRlOiBbJ2Zlbm5lYycsIGRidmVyc2lvbiwgJ2Zlbm5lY19pZCddfSkubWFwKFxuICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSBpbiB0cmFpdFZhbHVlcykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cmFpdFZhbHVlc1t2YWx1ZV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICk7XG4gICAgdmFyIHRyYWl0X2NpdGF0aW9ucyA9IGJpb20uZ2V0TWV0YWRhdGEoe2RpbWVuc2lvbjogZGltZW5zaW9uLCBhdHRyaWJ1dGU6IFsnZmVubmVjJywgZGJ2ZXJzaW9uLCAnZmVubmVjX2lkJ119KS5tYXAoXG4gICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlIGluIHRyYWl0Q2l0YXRpb25zKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRyYWl0Q2l0YXRpb25zW3ZhbHVlXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICk7XG4gICAgYmlvbS5hZGRNZXRhZGF0YSh7ZGltZW5zaW9uOiBkaW1lbnNpb24sIGF0dHJpYnV0ZTogdHJhaXROYW1lLCB2YWx1ZXM6IHRyYWl0X21ldGFkYXRhfSk7XG4gICAgYmlvbS5hZGRNZXRhZGF0YSh7ZGltZW5zaW9uOiBkaW1lbnNpb24sIGF0dHJpYnV0ZTogWyd0cmFpdF9jaXRhdGlvbnMnLCB0cmFpdE5hbWVdLCB2YWx1ZXM6IHRyYWl0X2NpdGF0aW9uc30pO1xuICAgIGxldCB3ZWJzZXJ2aWNlVXJsID0gUm91dGluZy5nZW5lcmF0ZSgnYXBpJywgeyduYW1lc3BhY2UnOiAnZWRpdCcsICdjbGFzc25hbWUnOiAndXBkYXRlUHJvamVjdCd9KTtcbiAgICAkLmFqYXgod2Vic2VydmljZVVybCwge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBcImRidmVyc2lvblwiOiBkYlZlcnNpb24sXG4gICAgICAgICAgICBcInByb2plY3RfaWRcIjogaW50ZXJuYWxQcm9qZWN0SWQsXG4gICAgICAgICAgICBcImJpb21cIjogYmlvbS50b1N0cmluZygpXG4gICAgICAgIH0sXG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIHN1Y2Nlc3M6IGFjdGlvbixcbiAgICAgICAgZXJyb3I6IChlcnJvcikgPT4gc2hvd01lc3NhZ2VEaWFsb2coZXJyb3IsICdkYW5nZXInKVxuICAgIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFkZFRyYWl0VG9Qcm9qZWN0O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9SZXNvdXJjZXMvY2xpZW50L2pzeC9wcm9qZWN0L2hlbHBlcnMvYWRkVHJhaXRUb1Byb2plY3QuanN4IiwiZnVuY3Rpb24gcmVtb3ZlVHJhaXRGcm9tUHJvamVjdCh0cmFpdE5hbWUsIGJpb20sIGRpbWVuc2lvbiwgZGJWZXJzaW9uLGludGVybmFsUHJvamVjdElkLCBhY3Rpb24pIHtcbiAgICBsZXQgZW50cmllcyA9IGRpbWVuc2lvbiA9PT0gJ2NvbHVtbnMnID8gYmlvbS5jb2x1bW5zIDogYmlvbS5yb3dzXG4gICAgZm9yKGxldCBlbnRyeSBvZiBlbnRyaWVzKXtcbiAgICAgICAgaWYoZW50cnkubWV0YWRhdGEgIT0gbnVsbCl7XG4gICAgICAgICAgICBkZWxldGUgZW50cnkubWV0YWRhdGFbdHJhaXROYW1lXVxuICAgICAgICAgICAgaWYoZW50cnkubWV0YWRhdGEudHJhaXRfY2l0YXRpb25zICE9IG51bGwpe1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBlbnRyeS5tZXRhZGF0YS50cmFpdF9jaXRhdGlvbnNbdHJhaXROYW1lXVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGxldCB3ZWJzZXJ2aWNlVXJsID0gUm91dGluZy5nZW5lcmF0ZSgnYXBpJywgeyduYW1lc3BhY2UnOiAnZWRpdCcsICdjbGFzc25hbWUnOiAndXBkYXRlUHJvamVjdCd9KTtcbiAgICAkLmFqYXgod2Vic2VydmljZVVybCwge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBcImRidmVyc2lvblwiOiBkYlZlcnNpb24sXG4gICAgICAgICAgICBcInByb2plY3RfaWRcIjogaW50ZXJuYWxQcm9qZWN0SWQsXG4gICAgICAgICAgICBcImJpb21cIjogYmlvbS50b1N0cmluZygpXG4gICAgICAgIH0sXG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIHN1Y2Nlc3M6IGFjdGlvbixcbiAgICAgICAgZXJyb3I6IChlcnJvcikgPT4gc2hvd01lc3NhZ2VEaWFsb2coZXJyb3IsICdkYW5nZXInKVxuICAgIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlbW92ZVRyYWl0RnJvbVByb2plY3Q7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L3Byb2plY3QvaGVscGVycy9yZW1vdmVUcmFpdEZyb21Qcm9qZWN0LmpzeCJdLCJzb3VyY2VSb290IjoiIn0=