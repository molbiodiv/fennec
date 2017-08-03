webpackJsonp([3],{

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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./app/Resources/client/jsx/project/helpers.jsx");


/***/ })

},[1]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvcHJvamVjdC9oZWxwZXJzLmpzeCIsIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvcHJvamVjdC9oZWxwZXJzL2FkZFRyYWl0VG9Qcm9qZWN0LmpzeCIsIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvcHJvamVjdC9oZWxwZXJzL3JlbW92ZVRyYWl0RnJvbVByb2plY3QuanN4Il0sIm5hbWVzIjpbInJlcXVpcmUiLCJhZGRUcmFpdFRvUHJvamVjdCIsInRyYWl0TmFtZSIsInRyYWl0VmFsdWVzIiwidHJhaXRDaXRhdGlvbnMiLCJiaW9tIiwiZGltZW5zaW9uIiwiZGJWZXJzaW9uIiwiaW50ZXJuYWxQcm9qZWN0SWQiLCJhY3Rpb24iLCJjb25zb2xlIiwibG9nIiwiYXJndW1lbnRzIiwidHJhaXRfbWV0YWRhdGEiLCJnZXRNZXRhZGF0YSIsImF0dHJpYnV0ZSIsImRidmVyc2lvbiIsIm1hcCIsInZhbHVlIiwidHJhaXRfY2l0YXRpb25zIiwiYWRkTWV0YWRhdGEiLCJ2YWx1ZXMiLCJ3ZWJzZXJ2aWNlVXJsIiwiUm91dGluZyIsImdlbmVyYXRlIiwiJCIsImFqYXgiLCJkYXRhIiwidG9TdHJpbmciLCJtZXRob2QiLCJzdWNjZXNzIiwiZXJyb3IiLCJzaG93TWVzc2FnZURpYWxvZyIsInJlbW92ZVRyYWl0RnJvbVByb2plY3QiLCJlbnRyaWVzIiwiY29sdW1ucyIsInJvd3MiLCJlbnRyeSIsIm1ldGFkYXRhIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG1CQUFBQSxDQUFRLGtFQUFSO0FBQ0EsbUJBQUFBLENBQVEsdUVBQVIsRTs7Ozs7OztBQ0RBLGtEQUFTQyxpQkFBVCxDQUEyQkMsU0FBM0IsRUFBc0NDLFdBQXRDLEVBQW1EQyxjQUFuRCxFQUFtRUMsSUFBbkUsRUFBeUVDLFNBQXpFLEVBQW9GQyxTQUFwRixFQUE4RkMsaUJBQTlGLEVBQWlIQyxNQUFqSCxFQUF5SDtBQUNySEMsWUFBUUMsR0FBUixDQUFZQyxTQUFaO0FBQ0EsUUFBSUMsaUJBQWlCUixLQUFLUyxXQUFMLENBQWlCLEVBQUNSLFdBQVdBLFNBQVosRUFBdUJTLFdBQVcsQ0FBQyxRQUFELEVBQVdDLFNBQVgsRUFBc0IsV0FBdEIsQ0FBbEMsRUFBakIsRUFBd0ZDLEdBQXhGLENBQ2pCLFVBQVVDLEtBQVYsRUFBaUI7QUFDYixZQUFJQSxTQUFTZixXQUFiLEVBQTBCO0FBQ3RCLG1CQUFPQSxZQUFZZSxLQUFaLENBQVA7QUFDSDtBQUNELGVBQU8sSUFBUDtBQUNILEtBTmdCLENBQXJCO0FBUUEsUUFBSUMsa0JBQWtCZCxLQUFLUyxXQUFMLENBQWlCLEVBQUNSLFdBQVdBLFNBQVosRUFBdUJTLFdBQVcsQ0FBQyxRQUFELEVBQVdDLFNBQVgsRUFBc0IsV0FBdEIsQ0FBbEMsRUFBakIsRUFBd0ZDLEdBQXhGLENBQ2xCLFVBQVVDLEtBQVYsRUFBaUI7QUFDYixZQUFJQSxTQUFTZCxjQUFiLEVBQTZCO0FBQ3pCLG1CQUFPQSxlQUFlYyxLQUFmLENBQVA7QUFDSDtBQUNELGVBQU8sRUFBUDtBQUNILEtBTmlCLENBQXRCO0FBUUFiLFNBQUtlLFdBQUwsQ0FBaUIsRUFBQ2QsV0FBV0EsU0FBWixFQUF1QlMsV0FBV2IsU0FBbEMsRUFBNkNtQixRQUFRUixjQUFyRCxFQUFqQjtBQUNBUixTQUFLZSxXQUFMLENBQWlCLEVBQUNkLFdBQVdBLFNBQVosRUFBdUJTLFdBQVcsQ0FBQyxpQkFBRCxFQUFvQmIsU0FBcEIsQ0FBbEMsRUFBa0VtQixRQUFRRixlQUExRSxFQUFqQjtBQUNBLFFBQUlHLGdCQUFnQkMsUUFBUUMsUUFBUixDQUFpQixLQUFqQixFQUF3QixFQUFDLGFBQWEsTUFBZCxFQUFzQixhQUFhLGVBQW5DLEVBQXhCLENBQXBCO0FBQ0FDLE1BQUVDLElBQUYsQ0FBT0osYUFBUCxFQUFzQjtBQUNsQkssY0FBTTtBQUNGLHlCQUFhcEIsU0FEWDtBQUVGLDBCQUFjQyxpQkFGWjtBQUdGLG9CQUFRSCxLQUFLdUIsUUFBTDtBQUhOLFNBRFk7QUFNbEJDLGdCQUFRLE1BTlU7QUFPbEJDLGlCQUFTckIsTUFQUztBQVFsQnNCLGVBQVFBLEtBQUQsSUFBV0Msa0JBQWtCRCxLQUFsQixFQUF5QixRQUF6QjtBQVJBLEtBQXRCO0FBVUgsQzs7Ozs7Ozs7QUMvQkQsa0RBQVNFLHNCQUFULENBQWdDL0IsU0FBaEMsRUFBMkNHLElBQTNDLEVBQWlEQyxTQUFqRCxFQUE0REMsU0FBNUQsRUFBc0VDLGlCQUF0RSxFQUF5RkMsTUFBekYsRUFBaUc7QUFDN0YsUUFBSXlCLFVBQVU1QixjQUFjLFNBQWQsR0FBMEJELEtBQUs4QixPQUEvQixHQUF5QzlCLEtBQUsrQixJQUE1RDtBQUNBLFNBQUksSUFBSUMsS0FBUixJQUFpQkgsT0FBakIsRUFBeUI7QUFDckIsWUFBR0csTUFBTUMsUUFBTixJQUFrQixJQUFyQixFQUEwQjtBQUN0QixtQkFBT0QsTUFBTUMsUUFBTixDQUFlcEMsU0FBZixDQUFQO0FBQ0EsZ0JBQUdtQyxNQUFNQyxRQUFOLENBQWVuQixlQUFmLElBQWtDLElBQXJDLEVBQTBDO0FBQ3RDLHVCQUFPa0IsTUFBTUMsUUFBTixDQUFlbkIsZUFBZixDQUErQmpCLFNBQS9CLENBQVA7QUFDSDtBQUNKO0FBQ0o7QUFDRCxRQUFJb0IsZ0JBQWdCQyxRQUFRQyxRQUFSLENBQWlCLEtBQWpCLEVBQXdCLEVBQUMsYUFBYSxNQUFkLEVBQXNCLGFBQWEsZUFBbkMsRUFBeEIsQ0FBcEI7QUFDQUMsTUFBRUMsSUFBRixDQUFPSixhQUFQLEVBQXNCO0FBQ2xCSyxjQUFNO0FBQ0YseUJBQWFwQixTQURYO0FBRUYsMEJBQWNDLGlCQUZaO0FBR0Ysb0JBQVFILEtBQUt1QixRQUFMO0FBSE4sU0FEWTtBQU1sQkMsZ0JBQVEsTUFOVTtBQU9sQkMsaUJBQVNyQixNQVBTO0FBUWxCc0IsZUFBUUEsS0FBRCxJQUFXQyxrQkFBa0JELEtBQWxCLEVBQXlCLFFBQXpCO0FBUkEsS0FBdEI7QUFVSCxDIiwiZmlsZSI6InByb2plY3QvaGVscGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJy4vaGVscGVycy9hZGRUcmFpdFRvUHJvamVjdC5qc3gnKVxucmVxdWlyZSgnLi9oZWxwZXJzL3JlbW92ZVRyYWl0RnJvbVByb2plY3QuanN4JylcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvcHJvamVjdC9oZWxwZXJzLmpzeCIsImZ1bmN0aW9uIGFkZFRyYWl0VG9Qcm9qZWN0KHRyYWl0TmFtZSwgdHJhaXRWYWx1ZXMsIHRyYWl0Q2l0YXRpb25zLCBiaW9tLCBkaW1lbnNpb24sIGRiVmVyc2lvbixpbnRlcm5hbFByb2plY3RJZCwgYWN0aW9uKSB7XG4gICAgY29uc29sZS5sb2coYXJndW1lbnRzKVxuICAgIHZhciB0cmFpdF9tZXRhZGF0YSA9IGJpb20uZ2V0TWV0YWRhdGEoe2RpbWVuc2lvbjogZGltZW5zaW9uLCBhdHRyaWJ1dGU6IFsnZmVubmVjJywgZGJ2ZXJzaW9uLCAnZmVubmVjX2lkJ119KS5tYXAoXG4gICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlIGluIHRyYWl0VmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRyYWl0VmFsdWVzW3ZhbHVlXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgKTtcbiAgICB2YXIgdHJhaXRfY2l0YXRpb25zID0gYmlvbS5nZXRNZXRhZGF0YSh7ZGltZW5zaW9uOiBkaW1lbnNpb24sIGF0dHJpYnV0ZTogWydmZW5uZWMnLCBkYnZlcnNpb24sICdmZW5uZWNfaWQnXX0pLm1hcChcbiAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgaW4gdHJhaXRDaXRhdGlvbnMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJhaXRDaXRhdGlvbnNbdmFsdWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgKTtcbiAgICBiaW9tLmFkZE1ldGFkYXRhKHtkaW1lbnNpb246IGRpbWVuc2lvbiwgYXR0cmlidXRlOiB0cmFpdE5hbWUsIHZhbHVlczogdHJhaXRfbWV0YWRhdGF9KTtcbiAgICBiaW9tLmFkZE1ldGFkYXRhKHtkaW1lbnNpb246IGRpbWVuc2lvbiwgYXR0cmlidXRlOiBbJ3RyYWl0X2NpdGF0aW9ucycsIHRyYWl0TmFtZV0sIHZhbHVlczogdHJhaXRfY2l0YXRpb25zfSk7XG4gICAgbGV0IHdlYnNlcnZpY2VVcmwgPSBSb3V0aW5nLmdlbmVyYXRlKCdhcGknLCB7J25hbWVzcGFjZSc6ICdlZGl0JywgJ2NsYXNzbmFtZSc6ICd1cGRhdGVQcm9qZWN0J30pO1xuICAgICQuYWpheCh3ZWJzZXJ2aWNlVXJsLCB7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIFwiZGJ2ZXJzaW9uXCI6IGRiVmVyc2lvbixcbiAgICAgICAgICAgIFwicHJvamVjdF9pZFwiOiBpbnRlcm5hbFByb2plY3RJZCxcbiAgICAgICAgICAgIFwiYmlvbVwiOiBiaW9tLnRvU3RyaW5nKClcbiAgICAgICAgfSxcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgc3VjY2VzczogYWN0aW9uLFxuICAgICAgICBlcnJvcjogKGVycm9yKSA9PiBzaG93TWVzc2FnZURpYWxvZyhlcnJvciwgJ2RhbmdlcicpXG4gICAgfSk7XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L3Byb2plY3QvaGVscGVycy9hZGRUcmFpdFRvUHJvamVjdC5qc3giLCJmdW5jdGlvbiByZW1vdmVUcmFpdEZyb21Qcm9qZWN0KHRyYWl0TmFtZSwgYmlvbSwgZGltZW5zaW9uLCBkYlZlcnNpb24saW50ZXJuYWxQcm9qZWN0SWQsIGFjdGlvbikge1xuICAgIGxldCBlbnRyaWVzID0gZGltZW5zaW9uID09PSAnY29sdW1ucycgPyBiaW9tLmNvbHVtbnMgOiBiaW9tLnJvd3NcbiAgICBmb3IobGV0IGVudHJ5IG9mIGVudHJpZXMpe1xuICAgICAgICBpZihlbnRyeS5tZXRhZGF0YSAhPSBudWxsKXtcbiAgICAgICAgICAgIGRlbGV0ZSBlbnRyeS5tZXRhZGF0YVt0cmFpdE5hbWVdXG4gICAgICAgICAgICBpZihlbnRyeS5tZXRhZGF0YS50cmFpdF9jaXRhdGlvbnMgIT0gbnVsbCl7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGVudHJ5Lm1ldGFkYXRhLnRyYWl0X2NpdGF0aW9uc1t0cmFpdE5hbWVdXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgbGV0IHdlYnNlcnZpY2VVcmwgPSBSb3V0aW5nLmdlbmVyYXRlKCdhcGknLCB7J25hbWVzcGFjZSc6ICdlZGl0JywgJ2NsYXNzbmFtZSc6ICd1cGRhdGVQcm9qZWN0J30pO1xuICAgICQuYWpheCh3ZWJzZXJ2aWNlVXJsLCB7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIFwiZGJ2ZXJzaW9uXCI6IGRiVmVyc2lvbixcbiAgICAgICAgICAgIFwicHJvamVjdF9pZFwiOiBpbnRlcm5hbFByb2plY3RJZCxcbiAgICAgICAgICAgIFwiYmlvbVwiOiBiaW9tLnRvU3RyaW5nKClcbiAgICAgICAgfSxcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgc3VjY2VzczogYWN0aW9uLFxuICAgICAgICBlcnJvcjogKGVycm9yKSA9PiBzaG93TWVzc2FnZURpYWxvZyhlcnJvciwgJ2RhbmdlcicpXG4gICAgfSk7XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L3Byb2plY3QvaGVscGVycy9yZW1vdmVUcmFpdEZyb21Qcm9qZWN0LmpzeCJdLCJzb3VyY2VSb290IjoiIn0=