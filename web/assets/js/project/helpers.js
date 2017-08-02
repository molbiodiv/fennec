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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/Resources/client/jsx/project/helpers.jsx":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("./app/Resources/client/jsx/project/helpers/addTraitToProject.jsx");
__webpack_require__("./app/Resources/client/jsx/project/helpers/removeTraitFromProject.jsx");

/***/ }),

/***/ "./app/Resources/client/jsx/project/helpers/addTraitToProject.jsx":
/***/ (function(module, exports) {

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

/***/ }),

/***/ "./app/Resources/client/jsx/project/helpers/removeTraitFromProject.jsx":
/***/ (function(module, exports) {

function removeTraitFromProject(traitName, biom, dimension, dbVersion, internalProjectId, action) {
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

/***/ }),

/***/ 3:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./app/Resources/client/jsx/project/helpers.jsx");


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYjFhMmE3MGM5YTAzMGJhMWIwYjkiLCJ3ZWJwYWNrOi8vLy4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L3Byb2plY3QvaGVscGVycy5qc3giLCJ3ZWJwYWNrOi8vLy4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L3Byb2plY3QvaGVscGVycy9hZGRUcmFpdFRvUHJvamVjdC5qc3giLCJ3ZWJwYWNrOi8vLy4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L3Byb2plY3QvaGVscGVycy9yZW1vdmVUcmFpdEZyb21Qcm9qZWN0LmpzeCJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiYWRkVHJhaXRUb1Byb2plY3QiLCJ0cmFpdE5hbWUiLCJ0cmFpdFZhbHVlcyIsInRyYWl0Q2l0YXRpb25zIiwiYmlvbSIsImRpbWVuc2lvbiIsImRiVmVyc2lvbiIsImludGVybmFsUHJvamVjdElkIiwiYWN0aW9uIiwiY29uc29sZSIsImxvZyIsImFyZ3VtZW50cyIsInRyYWl0X21ldGFkYXRhIiwiZ2V0TWV0YWRhdGEiLCJhdHRyaWJ1dGUiLCJkYnZlcnNpb24iLCJtYXAiLCJ2YWx1ZSIsInRyYWl0X2NpdGF0aW9ucyIsImFkZE1ldGFkYXRhIiwidmFsdWVzIiwid2Vic2VydmljZVVybCIsIlJvdXRpbmciLCJnZW5lcmF0ZSIsIiQiLCJhamF4IiwiZGF0YSIsInRvU3RyaW5nIiwibWV0aG9kIiwic3VjY2VzcyIsImVycm9yIiwic2hvd01lc3NhZ2VEaWFsb2ciLCJyZW1vdmVUcmFpdEZyb21Qcm9qZWN0IiwiZW50cmllcyIsImNvbHVtbnMiLCJyb3dzIiwiZW50cnkiLCJtZXRhZGF0YSJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztB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QixDQUFQO0FBQ0g7QUFDSjtBQUNKO0FBQ0QsUUFBSW9CLGdCQUFnQkMsUUFBUUMsUUFBUixDQUFpQixLQUFqQixFQUF3QixFQUFDLGFBQWEsTUFBZCxFQUFzQixhQUFhLGVBQW5DLEVBQXhCLENBQXBCO0FBQ0FDLE1BQUVDLElBQUYsQ0FBT0osYUFBUCxFQUFzQjtBQUNsQkssY0FBTTtBQUNGLHlCQUFhcEIsU0FEWDtBQUVGLDBCQUFjQyxpQkFGWjtBQUdGLG9CQUFRSCxLQUFLdUIsUUFBTDtBQUhOLFNBRFk7QUFNbEJDLGdCQUFRLE1BTlU7QUFPbEJDLGlCQUFTckIsTUFQUztBQVFsQnNCLGVBQVFBLEtBQUQsSUFBV0Msa0JBQWtCRCxLQUFsQixFQUF5QixRQUF6QjtBQVJBLEtBQXRCO0FBVUgsQyIsImZpbGUiOiJwcm9qZWN0L2hlbHBlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvanMvXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMyk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgYjFhMmE3MGM5YTAzMGJhMWIwYjkiLCJyZXF1aXJlKCcuL2hlbHBlcnMvYWRkVHJhaXRUb1Byb2plY3QuanN4JylcbnJlcXVpcmUoJy4vaGVscGVycy9yZW1vdmVUcmFpdEZyb21Qcm9qZWN0LmpzeCcpXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L3Byb2plY3QvaGVscGVycy5qc3giLCJmdW5jdGlvbiBhZGRUcmFpdFRvUHJvamVjdCh0cmFpdE5hbWUsIHRyYWl0VmFsdWVzLCB0cmFpdENpdGF0aW9ucywgYmlvbSwgZGltZW5zaW9uLCBkYlZlcnNpb24saW50ZXJuYWxQcm9qZWN0SWQsIGFjdGlvbikge1xuICAgIGNvbnNvbGUubG9nKGFyZ3VtZW50cylcbiAgICB2YXIgdHJhaXRfbWV0YWRhdGEgPSBiaW9tLmdldE1ldGFkYXRhKHtkaW1lbnNpb246IGRpbWVuc2lvbiwgYXR0cmlidXRlOiBbJ2Zlbm5lYycsIGRidmVyc2lvbiwgJ2Zlbm5lY19pZCddfSkubWFwKFxuICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSBpbiB0cmFpdFZhbHVlcykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cmFpdFZhbHVlc1t2YWx1ZV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICk7XG4gICAgdmFyIHRyYWl0X2NpdGF0aW9ucyA9IGJpb20uZ2V0TWV0YWRhdGEoe2RpbWVuc2lvbjogZGltZW5zaW9uLCBhdHRyaWJ1dGU6IFsnZmVubmVjJywgZGJ2ZXJzaW9uLCAnZmVubmVjX2lkJ119KS5tYXAoXG4gICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlIGluIHRyYWl0Q2l0YXRpb25zKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRyYWl0Q2l0YXRpb25zW3ZhbHVlXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICk7XG4gICAgYmlvbS5hZGRNZXRhZGF0YSh7ZGltZW5zaW9uOiBkaW1lbnNpb24sIGF0dHJpYnV0ZTogdHJhaXROYW1lLCB2YWx1ZXM6IHRyYWl0X21ldGFkYXRhfSk7XG4gICAgYmlvbS5hZGRNZXRhZGF0YSh7ZGltZW5zaW9uOiBkaW1lbnNpb24sIGF0dHJpYnV0ZTogWyd0cmFpdF9jaXRhdGlvbnMnLCB0cmFpdE5hbWVdLCB2YWx1ZXM6IHRyYWl0X2NpdGF0aW9uc30pO1xuICAgIGxldCB3ZWJzZXJ2aWNlVXJsID0gUm91dGluZy5nZW5lcmF0ZSgnYXBpJywgeyduYW1lc3BhY2UnOiAnZWRpdCcsICdjbGFzc25hbWUnOiAndXBkYXRlUHJvamVjdCd9KTtcbiAgICAkLmFqYXgod2Vic2VydmljZVVybCwge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBcImRidmVyc2lvblwiOiBkYlZlcnNpb24sXG4gICAgICAgICAgICBcInByb2plY3RfaWRcIjogaW50ZXJuYWxQcm9qZWN0SWQsXG4gICAgICAgICAgICBcImJpb21cIjogYmlvbS50b1N0cmluZygpXG4gICAgICAgIH0sXG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIHN1Y2Nlc3M6IGFjdGlvbixcbiAgICAgICAgZXJyb3I6IChlcnJvcikgPT4gc2hvd01lc3NhZ2VEaWFsb2coZXJyb3IsICdkYW5nZXInKVxuICAgIH0pO1xufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9SZXNvdXJjZXMvY2xpZW50L2pzeC9wcm9qZWN0L2hlbHBlcnMvYWRkVHJhaXRUb1Byb2plY3QuanN4IiwiZnVuY3Rpb24gcmVtb3ZlVHJhaXRGcm9tUHJvamVjdCh0cmFpdE5hbWUsIGJpb20sIGRpbWVuc2lvbiwgZGJWZXJzaW9uLGludGVybmFsUHJvamVjdElkLCBhY3Rpb24pIHtcbiAgICBsZXQgZW50cmllcyA9IGRpbWVuc2lvbiA9PT0gJ2NvbHVtbnMnID8gYmlvbS5jb2x1bW5zIDogYmlvbS5yb3dzXG4gICAgZm9yKGxldCBlbnRyeSBvZiBlbnRyaWVzKXtcbiAgICAgICAgaWYoZW50cnkubWV0YWRhdGEgIT0gbnVsbCl7XG4gICAgICAgICAgICBkZWxldGUgZW50cnkubWV0YWRhdGFbdHJhaXROYW1lXVxuICAgICAgICAgICAgaWYoZW50cnkubWV0YWRhdGEudHJhaXRfY2l0YXRpb25zICE9IG51bGwpe1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBlbnRyeS5tZXRhZGF0YS50cmFpdF9jaXRhdGlvbnNbdHJhaXROYW1lXVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGxldCB3ZWJzZXJ2aWNlVXJsID0gUm91dGluZy5nZW5lcmF0ZSgnYXBpJywgeyduYW1lc3BhY2UnOiAnZWRpdCcsICdjbGFzc25hbWUnOiAndXBkYXRlUHJvamVjdCd9KTtcbiAgICAkLmFqYXgod2Vic2VydmljZVVybCwge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBcImRidmVyc2lvblwiOiBkYlZlcnNpb24sXG4gICAgICAgICAgICBcInByb2plY3RfaWRcIjogaW50ZXJuYWxQcm9qZWN0SWQsXG4gICAgICAgICAgICBcImJpb21cIjogYmlvbS50b1N0cmluZygpXG4gICAgICAgIH0sXG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIHN1Y2Nlc3M6IGFjdGlvbixcbiAgICAgICAgZXJyb3I6IChlcnJvcikgPT4gc2hvd01lc3NhZ2VEaWFsb2coZXJyb3IsICdkYW5nZXInKVxuICAgIH0pO1xufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9SZXNvdXJjZXMvY2xpZW50L2pzeC9wcm9qZWN0L2hlbHBlcnMvcmVtb3ZlVHJhaXRGcm9tUHJvamVjdC5qc3giXSwic291cmNlUm9vdCI6IiJ9