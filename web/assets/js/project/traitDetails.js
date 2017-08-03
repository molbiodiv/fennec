webpackJsonp([6],{

/***/ "./app/Resources/client/jsx/project/traitDetails.jsx":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("./app/Resources/client/jsx/project/traitDetails/traitDetails.jsx");

/***/ }),

/***/ "./app/Resources/client/jsx/project/traitDetails/traitDetails.jsx":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {/*
 * global traitValues
 * global traitCitations
 * global dimension
 */
$('document').ready(() => {
    $('#add-trait-to-project-button').on('click', function () {
        addTraitToProject(traitName, traitValues, traitCitations, biom, dimension, dbversion, internalProjectId, () => showMessageDialog('Successfully added ' + traitName + ' to metadata.', 'success'));
    });

    let projectUrl = Routing.generate('project_details', { 'dbversion': dbversion, 'project_id': internalProjectId }) + "#traits";
    $('#page-title').html(`<a href="${projectUrl}"><i class="fa fa-arrow-circle-left" style="padding-right: 10px"></i></a>` + $('#page-title').html());
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ 2:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./app/Resources/client/jsx/project/traitDetails.jsx");


/***/ })

},[2]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvcHJvamVjdC90cmFpdERldGFpbHMuanN4Iiwid2VicGFjazovLy8uL2FwcC9SZXNvdXJjZXMvY2xpZW50L2pzeC9wcm9qZWN0L3RyYWl0RGV0YWlscy90cmFpdERldGFpbHMuanN4Il0sIm5hbWVzIjpbInJlcXVpcmUiLCIkIiwicmVhZHkiLCJvbiIsImFkZFRyYWl0VG9Qcm9qZWN0IiwidHJhaXROYW1lIiwidHJhaXRWYWx1ZXMiLCJ0cmFpdENpdGF0aW9ucyIsImJpb20iLCJkaW1lbnNpb24iLCJkYnZlcnNpb24iLCJpbnRlcm5hbFByb2plY3RJZCIsInNob3dNZXNzYWdlRGlhbG9nIiwicHJvamVjdFVybCIsIlJvdXRpbmciLCJnZW5lcmF0ZSIsImh0bWwiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsbUJBQUFBLENBQVEsa0VBQVIsRTs7Ozs7OztBQ0FBOzs7OztBQUtBQyxFQUFFLFVBQUYsRUFBY0MsS0FBZCxDQUFvQixNQUFNO0FBQ3RCRCxNQUFFLDhCQUFGLEVBQWtDRSxFQUFsQyxDQUFxQyxPQUFyQyxFQUE4QyxZQUFZO0FBQ3REQywwQkFBa0JDLFNBQWxCLEVBQTZCQyxXQUE3QixFQUEwQ0MsY0FBMUMsRUFBMERDLElBQTFELEVBQWdFQyxTQUFoRSxFQUEyRUMsU0FBM0UsRUFBc0ZDLGlCQUF0RixFQUF5RyxNQUFNQyxrQkFBa0Isd0JBQXdCUCxTQUF4QixHQUFvQyxlQUF0RCxFQUF1RSxTQUF2RSxDQUEvRztBQUNILEtBRkQ7O0FBSUEsUUFBSVEsYUFBYUMsUUFBUUMsUUFBUixDQUFpQixpQkFBakIsRUFBb0MsRUFBQyxhQUFhTCxTQUFkLEVBQXlCLGNBQWNDLGlCQUF2QyxFQUFwQyxJQUErRixTQUFoSDtBQUNBVixNQUFFLGFBQUYsRUFBaUJlLElBQWpCLENBQ0ssWUFBV0gsVUFBVywyRUFBdkIsR0FBa0daLEVBQUUsYUFBRixFQUFpQmUsSUFBakIsRUFEdEc7QUFHSCxDQVRELEUiLCJmaWxlIjoicHJvamVjdC90cmFpdERldGFpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCcuL3RyYWl0RGV0YWlscy90cmFpdERldGFpbHMuanN4JylcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvcHJvamVjdC90cmFpdERldGFpbHMuanN4IiwiLypcbiAqIGdsb2JhbCB0cmFpdFZhbHVlc1xuICogZ2xvYmFsIHRyYWl0Q2l0YXRpb25zXG4gKiBnbG9iYWwgZGltZW5zaW9uXG4gKi9cbiQoJ2RvY3VtZW50JykucmVhZHkoKCkgPT4ge1xuICAgICQoJyNhZGQtdHJhaXQtdG8tcHJvamVjdC1idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGFkZFRyYWl0VG9Qcm9qZWN0KHRyYWl0TmFtZSwgdHJhaXRWYWx1ZXMsIHRyYWl0Q2l0YXRpb25zLCBiaW9tLCBkaW1lbnNpb24sIGRidmVyc2lvbiwgaW50ZXJuYWxQcm9qZWN0SWQsICgpID0+IHNob3dNZXNzYWdlRGlhbG9nKCdTdWNjZXNzZnVsbHkgYWRkZWQgJyArIHRyYWl0TmFtZSArICcgdG8gbWV0YWRhdGEuJywgJ3N1Y2Nlc3MnKSk7XG4gICAgfSk7XG5cbiAgICBsZXQgcHJvamVjdFVybCA9IFJvdXRpbmcuZ2VuZXJhdGUoJ3Byb2plY3RfZGV0YWlscycsIHsnZGJ2ZXJzaW9uJzogZGJ2ZXJzaW9uLCAncHJvamVjdF9pZCc6IGludGVybmFsUHJvamVjdElkfSkrXCIjdHJhaXRzXCJcbiAgICAkKCcjcGFnZS10aXRsZScpLmh0bWwoXG4gICAgICAgIGA8YSBocmVmPVwiJHtwcm9qZWN0VXJsfVwiPjxpIGNsYXNzPVwiZmEgZmEtYXJyb3ctY2lyY2xlLWxlZnRcIiBzdHlsZT1cInBhZGRpbmctcmlnaHQ6IDEwcHhcIj48L2k+PC9hPmArJCgnI3BhZ2UtdGl0bGUnKS5odG1sKClcbiAgICApXG59KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvcHJvamVjdC90cmFpdERldGFpbHMvdHJhaXREZXRhaWxzLmpzeCJdLCJzb3VyY2VSb290IjoiIn0=