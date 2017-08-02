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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/Resources/client/jsx/helpers.jsx":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("./app/Resources/client/jsx/helpers/condenseTraitValues.jsx");
__webpack_require__("./app/Resources/client/jsx/helpers/getMetadataKeys.jsx");
__webpack_require__("./app/Resources/client/jsx/helpers/organismDetails.js");

/***/ }),

/***/ "./app/Resources/client/jsx/helpers/condenseTraitValues.jsx":
/***/ (function(module, exports) {

function condenseCategoricalTraitValues(organismsByValue) {
    let valueByOrganism = {};
    for (let key of Object.keys(organismsByValue).sort()) {
        let value = organismsByValue[key];
        for (let organism of value) {
            if (organism in valueByOrganism) {
                valueByOrganism[organism] += '/' + key;
            } else {
                valueByOrganism[organism] = key;
            }
        }
    }
    return valueByOrganism;
}

function condenseNumericalTraitValues(multipleValuesPerOrganism) {
    let singleValue = {};
    for (let key of Object.keys(multipleValuesPerOrganism)) {
        if (multipleValuesPerOrganism[key].length > 0) {
            singleValue[key] = multipleValuesPerOrganism[key].reduce((acc, val) => Number(acc) + Number(val)) / multipleValuesPerOrganism[key].length;
        }
    }
    return singleValue;
}

// export globally
window.condenseCategoricalTraitValues = condenseCategoricalTraitValues;
window.condenseNumericalTraitValues = condenseNumericalTraitValues;

/***/ }),

/***/ "./app/Resources/client/jsx/helpers/getMetadataKeys.jsx":
/***/ (function(module, exports) {

function getMetadataKeys(biom, dimension = 'columns') {
    let elements = _.cloneDeep(dimension === 'columns' ? biom.columns : biom.rows);
    if (typeof elements === 'undefined') {
        return [];
    }
    let keys = elements.map(element => element.metadata === null ? [] : Object.keys(element.metadata));
    let uniqKeys = keys.reduce((acc, val) => _.uniq(acc.concat(val)), []);
    return uniqKeys.sort((a, b) => a.toUpperCase().localeCompare(b.toUpperCase()));
}

// export globally
window.getMetadataKeys = getMetadataKeys;

/***/ }),

/***/ "./app/Resources/client/jsx/helpers/organismDetails.js":
/***/ (function(module, exports) {

/**
 * Selects the best vernacularName from the object returned by the eol pages API.
 * It only considers english names (language: en) and preferes those with eol_preferred: true.
 * The scientificName is used as fallback.
 * @param eolObject {Object} object returned by the eol pages API
 * @returns {String} bestName
 */
function getBestVernacularNameEOL(eolObject) {
    var bestName = "";
    if (typeof eolObject.scientificName !== "undefined") {
        bestName = eolObject.scientificName;
    }
    if (typeof eolObject.vernacularNames !== "undefined" && eolObject.vernacularNames.length > 0) {
        var preferred = false;
        eolObject.vernacularNames.forEach(function (value) {
            if (value.language === "en") {
                if (typeof value.eol_preferred !== "undefined" && value.eol_preferred) {
                    preferred = true;
                    bestName = value.vernacularName;
                } else if (!preferred) {
                    bestName = value.vernacularName;
                }
            }
        });
    }
    return bestName;
};

// export globally
window.getBestVernacularNameEOL = getBestVernacularNameEOL;

/***/ }),

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./app/Resources/client/jsx/helpers.jsx");


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYjFhMmE3MGM5YTAzMGJhMWIwYjkiLCJ3ZWJwYWNrOi8vLy4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L2hlbHBlcnMuanN4Iiwid2VicGFjazovLy8uL2FwcC9SZXNvdXJjZXMvY2xpZW50L2pzeC9oZWxwZXJzL2NvbmRlbnNlVHJhaXRWYWx1ZXMuanN4Iiwid2VicGFjazovLy8uL2FwcC9SZXNvdXJjZXMvY2xpZW50L2pzeC9oZWxwZXJzL2dldE1ldGFkYXRhS2V5cy5qc3giLCJ3ZWJwYWNrOi8vLy4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L2hlbHBlcnMvb3JnYW5pc21EZXRhaWxzLmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJjb25kZW5zZUNhdGVnb3JpY2FsVHJhaXRWYWx1ZXMiLCJvcmdhbmlzbXNCeVZhbHVlIiwidmFsdWVCeU9yZ2FuaXNtIiwia2V5IiwiT2JqZWN0Iiwia2V5cyIsInNvcnQiLCJ2YWx1ZSIsIm9yZ2FuaXNtIiwiY29uZGVuc2VOdW1lcmljYWxUcmFpdFZhbHVlcyIsIm11bHRpcGxlVmFsdWVzUGVyT3JnYW5pc20iLCJzaW5nbGVWYWx1ZSIsImxlbmd0aCIsInJlZHVjZSIsImFjYyIsInZhbCIsIk51bWJlciIsIndpbmRvdyIsImdldE1ldGFkYXRhS2V5cyIsImJpb20iLCJkaW1lbnNpb24iLCJlbGVtZW50cyIsIl8iLCJjbG9uZURlZXAiLCJjb2x1bW5zIiwicm93cyIsIm1hcCIsImVsZW1lbnQiLCJtZXRhZGF0YSIsInVuaXFLZXlzIiwidW5pcSIsImNvbmNhdCIsImEiLCJiIiwidG9VcHBlckNhc2UiLCJsb2NhbGVDb21wYXJlIiwiZ2V0QmVzdFZlcm5hY3VsYXJOYW1lRU9MIiwiZW9sT2JqZWN0IiwiYmVzdE5hbWUiLCJzY2llbnRpZmljTmFtZSIsInZlcm5hY3VsYXJOYW1lcyIsInByZWZlcnJlZCIsImZvckVhY2giLCJsYW5ndWFnZSIsImVvbF9wcmVmZXJyZWQiLCJ2ZXJuYWN1bGFyTmFtZSJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7OztBQzdEQSxtQkFBQUEsQ0FBUSw0REFBUjtBQUNBLG1CQUFBQSxDQUFRLHdEQUFSO0FBQ0EsbUJBQUFBLENBQVEsdURBQVIsRTs7Ozs7OztBQ0ZBLFNBQVNDLDhCQUFULENBQXdDQyxnQkFBeEMsRUFBMEQ7QUFDdEQsUUFBSUMsa0JBQWtCLEVBQXRCO0FBQ0EsU0FBSSxJQUFJQyxHQUFSLElBQWVDLE9BQU9DLElBQVAsQ0FBWUosZ0JBQVosRUFBOEJLLElBQTlCLEVBQWYsRUFBb0Q7QUFDaEQsWUFBSUMsUUFBUU4saUJBQWlCRSxHQUFqQixDQUFaO0FBQ0EsYUFBSSxJQUFJSyxRQUFSLElBQW9CRCxLQUFwQixFQUEwQjtBQUN0QixnQkFBR0MsWUFBWU4sZUFBZixFQUErQjtBQUMzQkEsZ0NBQWdCTSxRQUFoQixLQUE2QixNQUFNTCxHQUFuQztBQUNILGFBRkQsTUFFTztBQUNIRCxnQ0FBZ0JNLFFBQWhCLElBQTRCTCxHQUE1QjtBQUNIO0FBQ0o7QUFDSjtBQUNELFdBQU9ELGVBQVA7QUFDSDs7QUFFRCxTQUFTTyw0QkFBVCxDQUFzQ0MseUJBQXRDLEVBQWlFO0FBQzdELFFBQUlDLGNBQWMsRUFBbEI7QUFDQSxTQUFJLElBQUlSLEdBQVIsSUFBZUMsT0FBT0MsSUFBUCxDQUFZSyx5QkFBWixDQUFmLEVBQXNEO0FBQ2xELFlBQUdBLDBCQUEwQlAsR0FBMUIsRUFBK0JTLE1BQS9CLEdBQXdDLENBQTNDLEVBQTZDO0FBQ3pDRCx3QkFBWVIsR0FBWixJQUFtQk8sMEJBQTBCUCxHQUExQixFQUErQlUsTUFBL0IsQ0FBc0MsQ0FBQ0MsR0FBRCxFQUFNQyxHQUFOLEtBQWNDLE9BQU9GLEdBQVAsSUFBWUUsT0FBT0QsR0FBUCxDQUFoRSxJQUE2RUwsMEJBQTBCUCxHQUExQixFQUErQlMsTUFBL0g7QUFDSDtBQUNKO0FBQ0QsV0FBT0QsV0FBUDtBQUNIOztBQUVEO0FBQ0FNLE9BQU9qQiw4QkFBUCxHQUF3Q0EsOEJBQXhDO0FBQ0FpQixPQUFPUiw0QkFBUCxHQUFzQ0EsNEJBQXRDLEM7Ozs7Ozs7QUMzQkEsU0FBU1MsZUFBVCxDQUF5QkMsSUFBekIsRUFBK0JDLFlBQVUsU0FBekMsRUFBbUQ7QUFDL0MsUUFBSUMsV0FBV0MsRUFBRUMsU0FBRixDQUFZSCxjQUFjLFNBQWQsR0FBMEJELEtBQUtLLE9BQS9CLEdBQXlDTCxLQUFLTSxJQUExRCxDQUFmO0FBQ0EsUUFBRyxPQUFPSixRQUFQLEtBQW9CLFdBQXZCLEVBQW1DO0FBQy9CLGVBQU8sRUFBUDtBQUNIO0FBQ0QsUUFBSWhCLE9BQU9nQixTQUFTSyxHQUFULENBQWFDLFdBQVdBLFFBQVFDLFFBQVIsS0FBcUIsSUFBckIsR0FBNEIsRUFBNUIsR0FBaUN4QixPQUFPQyxJQUFQLENBQVlzQixRQUFRQyxRQUFwQixDQUF6RCxDQUFYO0FBQ0EsUUFBSUMsV0FBV3hCLEtBQUtRLE1BQUwsQ0FBWSxDQUFDQyxHQUFELEVBQU1DLEdBQU4sS0FBY08sRUFBRVEsSUFBRixDQUFPaEIsSUFBSWlCLE1BQUosQ0FBV2hCLEdBQVgsQ0FBUCxDQUExQixFQUFtRCxFQUFuRCxDQUFmO0FBQ0EsV0FBT2MsU0FBU3ZCLElBQVQsQ0FBYyxDQUFDMEIsQ0FBRCxFQUFHQyxDQUFILEtBQVNELEVBQUVFLFdBQUYsR0FBZ0JDLGFBQWhCLENBQThCRixFQUFFQyxXQUFGLEVBQTlCLENBQXZCLENBQVA7QUFDSDs7QUFFRDtBQUNBakIsT0FBT0MsZUFBUCxHQUF5QkEsZUFBekIsQzs7Ozs7OztBQ1hBOzs7Ozs7O0FBT0EsU0FBU2tCLHdCQUFULENBQWtDQyxTQUFsQyxFQUE0QztBQUN4QyxRQUFJQyxXQUFXLEVBQWY7QUFDQSxRQUFHLE9BQU9ELFVBQVVFLGNBQWpCLEtBQW9DLFdBQXZDLEVBQW1EO0FBQy9DRCxtQkFBV0QsVUFBVUUsY0FBckI7QUFDSDtBQUNELFFBQUcsT0FBT0YsVUFBVUcsZUFBakIsS0FBcUMsV0FBckMsSUFBb0RILFVBQVVHLGVBQVYsQ0FBMEI1QixNQUExQixHQUFtQyxDQUExRixFQUE0RjtBQUN4RixZQUFJNkIsWUFBWSxLQUFoQjtBQUNBSixrQkFBVUcsZUFBVixDQUEwQkUsT0FBMUIsQ0FBa0MsVUFBU25DLEtBQVQsRUFBZTtBQUM3QyxnQkFBR0EsTUFBTW9DLFFBQU4sS0FBbUIsSUFBdEIsRUFBMkI7QUFDdkIsb0JBQUcsT0FBT3BDLE1BQU1xQyxhQUFiLEtBQStCLFdBQS9CLElBQThDckMsTUFBTXFDLGFBQXZELEVBQXFFO0FBQ2pFSCxnQ0FBWSxJQUFaO0FBQ0FILCtCQUFXL0IsTUFBTXNDLGNBQWpCO0FBQ0gsaUJBSEQsTUFJSyxJQUFHLENBQUNKLFNBQUosRUFBYztBQUNmSCwrQkFBVy9CLE1BQU1zQyxjQUFqQjtBQUNIO0FBQ0o7QUFDSixTQVZEO0FBV0g7QUFDRCxXQUFPUCxRQUFQO0FBQ0g7O0FBRUQ7QUFDQXJCLE9BQU9tQix3QkFBUCxHQUFrQ0Esd0JBQWxDLEMiLCJmaWxlIjoiaGVscGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9qcy9cIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBiMWEyYTcwYzlhMDMwYmExYjBiOSIsInJlcXVpcmUoJy4vaGVscGVycy9jb25kZW5zZVRyYWl0VmFsdWVzLmpzeCcpXG5yZXF1aXJlKCcuL2hlbHBlcnMvZ2V0TWV0YWRhdGFLZXlzLmpzeCcpXG5yZXF1aXJlKCcuL2hlbHBlcnMvb3JnYW5pc21EZXRhaWxzLmpzJylcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvaGVscGVycy5qc3giLCJmdW5jdGlvbiBjb25kZW5zZUNhdGVnb3JpY2FsVHJhaXRWYWx1ZXMob3JnYW5pc21zQnlWYWx1ZSkge1xuICAgIGxldCB2YWx1ZUJ5T3JnYW5pc20gPSB7fTtcbiAgICBmb3IobGV0IGtleSBvZiBPYmplY3Qua2V5cyhvcmdhbmlzbXNCeVZhbHVlKS5zb3J0KCkpe1xuICAgICAgICBsZXQgdmFsdWUgPSBvcmdhbmlzbXNCeVZhbHVlW2tleV07XG4gICAgICAgIGZvcihsZXQgb3JnYW5pc20gb2YgdmFsdWUpe1xuICAgICAgICAgICAgaWYob3JnYW5pc20gaW4gdmFsdWVCeU9yZ2FuaXNtKXtcbiAgICAgICAgICAgICAgICB2YWx1ZUJ5T3JnYW5pc21bb3JnYW5pc21dICs9ICcvJyArIGtleTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWVCeU9yZ2FuaXNtW29yZ2FuaXNtXSA9IGtleTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdmFsdWVCeU9yZ2FuaXNtO1xufVxuXG5mdW5jdGlvbiBjb25kZW5zZU51bWVyaWNhbFRyYWl0VmFsdWVzKG11bHRpcGxlVmFsdWVzUGVyT3JnYW5pc20pIHtcbiAgICBsZXQgc2luZ2xlVmFsdWUgPSB7fTtcbiAgICBmb3IobGV0IGtleSBvZiBPYmplY3Qua2V5cyhtdWx0aXBsZVZhbHVlc1Blck9yZ2FuaXNtKSl7XG4gICAgICAgIGlmKG11bHRpcGxlVmFsdWVzUGVyT3JnYW5pc21ba2V5XS5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgIHNpbmdsZVZhbHVlW2tleV0gPSBtdWx0aXBsZVZhbHVlc1Blck9yZ2FuaXNtW2tleV0ucmVkdWNlKChhY2MsIHZhbCkgPT4gTnVtYmVyKGFjYykrTnVtYmVyKHZhbCkpL211bHRpcGxlVmFsdWVzUGVyT3JnYW5pc21ba2V5XS5sZW5ndGg7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNpbmdsZVZhbHVlO1xufVxuXG4vLyBleHBvcnQgZ2xvYmFsbHlcbndpbmRvdy5jb25kZW5zZUNhdGVnb3JpY2FsVHJhaXRWYWx1ZXMgPSBjb25kZW5zZUNhdGVnb3JpY2FsVHJhaXRWYWx1ZXM7XG53aW5kb3cuY29uZGVuc2VOdW1lcmljYWxUcmFpdFZhbHVlcyA9IGNvbmRlbnNlTnVtZXJpY2FsVHJhaXRWYWx1ZXM7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L2hlbHBlcnMvY29uZGVuc2VUcmFpdFZhbHVlcy5qc3giLCJmdW5jdGlvbiBnZXRNZXRhZGF0YUtleXMoYmlvbSwgZGltZW5zaW9uPSdjb2x1bW5zJyl7XG4gICAgbGV0IGVsZW1lbnRzID0gXy5jbG9uZURlZXAoZGltZW5zaW9uID09PSAnY29sdW1ucycgPyBiaW9tLmNvbHVtbnMgOiBiaW9tLnJvd3MpXG4gICAgaWYodHlwZW9mIGVsZW1lbnRzID09PSAndW5kZWZpbmVkJyl7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgbGV0IGtleXMgPSBlbGVtZW50cy5tYXAoZWxlbWVudCA9PiBlbGVtZW50Lm1ldGFkYXRhID09PSBudWxsID8gW10gOiBPYmplY3Qua2V5cyhlbGVtZW50Lm1ldGFkYXRhKSlcbiAgICBsZXQgdW5pcUtleXMgPSBrZXlzLnJlZHVjZSgoYWNjLCB2YWwpID0+IF8udW5pcShhY2MuY29uY2F0KHZhbCkpLCBbXSlcbiAgICByZXR1cm4gdW5pcUtleXMuc29ydCgoYSxiKSA9PiBhLnRvVXBwZXJDYXNlKCkubG9jYWxlQ29tcGFyZShiLnRvVXBwZXJDYXNlKCkpKVxufVxuXG4vLyBleHBvcnQgZ2xvYmFsbHlcbndpbmRvdy5nZXRNZXRhZGF0YUtleXMgPSBnZXRNZXRhZGF0YUtleXM7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L2hlbHBlcnMvZ2V0TWV0YWRhdGFLZXlzLmpzeCIsIi8qKlxuICogU2VsZWN0cyB0aGUgYmVzdCB2ZXJuYWN1bGFyTmFtZSBmcm9tIHRoZSBvYmplY3QgcmV0dXJuZWQgYnkgdGhlIGVvbCBwYWdlcyBBUEkuXG4gKiBJdCBvbmx5IGNvbnNpZGVycyBlbmdsaXNoIG5hbWVzIChsYW5ndWFnZTogZW4pIGFuZCBwcmVmZXJlcyB0aG9zZSB3aXRoIGVvbF9wcmVmZXJyZWQ6IHRydWUuXG4gKiBUaGUgc2NpZW50aWZpY05hbWUgaXMgdXNlZCBhcyBmYWxsYmFjay5cbiAqIEBwYXJhbSBlb2xPYmplY3Qge09iamVjdH0gb2JqZWN0IHJldHVybmVkIGJ5IHRoZSBlb2wgcGFnZXMgQVBJXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBiZXN0TmFtZVxuICovXG5mdW5jdGlvbiBnZXRCZXN0VmVybmFjdWxhck5hbWVFT0woZW9sT2JqZWN0KXtcbiAgICB2YXIgYmVzdE5hbWUgPSBcIlwiO1xuICAgIGlmKHR5cGVvZiBlb2xPYmplY3Quc2NpZW50aWZpY05hbWUgIT09IFwidW5kZWZpbmVkXCIpe1xuICAgICAgICBiZXN0TmFtZSA9IGVvbE9iamVjdC5zY2llbnRpZmljTmFtZTtcbiAgICB9XG4gICAgaWYodHlwZW9mIGVvbE9iamVjdC52ZXJuYWN1bGFyTmFtZXMgIT09IFwidW5kZWZpbmVkXCIgJiYgZW9sT2JqZWN0LnZlcm5hY3VsYXJOYW1lcy5sZW5ndGggPiAwKXtcbiAgICAgICAgdmFyIHByZWZlcnJlZCA9IGZhbHNlO1xuICAgICAgICBlb2xPYmplY3QudmVybmFjdWxhck5hbWVzLmZvckVhY2goZnVuY3Rpb24odmFsdWUpe1xuICAgICAgICAgICAgaWYodmFsdWUubGFuZ3VhZ2UgPT09IFwiZW5cIil7XG4gICAgICAgICAgICAgICAgaWYodHlwZW9mIHZhbHVlLmVvbF9wcmVmZXJyZWQgIT09IFwidW5kZWZpbmVkXCIgJiYgdmFsdWUuZW9sX3ByZWZlcnJlZCl7XG4gICAgICAgICAgICAgICAgICAgIHByZWZlcnJlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJlc3ROYW1lID0gdmFsdWUudmVybmFjdWxhck5hbWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYoIXByZWZlcnJlZCl7XG4gICAgICAgICAgICAgICAgICAgIGJlc3ROYW1lID0gdmFsdWUudmVybmFjdWxhck5hbWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGJlc3ROYW1lO1xufTtcblxuLy8gZXhwb3J0IGdsb2JhbGx5XG53aW5kb3cuZ2V0QmVzdFZlcm5hY3VsYXJOYW1lRU9MID0gZ2V0QmVzdFZlcm5hY3VsYXJOYW1lRU9MO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9SZXNvdXJjZXMvY2xpZW50L2pzeC9oZWxwZXJzL29yZ2FuaXNtRGV0YWlscy5qcyJdLCJzb3VyY2VSb290IjoiIn0=