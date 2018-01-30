webpackJsonp([4],{

/***/ "./app/Resources/client/jsx/project/helpers.jsx":
/*!******************************************************!*\
  !*** ./app/Resources/client/jsx/project/helpers.jsx ***!
  \******************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./helpers/addTraitToProject.jsx */ "./app/Resources/client/jsx/project/helpers/addTraitToProject.jsx");
__webpack_require__(/*! ./helpers/removeTraitFromProject.jsx */ "./app/Resources/client/jsx/project/helpers/removeTraitFromProject.jsx");

/***/ }),

/***/ "./app/Resources/client/jsx/project/helpers/addTraitToProject.jsx":
/*!************************************************************************!*\
  !*** ./app/Resources/client/jsx/project/helpers/addTraitToProject.jsx ***!
  \************************************************************************/
/*! no static exports found */
/*! all exports used */
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
    var webserviceUrl = Routing.generate('api_edit_update_project', { 'dbversion': dbversion });
    $.ajax(webserviceUrl, {
        data: {
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ "./app/Resources/client/jsx/project/helpers/removeTraitFromProject.jsx":
/*!*****************************************************************************!*\
  !*** ./app/Resources/client/jsx/project/helpers/removeTraitFromProject.jsx ***!
  \*****************************************************************************/
/*! no static exports found */
/*! all exports used */
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

    var webserviceUrl = Routing.generate('api_edit_update_project', { 'dbversion': dbversion });
    $.ajax(webserviceUrl, {
        data: {
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ 1:
/*!************************************************************!*\
  !*** multi ./app/Resources/client/jsx/project/helpers.jsx ***!
  \************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./app/Resources/client/jsx/project/helpers.jsx */"./app/Resources/client/jsx/project/helpers.jsx");


/***/ })

},[1]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvcHJvamVjdC9oZWxwZXJzLmpzeCIsIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvcHJvamVjdC9oZWxwZXJzL2FkZFRyYWl0VG9Qcm9qZWN0LmpzeCIsIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvcHJvamVjdC9oZWxwZXJzL3JlbW92ZVRyYWl0RnJvbVByb2plY3QuanN4Il0sIm5hbWVzIjpbInJlcXVpcmUiLCJhZGRUcmFpdFRvUHJvamVjdCIsInRyYWl0TmFtZSIsInRyYWl0VmFsdWVzIiwidHJhaXRDaXRhdGlvbnMiLCJiaW9tIiwiZGltZW5zaW9uIiwiZGJWZXJzaW9uIiwiaW50ZXJuYWxQcm9qZWN0SWQiLCJhY3Rpb24iLCJjb25zb2xlIiwibG9nIiwiYXJndW1lbnRzIiwidHJhaXRfbWV0YWRhdGEiLCJnZXRNZXRhZGF0YSIsImF0dHJpYnV0ZSIsImRidmVyc2lvbiIsIm1hcCIsInZhbHVlIiwidHJhaXRfY2l0YXRpb25zIiwiYWRkTWV0YWRhdGEiLCJ2YWx1ZXMiLCJ3ZWJzZXJ2aWNlVXJsIiwiUm91dGluZyIsImdlbmVyYXRlIiwiJCIsImFqYXgiLCJkYXRhIiwidG9TdHJpbmciLCJtZXRob2QiLCJzdWNjZXNzIiwiZXJyb3IiLCJzaG93TWVzc2FnZURpYWxvZyIsIm1vZHVsZSIsImV4cG9ydHMiLCJyZW1vdmVUcmFpdEZyb21Qcm9qZWN0IiwiZW50cmllcyIsImNvbHVtbnMiLCJyb3dzIiwiZW50cnkiLCJtZXRhZGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLG1CQUFBQSxDQUFRLHlHQUFSO0FBQ0EsbUJBQUFBLENBQVEsbUhBQVIsRTs7Ozs7Ozs7Ozs7O0FDREEsa0RBQVNDLGlCQUFULENBQTJCQyxTQUEzQixFQUFzQ0MsV0FBdEMsRUFBbURDLGNBQW5ELEVBQW1FQyxJQUFuRSxFQUF5RUMsU0FBekUsRUFBb0ZD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QyxnQkFBUSxNQUxVO0FBTWxCQyxpQkFBU3JCLE1BTlM7QUFPbEJzQixlQUFPLGVBQUNBLE1BQUQ7QUFBQSxtQkFBV0Msa0JBQWtCRCxNQUFsQixFQUF5QixRQUF6QixDQUFYO0FBQUE7QUFQVyxLQUF0QjtBQVNIOztBQUVERSxPQUFPQyxPQUFQLEdBQWlCQyxzQkFBakIsQyIsImZpbGUiOiJwcm9qZWN0L2hlbHBlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCcuL2hlbHBlcnMvYWRkVHJhaXRUb1Byb2plY3QuanN4JylcbnJlcXVpcmUoJy4vaGVscGVycy9yZW1vdmVUcmFpdEZyb21Qcm9qZWN0LmpzeCcpXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L3Byb2plY3QvaGVscGVycy5qc3giLCJmdW5jdGlvbiBhZGRUcmFpdFRvUHJvamVjdCh0cmFpdE5hbWUsIHRyYWl0VmFsdWVzLCB0cmFpdENpdGF0aW9ucywgYmlvbSwgZGltZW5zaW9uLCBkYlZlcnNpb24saW50ZXJuYWxQcm9qZWN0SWQsIGFjdGlvbikge1xuICAgIGNvbnNvbGUubG9nKGFyZ3VtZW50cylcbiAgICB2YXIgdHJhaXRfbWV0YWRhdGEgPSBiaW9tLmdldE1ldGFkYXRhKHtkaW1lbnNpb246IGRpbWVuc2lvbiwgYXR0cmlidXRlOiBbJ2Zlbm5lYycsIGRidmVyc2lvbiwgJ2Zlbm5lY19pZCddfSkubWFwKFxuICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSBpbiB0cmFpdFZhbHVlcykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cmFpdFZhbHVlc1t2YWx1ZV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICk7XG4gICAgdmFyIHRyYWl0X2NpdGF0aW9ucyA9IGJpb20uZ2V0TWV0YWRhdGEoe2RpbWVuc2lvbjogZGltZW5zaW9uLCBhdHRyaWJ1dGU6IFsnZmVubmVjJywgZGJ2ZXJzaW9uLCAnZmVubmVjX2lkJ119KS5tYXAoXG4gICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlIGluIHRyYWl0Q2l0YXRpb25zKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRyYWl0Q2l0YXRpb25zW3ZhbHVlXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICk7XG4gICAgYmlvbS5hZGRNZXRhZGF0YSh7ZGltZW5zaW9uOiBkaW1lbnNpb24sIGF0dHJpYnV0ZTogdHJhaXROYW1lLCB2YWx1ZXM6IHRyYWl0X21ldGFkYXRhfSk7XG4gICAgYmlvbS5hZGRNZXRhZGF0YSh7ZGltZW5zaW9uOiBkaW1lbnNpb24sIGF0dHJpYnV0ZTogWyd0cmFpdF9jaXRhdGlvbnMnLCB0cmFpdE5hbWVdLCB2YWx1ZXM6IHRyYWl0X2NpdGF0aW9uc30pO1xuICAgIGxldCB3ZWJzZXJ2aWNlVXJsID0gUm91dGluZy5nZW5lcmF0ZSgnYXBpX2VkaXRfdXBkYXRlX3Byb2plY3QnLCB7J2RidmVyc2lvbic6IGRidmVyc2lvbn0pO1xuICAgICQuYWpheCh3ZWJzZXJ2aWNlVXJsLCB7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIFwicHJvamVjdF9pZFwiOiBpbnRlcm5hbFByb2plY3RJZCxcbiAgICAgICAgICAgIFwiYmlvbVwiOiBiaW9tLnRvU3RyaW5nKClcbiAgICAgICAgfSxcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgc3VjY2VzczogYWN0aW9uLFxuICAgICAgICBlcnJvcjogKGVycm9yKSA9PiBzaG93TWVzc2FnZURpYWxvZyhlcnJvciwgJ2RhbmdlcicpXG4gICAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYWRkVHJhaXRUb1Byb2plY3Q7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L3Byb2plY3QvaGVscGVycy9hZGRUcmFpdFRvUHJvamVjdC5qc3giLCJmdW5jdGlvbiByZW1vdmVUcmFpdEZyb21Qcm9qZWN0KHRyYWl0TmFtZSwgYmlvbSwgZGltZW5zaW9uLCBkYlZlcnNpb24saW50ZXJuYWxQcm9qZWN0SWQsIGFjdGlvbikge1xuICAgIGxldCBlbnRyaWVzID0gZGltZW5zaW9uID09PSAnY29sdW1ucycgPyBiaW9tLmNvbHVtbnMgOiBiaW9tLnJvd3NcbiAgICBmb3IobGV0IGVudHJ5IG9mIGVudHJpZXMpe1xuICAgICAgICBpZihlbnRyeS5tZXRhZGF0YSAhPSBudWxsKXtcbiAgICAgICAgICAgIGRlbGV0ZSBlbnRyeS5tZXRhZGF0YVt0cmFpdE5hbWVdXG4gICAgICAgICAgICBpZihlbnRyeS5tZXRhZGF0YS50cmFpdF9jaXRhdGlvbnMgIT0gbnVsbCl7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGVudHJ5Lm1ldGFkYXRhLnRyYWl0X2NpdGF0aW9uc1t0cmFpdE5hbWVdXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgbGV0IHdlYnNlcnZpY2VVcmwgPSBSb3V0aW5nLmdlbmVyYXRlKCdhcGlfZWRpdF91cGRhdGVfcHJvamVjdCcsIHsnZGJ2ZXJzaW9uJzogZGJ2ZXJzaW9ufSk7XG4gICAgJC5hamF4KHdlYnNlcnZpY2VVcmwsIHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgXCJwcm9qZWN0X2lkXCI6IGludGVybmFsUHJvamVjdElkLFxuICAgICAgICAgICAgXCJiaW9tXCI6IGJpb20udG9TdHJpbmcoKVxuICAgICAgICB9LFxuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICBzdWNjZXNzOiBhY3Rpb24sXG4gICAgICAgIGVycm9yOiAoZXJyb3IpID0+IHNob3dNZXNzYWdlRGlhbG9nKGVycm9yLCAnZGFuZ2VyJylcbiAgICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZW1vdmVUcmFpdEZyb21Qcm9qZWN0O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9SZXNvdXJjZXMvY2xpZW50L2pzeC9wcm9qZWN0L2hlbHBlcnMvcmVtb3ZlVHJhaXRGcm9tUHJvamVjdC5qc3giXSwic291cmNlUm9vdCI6IiJ9