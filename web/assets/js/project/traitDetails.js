/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/Resources/client/jsx/project/traitDetails.jsx":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("./app/Resources/client/jsx/project/traitDetails/traitDetails.jsx");

/***/ }),

/***/ "./app/Resources/client/jsx/project/traitDetails/traitDetails.jsx":
/***/ (function(module, exports) {

/*
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

/***/ }),

/***/ 4:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./app/Resources/client/jsx/project/traitDetails.jsx");


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYjFhMmE3MGM5YTAzMGJhMWIwYjkiLCJ3ZWJwYWNrOi8vLy4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L3Byb2plY3QvdHJhaXREZXRhaWxzLmpzeCIsIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvcHJvamVjdC90cmFpdERldGFpbHMvdHJhaXREZXRhaWxzLmpzeCJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiJCIsInJlYWR5Iiwib24iLCJhZGRUcmFpdFRvUHJvamVjdCIsInRyYWl0TmFtZSIsInRyYWl0VmFsdWVzIiwidHJhaXRDaXRhdGlvbnMiLCJiaW9tIiwiZGltZW5zaW9uIiwiZGJ2ZXJzaW9uIiwiaW50ZXJuYWxQcm9qZWN0SWQiLCJzaG93TWVzc2FnZURpYWxvZyIsInByb2plY3RVcmwiLCJSb3V0aW5nIiwiZ2VuZXJhdGUiLCJodG1sIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7O0FDN0RBLG1CQUFBQSxDQUFRLGtFQUFSLEU7Ozs7Ozs7QUNBQTs7Ozs7QUFLQUMsRUFBRSxVQUFGLEVBQWNDLEtBQWQsQ0FBb0IsTUFBTTtBQUN0QkQsTUFBRSw4QkFBRixFQUFrQ0UsRUFBbEMsQ0FBcUMsT0FBckMsRUFBOEMsWUFBWTtBQUN0REMsMEJBQWtCQyxTQUFsQixFQUE2QkMsV0FBN0IsRUFBMENDLGNBQTFDLEVBQTBEQyxJQUExRCxFQUFnRUMsU0FBaEUsRUFBMkVDLFNBQTNFLEVBQXNGQyxpQkFBdEYsRUFBeUcsTUFBTUMsa0JBQWtCLHdCQUF3QlAsU0FBeEIsR0FBb0MsZUFBdEQsRUFBdUUsU0FBdkUsQ0FBL0c7QUFDSCxLQUZEOztBQUlBLFFBQUlRLGFBQWFDLFFBQVFDLFFBQVIsQ0FBaUIsaUJBQWpCLEVBQW9DLEVBQUMsYUFBYUwsU0FBZCxFQUF5QixjQUFjQyxpQkFBdkMsRUFBcEMsSUFBK0YsU0FBaEg7QUFDQVYsTUFBRSxhQUFGLEVBQWlCZSxJQUFqQixDQUNLLFlBQVdILFVBQVcsMkVBQXZCLEdBQWtHWixFQUFFLGFBQUYsRUFBaUJlLElBQWpCLEVBRHRHO0FBR0gsQ0FURCxFIiwiZmlsZSI6InByb2plY3QvdHJhaXREZXRhaWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL2pzL1wiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDQpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGIxYTJhNzBjOWEwMzBiYTFiMGI5IiwicmVxdWlyZSgnLi90cmFpdERldGFpbHMvdHJhaXREZXRhaWxzLmpzeCcpXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L3Byb2plY3QvdHJhaXREZXRhaWxzLmpzeCIsIi8qXG4gKiBnbG9iYWwgdHJhaXRWYWx1ZXNcbiAqIGdsb2JhbCB0cmFpdENpdGF0aW9uc1xuICogZ2xvYmFsIGRpbWVuc2lvblxuICovXG4kKCdkb2N1bWVudCcpLnJlYWR5KCgpID0+IHtcbiAgICAkKCcjYWRkLXRyYWl0LXRvLXByb2plY3QtYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBhZGRUcmFpdFRvUHJvamVjdCh0cmFpdE5hbWUsIHRyYWl0VmFsdWVzLCB0cmFpdENpdGF0aW9ucywgYmlvbSwgZGltZW5zaW9uLCBkYnZlcnNpb24sIGludGVybmFsUHJvamVjdElkLCAoKSA9PiBzaG93TWVzc2FnZURpYWxvZygnU3VjY2Vzc2Z1bGx5IGFkZGVkICcgKyB0cmFpdE5hbWUgKyAnIHRvIG1ldGFkYXRhLicsICdzdWNjZXNzJykpO1xuICAgIH0pO1xuXG4gICAgbGV0IHByb2plY3RVcmwgPSBSb3V0aW5nLmdlbmVyYXRlKCdwcm9qZWN0X2RldGFpbHMnLCB7J2RidmVyc2lvbic6IGRidmVyc2lvbiwgJ3Byb2plY3RfaWQnOiBpbnRlcm5hbFByb2plY3RJZH0pK1wiI3RyYWl0c1wiXG4gICAgJCgnI3BhZ2UtdGl0bGUnKS5odG1sKFxuICAgICAgICBgPGEgaHJlZj1cIiR7cHJvamVjdFVybH1cIj48aSBjbGFzcz1cImZhIGZhLWFycm93LWNpcmNsZS1sZWZ0XCIgc3R5bGU9XCJwYWRkaW5nLXJpZ2h0OiAxMHB4XCI+PC9pPjwvYT5gKyQoJyNwYWdlLXRpdGxlJykuaHRtbCgpXG4gICAgKVxufSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L3Byb2plY3QvdHJhaXREZXRhaWxzL3RyYWl0RGV0YWlscy5qc3giXSwic291cmNlUm9vdCI6IiJ9