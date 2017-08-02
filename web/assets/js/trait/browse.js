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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/Resources/client/jsx/trait/browse.jsx":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("./app/Resources/client/jsx/trait/browse/interactiveTraitBrowse.jsx");
__webpack_require__("./app/Resources/client/jsx/trait/browse/interactiveTraitBrowse_behaviour.jsx");
__webpack_require__("./app/Resources/client/jsx/trait/browse/interactiveTraitBrowse_ecology.jsx");
__webpack_require__("./app/Resources/client/jsx/trait/browse/interactiveTraitBrowse_humanAndEcosystems.jsx");

/***/ }),

/***/ "./app/Resources/client/jsx/trait/browse/interactiveTraitBrowse.jsx":
/***/ (function(module, exports) {

$('document').ready(function () {
    var interactiveBrowse_overview = d3.select("#interactiveBrowse_overview");

    // ecology
    interactiveBrowse_overview.append("rect").attr("x", 680).attr("y", 90).attr("width", 600).attr("height", 200).attr("id", "ecology").attr("text", "Search for traits related to ecology").style("opacity", 0.01).style("fill", "#fff").style("cursor", "pointer")
    //        .on("mouseover", function(){
    //            add_Tooltip(d3.select(this).attr("text"));
    //        })
    .on("mouseout", function () {
        remove_Tooltip();
    }).on("click", function () {
        displayPage(d3.select(this).attr("id"));
    });

    // humanEco
    interactiveBrowse_overview.append("rect").attr("x", 500).attr("y", 430).attr("width", 600).attr("height", 280).attr("id", "humanAndEcosystems").attr("text", "Search for traits related to the relevance to humans and ecosystems").style("opacity", 0.01).style("fill", "#fff").style("cursor", "pointer")
    //        .on("mouseover", function(){
    //            add_Tooltip(d3.select(this).attr("text"));
    //        })
    .on("mouseout", function () {
        remove_Tooltip();
    }).on("click", function () {
        displayPage(d3.select(this).attr("id"));
    });

    // behaviour
    interactiveBrowse_overview.append("rect").attr("x", 350).attr("y", 30).attr("width", 300).attr("height", 250).attr("id", "behaviour").attr("text", "Search for traits related to the relevance to behaviour and life history").style("opacity", 0.01).style("fill", "#fff").style("cursor", "pointer")
    //        .on("mouseover", function(){
    //            add_Tooltip(d3.select(this).attr("text"));
    //        })
    .on("mouseout", function () {
        remove_Tooltip();
    }).on("click", function () {
        displayPage(d3.select(this).attr("id"));
    });
});

function remove_Tooltip() {
    d3.select("traitBrowseTooltip").transition().duration(10).style("opacity", 0);
}

function displayPage(name) {
    var resultPage = Routing.generate('trait_browse', { 'dbversion': '1.0', 'search_level': name });
    window.location.href = resultPage;
}

/***/ }),

/***/ "./app/Resources/client/jsx/trait/browse/interactiveTraitBrowse_behaviour.jsx":
/***/ (function(module, exports) {

$(document).ready(function () {
    d3.select("body").append("div").attr("class", "tooltip").attr("id", "traitBrowseTooltip").style("opacity", 0);

    var interactiveBrowse_behaviour = d3.select("#interactiveBrowse_behaviour");

    // bloomPeriod
    interactiveBrowse_behaviour.append("rect").attr("x", 320).attr("y", 400).attr("width", 120).attr("height", 80).attr("id", "bloom period").attr("type_cvterm_id", "438").style("opacity", 0.01).style("fill", "#fff").style("cursor", "pointer").on("click", function () {
        displayPage(d3.select(this).attr("type_cvterm_id"));
    });

    // lifeSpan
    interactiveBrowse_behaviour.append("rect").attr("x", 760).attr("y", 600).attr("width", 140).attr("height", 60).attr("id", "life span").attr("type_cvterm_id", "472").style("opacity", 0.01).style("fill", "#fff").style("cursor", "pointer").on("click", function () {
        displayPage(d3.select(this).attr("type_cvterm_id"));
    });

    // growthRate
    interactiveBrowse_behaviour.append("rect").attr("x", 350).attr("y", 600).attr("width", 160).attr("height", 40).attr("id", "growth rate").attr("type_cvterm_id", "450").style("opacity", 0.01).style("fill", "#fff").style("cursor", "pointer").on("click", function () {
        displayPage(d3.select(this).attr("type_cvterm_id"));
    });

    function displayPage(traitId) {
        var resultPage = WebRoot + "/" + DbVersion + "/trait/details/byId/" + traitId;
        $.fancybox.open({
            type: 'iframe',
            href: resultPage,
            minWidth: 1000,
            maxWidth: 1000,
            maxHeight: 800,
            minHeight: 800
        });
    }
});

/***/ }),

/***/ "./app/Resources/client/jsx/trait/browse/interactiveTraitBrowse_ecology.jsx":
/***/ (function(module, exports) {

$(document).ready(function () {
    d3.select("body").append("div").attr("class", "tooltip").attr("id", "traitBrowseTooltip").style("opacity", 0);

    var interactiveBrowse_ecology = d3.select("#interactiveBrowse_ecology");

    // habitat
    interactiveBrowse_ecology.append("rect").attr("x", 370).attr("y", 260).attr("width", 120).attr("height", 50).attr("id", "habitat").attr("type_cvterm_id", "27").style("opacity", 0.01).style("fill", "#fff").style("cursor", "pointer").on("click", function () {
        displayPage(d3.select(this).attr("type_cvterm_id"));
    });

    // shadeTolerance
    interactiveBrowse_ecology.append("rect").attr("x", 860).attr("y", 660).attr("width", 120).attr("height", 50).attr("id", "shade tolerance").attr("type_cvterm_id", "504").style("opacity", 0.01).style("fill", "#fff").style("cursor", "pointer").on("click", function () {
        displayPage(d3.select(this).attr("type_cvterm_id"));
    });

    // elevation
    interactiveBrowse_ecology.append("rect").attr("x", 450).attr("y", 10).attr("width", 120).attr("height", 50).attr("id", "elevation").attr("type_cvterm_id", "102").style("opacity", 0.01).style("fill", "#fff").style("cursor", "pointer").on("click", function () {
        displayPage(d3.select(this).attr("type_cvterm_id"));
    });

    // waterDepth
    interactiveBrowse_ecology.append("rect").attr("x", 260).attr("y", 380).attr("width", 170).attr("height", 40).attr("id", "water depth").attr("type_cvterm_id", "17").style("opacity", 0.01).style("fill", "#fff").style("cursor", "pointer").on("click", function () {
        displayPage(d3.select(this).attr("type_cvterm_id"));
    });

    // lowTmpTolerance
    interactiveBrowse_ecology.append("rect").attr("x", 30).attr("y", 50).attr("width", 200).attr("height", 80).attr("id", "low temperature tolerance").attr("type_cvterm_id", "436").style("opacity", 0.01).style("fill", "#fff").style("cursor", "pointer").on("click", function () {
        displayPage(d3.select(this).attr("type_cvterm_id"));
    });

    // calcTolerance
    interactiveBrowse_ecology.append("rect").attr("x", 680).attr("y", 80).attr("width", 180).attr("height", 70).attr("id", "calcareous soil tolerance").attr("type_cvterm_id", "492").style("opacity", 0.01).style("fill", "#fff").style("cursor", "pointer").on("click", function () {
        displayPage(d3.select(this).attr("type_cvterm_id"));
    });

    // soilDepth
    interactiveBrowse_ecology.append("rect").attr("x", 450).attr("y", 615).attr("width", 150).attr("height", 50).attr("id", "soil depth").attr("type_cvterm_id", "435").style("opacity", 0.01).style("fill", "#fff").style("cursor", "pointer").on("click", function () {
        displayPage(d3.select(this).attr("type_cvterm_id"));
    });

    function displayPage(traitId) {
        var resultPage = WebRoot + "/" + DbVersion + "/trait/details/byId/" + traitId;
        $.fancybox.open({
            type: 'iframe',
            href: resultPage,
            minWidth: 1000,
            maxWidth: 1000,
            maxHeight: 800,
            minHeight: 800
        });
    }
});

/***/ }),

/***/ "./app/Resources/client/jsx/trait/browse/interactiveTraitBrowse_humanAndEcosystems.jsx":
/***/ (function(module, exports) {

$(document).ready(function () {
    d3.select("body").append("div").attr("class", "tooltip").attr("id", "traitBrowseTooltip").style("opacity", 0);

    var interactiveBrowse_humanAndEcosystems = d3.select("#interactiveBrowse_humanAndEcosystems");

    // toxicity
    interactiveBrowse_humanAndEcosystems.append("rect").attr("x", 590).attr("y", 180).attr("width", 220).attr("height", 70).attr("id", "human/livestock toxicity").attr("type_cvterm_id", "480").style("opacity", 0.01).style("fill", "#fff").style("cursor", "pointer").on("click", function () {
        displayPage(d3.select(this).attr("type_cvterm_id"));
    });

    // plantPropMethod
    interactiveBrowse_humanAndEcosystems.append("rect").attr("x", 200).attr("y", 650).attr("width", 220).attr("height", 70).attr("id", "plant propagation method").attr("type_cvterm_id", "515").style("opacity", 0.01).style("fill", "#fff").style("cursor", "pointer").on("click", function () {
        displayPage(d3.select(this).attr("type_cvterm_id"));
    });

    // horticulture
    interactiveBrowse_humanAndEcosystems.append("rect").attr("x", 150).attr("y", 400).attr("width", 180).attr("height", 50).attr("id", "horticulture").attr("type_cvterm_id", "458").style("opacity", 0.01).style("fill", "#fff").style("cursor", "pointer").on("click", function () {
        displayPage(d3.select(this).attr("type_cvterm_id"));
    });

    // commercialAvailability
    interactiveBrowse_humanAndEcosystems.append("rect").attr("x", 250).attr("y", 60).attr("width", 180).attr("height", 70).attr("id", "commercial availability").attr("type_cvterm_id", "505").style("opacity", 0.01).style("fill", "#fff").style("cursor", "pointer").on("click", function () {
        displayPage(d3.select(this).attr("type_cvterm_id"));
    });

    // grazeAnimal
    interactiveBrowse_humanAndEcosystems.append("rect").attr("x", 820).attr("y", 540).attr("width", 160).attr("height", 80).attr("id", "graze animal palatability").attr("type_cvterm_id", "1263").style("opacity", 0.01).style("fill", "#fff").style("cursor", "pointer").on("click", function () {
        displayPage(d3.select(this).attr("type_cvterm_id"));
    });

    // grainType
    interactiveBrowse_humanAndEcosystems.append("rect").attr("x", 540).attr("y", 300).attr("width", 80).attr("height", 60).attr("id", "graze animal palatability").attr("type_cvterm_id", "528").style("opacity", 0.01).style("fill", "#fff").style("cursor", "pointer").on("click", function () {
        displayPage(d3.select(this).attr("type_cvterm_id"));
    });

    function displayPage(traitId) {
        var resultPage = WebRoot + "/" + DbVersion + "/trait/details/byId/" + traitId;
        $.fancybox.open({
            type: 'iframe',
            href: resultPage,
            minWidth: 1000,
            maxWidth: 1000,
            maxHeight: 800,
            minHeight: 800
        });
    }
});

/***/ }),

/***/ 7:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./app/Resources/client/jsx/trait/browse.jsx");


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYjFhMmE3MGM5YTAzMGJhMWIwYjkiLCJ3ZWJwYWNrOi8vLy4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L3RyYWl0L2Jyb3dzZS5qc3giLCJ3ZWJwYWNrOi8vLy4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L3RyYWl0L2Jyb3dzZS9pbnRlcmFjdGl2ZVRyYWl0QnJvd3NlLmpzeCIsIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvdHJhaXQvYnJvd3NlL2ludGVyYWN0aXZlVHJhaXRCcm93c2VfYmVoYXZpb3VyLmpzeCIsIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvdHJhaXQvYnJvd3NlL2ludGVyYWN0aXZlVHJhaXRCcm93c2VfZWNvbG9neS5qc3giLCJ3ZWJwYWNrOi8vLy4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L3RyYWl0L2Jyb3dzZS9pbnRlcmFjdGl2ZVRyYWl0QnJvd3NlX2h1bWFuQW5kRWNvc3lzdGVtcy5qc3giXSwibmFtZXMiOlsicmVxdWlyZSIsIiQiLCJyZWFkeSIsImludGVyYWN0aXZlQnJvd3NlX292ZXJ2aWV3IiwiZDMiLCJzZWxlY3QiLCJhcHBlbmQiLCJhdHRyIiwic3R5bGUiLCJvbiIsInJlbW92ZV9Ub29sdGlwIiwiZGlzcGxheVBhZ2UiLCJ0cmFuc2l0aW9uIiwiZHVyYXRpb24iLCJuYW1lIiwicmVzdWx0UGFnZSIsIlJvdXRpbmciLCJnZW5lcmF0ZSIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsImRvY3VtZW50IiwiaW50ZXJhY3RpdmVCcm93c2VfYmVoYXZpb3VyIiwidHJhaXRJZCIsIldlYlJvb3QiLCJEYlZlcnNpb24iLCJmYW5jeWJveCIsIm9wZW4iLCJ0eXBlIiwibWluV2lkdGgiLCJtYXhXaWR0aCIsIm1heEhlaWdodCIsIm1pbkhlaWdodCIsImludGVyYWN0aXZlQnJvd3NlX2Vjb2xvZ3kiLCJpbnRlcmFjdGl2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aEIsQ0FBcUIsZ0JBQXJCLENBQVo7QUFDSCxLQVpUOztBQWNBLGFBQVNJLFdBQVQsQ0FBcUJZLE9BQXJCLEVBQTZCO0FBQ3pCLFlBQUlSLGFBQWNTLFVBQVEsR0FBUixHQUFZQyxTQUFaLEdBQXNCLHNCQUF0QixHQUE2Q0YsT0FBL0Q7QUFDQXRCLFVBQUV5QixRQUFGLENBQVdDLElBQVgsQ0FBZ0I7QUFDYkMsa0JBQU0sUUFETztBQUViUixrQkFBTUwsVUFGTztBQUdiYyxzQkFBVSxJQUhHO0FBSVpDLHNCQUFVLElBSkU7QUFLWkMsdUJBQVcsR0FMQztBQU1aQyx1QkFBVztBQU5DLFNBQWhCO0FBUUg7QUFDSixDQTdHRCxFIiwiZmlsZSI6InRyYWl0L2Jyb3dzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9qcy9cIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA3KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBiMWEyYTcwYzlhMDMwYmExYjBiOSIsInJlcXVpcmUoJy4vYnJvd3NlL2ludGVyYWN0aXZlVHJhaXRCcm93c2UuanN4JylcbnJlcXVpcmUoJy4vYnJvd3NlL2ludGVyYWN0aXZlVHJhaXRCcm93c2VfYmVoYXZpb3VyLmpzeCcpXG5yZXF1aXJlKCcuL2Jyb3dzZS9pbnRlcmFjdGl2ZVRyYWl0QnJvd3NlX2Vjb2xvZ3kuanN4JylcbnJlcXVpcmUoJy4vYnJvd3NlL2ludGVyYWN0aXZlVHJhaXRCcm93c2VfaHVtYW5BbmRFY29zeXN0ZW1zLmpzeCcpXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L3RyYWl0L2Jyb3dzZS5qc3giLCIkKCdkb2N1bWVudCcpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgdmFyIGludGVyYWN0aXZlQnJvd3NlX292ZXJ2aWV3ID0gZDMuc2VsZWN0KFwiI2ludGVyYWN0aXZlQnJvd3NlX292ZXJ2aWV3XCIpO1xuXG4gICAgLy8gZWNvbG9neVxuICAgIGludGVyYWN0aXZlQnJvd3NlX292ZXJ2aWV3LmFwcGVuZChcInJlY3RcIilcbiAgICAgICAgLmF0dHIoXCJ4XCIsIDY4MClcbiAgICAgICAgLmF0dHIoXCJ5XCIsIDkwKVxuICAgICAgICAuYXR0cihcIndpZHRoXCIsIDYwMClcbiAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgMjAwKVxuICAgICAgICAuYXR0cihcImlkXCIsIFwiZWNvbG9neVwiKVxuICAgICAgICAuYXR0cihcInRleHRcIiwgXCJTZWFyY2ggZm9yIHRyYWl0cyByZWxhdGVkIHRvIGVjb2xvZ3lcIilcbiAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwLjAxKVxuICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIFwiI2ZmZlwiKVxuICAgICAgICAuc3R5bGUoXCJjdXJzb3JcIiwgXCJwb2ludGVyXCIpXG4vLyAgICAgICAgLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uKCl7XG4vLyAgICAgICAgICAgIGFkZF9Ub29sdGlwKGQzLnNlbGVjdCh0aGlzKS5hdHRyKFwidGV4dFwiKSk7XG4vLyAgICAgICAgfSlcbiAgICAgICAgLm9uKFwibW91c2VvdXRcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJlbW92ZV9Ub29sdGlwKCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBkaXNwbGF5UGFnZShkMy5zZWxlY3QodGhpcykuYXR0cihcImlkXCIpKTtcbiAgICAgICAgfSk7XG5cbiAgICAvLyBodW1hbkVjb1xuICAgIGludGVyYWN0aXZlQnJvd3NlX292ZXJ2aWV3LmFwcGVuZChcInJlY3RcIilcbiAgICAgICAgLmF0dHIoXCJ4XCIsIDUwMClcbiAgICAgICAgLmF0dHIoXCJ5XCIsIDQzMClcbiAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCA2MDApXG4gICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIDI4MClcbiAgICAgICAgLmF0dHIoXCJpZFwiLCBcImh1bWFuQW5kRWNvc3lzdGVtc1wiKVxuICAgICAgICAuYXR0cihcInRleHRcIiwgXCJTZWFyY2ggZm9yIHRyYWl0cyByZWxhdGVkIHRvIHRoZSByZWxldmFuY2UgdG8gaHVtYW5zIGFuZCBlY29zeXN0ZW1zXCIpXG4gICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMC4wMSlcbiAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBcIiNmZmZcIilcbiAgICAgICAgLnN0eWxlKFwiY3Vyc29yXCIsIFwicG9pbnRlclwiKVxuLy8gICAgICAgIC5vbihcIm1vdXNlb3ZlclwiLCBmdW5jdGlvbigpe1xuLy8gICAgICAgICAgICBhZGRfVG9vbHRpcChkMy5zZWxlY3QodGhpcykuYXR0cihcInRleHRcIikpO1xuLy8gICAgICAgIH0pXG4gICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZW1vdmVfVG9vbHRpcCgpO1xuICAgICAgICB9KVxuICAgICAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgZGlzcGxheVBhZ2UoZDMuc2VsZWN0KHRoaXMpLmF0dHIoXCJpZFwiKSk7XG4gICAgICAgIH0pO1xuXG4gICAgLy8gYmVoYXZpb3VyXG4gICAgaW50ZXJhY3RpdmVCcm93c2Vfb3ZlcnZpZXcuYXBwZW5kKFwicmVjdFwiKVxuICAgICAgICAuYXR0cihcInhcIiwgMzUwKVxuICAgICAgICAuYXR0cihcInlcIiwgMzApXG4gICAgICAgIC5hdHRyKFwid2lkdGhcIiwgMzAwKVxuICAgICAgICAuYXR0cihcImhlaWdodFwiLCAyNTApXG4gICAgICAgIC5hdHRyKFwiaWRcIiwgXCJiZWhhdmlvdXJcIilcbiAgICAgICAgLmF0dHIoXCJ0ZXh0XCIsIFwiU2VhcmNoIGZvciB0cmFpdHMgcmVsYXRlZCB0byB0aGUgcmVsZXZhbmNlIHRvIGJlaGF2aW91ciBhbmQgbGlmZSBoaXN0b3J5XCIpXG4gICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMC4wMSlcbiAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBcIiNmZmZcIilcbiAgICAgICAgLnN0eWxlKFwiY3Vyc29yXCIsIFwicG9pbnRlclwiKVxuLy8gICAgICAgIC5vbihcIm1vdXNlb3ZlclwiLCBmdW5jdGlvbigpe1xuLy8gICAgICAgICAgICBhZGRfVG9vbHRpcChkMy5zZWxlY3QodGhpcykuYXR0cihcInRleHRcIikpO1xuLy8gICAgICAgIH0pXG4gICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZW1vdmVfVG9vbHRpcCgpO1xuICAgICAgICB9KVxuICAgICAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgZGlzcGxheVBhZ2UoZDMuc2VsZWN0KHRoaXMpLmF0dHIoXCJpZFwiKSk7XG4gICAgICAgIH0pO1xufSk7XG5cbmZ1bmN0aW9uIHJlbW92ZV9Ub29sdGlwKCl7XG4gICAgZDMuc2VsZWN0KFwidHJhaXRCcm93c2VUb29sdGlwXCIpLnRyYW5zaXRpb24oKVxuICAgICAgICAuZHVyYXRpb24oMTApXG4gICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMCk7XG59XG5cbmZ1bmN0aW9uIGRpc3BsYXlQYWdlKG5hbWUpe1xuICAgIHZhciByZXN1bHRQYWdlID0gIFJvdXRpbmcuZ2VuZXJhdGUoJ3RyYWl0X2Jyb3dzZScsIHsnZGJ2ZXJzaW9uJzogJzEuMCcsICdzZWFyY2hfbGV2ZWwnOiBuYW1lfSk7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSByZXN1bHRQYWdlO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L3RyYWl0L2Jyb3dzZS9pbnRlcmFjdGl2ZVRyYWl0QnJvd3NlLmpzeCIsIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgZDMuc2VsZWN0KFwiYm9keVwiKS5hcHBlbmQoXCJkaXZcIilcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJ0b29sdGlwXCIpXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIFwidHJhaXRCcm93c2VUb29sdGlwXCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xuXG4gICAgdmFyIGludGVyYWN0aXZlQnJvd3NlX2JlaGF2aW91ciA9IGQzLnNlbGVjdChcIiNpbnRlcmFjdGl2ZUJyb3dzZV9iZWhhdmlvdXJcIik7XG5cbiAgICAvLyBibG9vbVBlcmlvZFxuICAgIGludGVyYWN0aXZlQnJvd3NlX2JlaGF2aW91ci5hcHBlbmQoXCJyZWN0XCIpXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgMzIwKVxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIDQwMClcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgMTIwKVxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgODApXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIFwiYmxvb20gcGVyaW9kXCIpXG4gICAgICAgICAgICAuYXR0cihcInR5cGVfY3Z0ZXJtX2lkXCIsIFwiNDM4XCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDAuMDEpXG4gICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIFwiI2ZmZlwiKVxuICAgICAgICAgICAgLnN0eWxlKFwiY3Vyc29yXCIsIFwicG9pbnRlclwiKVxuICAgICAgICAgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBkaXNwbGF5UGFnZShkMy5zZWxlY3QodGhpcykuYXR0cihcInR5cGVfY3Z0ZXJtX2lkXCIpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgLy8gbGlmZVNwYW5cbiAgICBpbnRlcmFjdGl2ZUJyb3dzZV9iZWhhdmlvdXIuYXBwZW5kKFwicmVjdFwiKVxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDc2MClcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCA2MDApXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIDE0MClcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIDYwKVxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcImxpZmUgc3BhblwiKVxuICAgICAgICAgICAgLmF0dHIoXCJ0eXBlX2N2dGVybV9pZFwiLCBcIjQ3MlwiKVxuICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwLjAxKVxuICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBcIiNmZmZcIilcbiAgICAgICAgICAgIC5zdHlsZShcImN1cnNvclwiLCBcInBvaW50ZXJcIilcbiAgICAgICAgICAgIC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgZGlzcGxheVBhZ2UoZDMuc2VsZWN0KHRoaXMpLmF0dHIoXCJ0eXBlX2N2dGVybV9pZFwiKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgIC8vIGdyb3d0aFJhdGVcbiAgICBpbnRlcmFjdGl2ZUJyb3dzZV9iZWhhdmlvdXIuYXBwZW5kKFwicmVjdFwiKVxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDM1MClcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCA2MDApXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIDE2MClcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIDQwKVxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcImdyb3d0aCByYXRlXCIpXG4gICAgICAgICAgICAuYXR0cihcInR5cGVfY3Z0ZXJtX2lkXCIsIFwiNDUwXCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDAuMDEpXG4gICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIFwiI2ZmZlwiKVxuICAgICAgICAgICAgLnN0eWxlKFwiY3Vyc29yXCIsIFwicG9pbnRlclwiKVxuICAgICAgICAgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBkaXNwbGF5UGFnZShkMy5zZWxlY3QodGhpcykuYXR0cihcInR5cGVfY3Z0ZXJtX2lkXCIpKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gZGlzcGxheVBhZ2UodHJhaXRJZCl7XG4gICAgICAgIHZhciByZXN1bHRQYWdlID0gIFdlYlJvb3QrXCIvXCIrRGJWZXJzaW9uK1wiL3RyYWl0L2RldGFpbHMvYnlJZC9cIit0cmFpdElkO1xuICAgICAgICAkLmZhbmN5Ym94Lm9wZW4oe1xuICAgICAgICAgICB0eXBlOiAnaWZyYW1lJyxcbiAgICAgICAgICAgaHJlZjogcmVzdWx0UGFnZSxcbiAgICAgICAgICAgbWluV2lkdGg6IDEwMDAsXG4gICAgICAgICAgICBtYXhXaWR0aDogMTAwMCxcbiAgICAgICAgICAgIG1heEhlaWdodDogODAwLFxuICAgICAgICAgICAgbWluSGVpZ2h0OiA4MDBcbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvdHJhaXQvYnJvd3NlL2ludGVyYWN0aXZlVHJhaXRCcm93c2VfYmVoYXZpb3VyLmpzeCIsIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgZDMuc2VsZWN0KFwiYm9keVwiKS5hcHBlbmQoXCJkaXZcIilcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJ0b29sdGlwXCIpXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIFwidHJhaXRCcm93c2VUb29sdGlwXCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDApO1xuXG4gICAgdmFyIGludGVyYWN0aXZlQnJvd3NlX2Vjb2xvZ3kgPSBkMy5zZWxlY3QoXCIjaW50ZXJhY3RpdmVCcm93c2VfZWNvbG9neVwiKTtcblxuICAgIC8vIGhhYml0YXRcbiAgICBpbnRlcmFjdGl2ZUJyb3dzZV9lY29sb2d5LmFwcGVuZChcInJlY3RcIilcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCAzNzApXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgMjYwKVxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCAxMjApXG4gICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCA1MClcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgXCJoYWJpdGF0XCIpXG4gICAgICAgICAgICAuYXR0cihcInR5cGVfY3Z0ZXJtX2lkXCIsIFwiMjdcIilcbiAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMC4wMSlcbiAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgXCIjZmZmXCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJjdXJzb3JcIiwgXCJwb2ludGVyXCIpXG4gICAgICAgICAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGRpc3BsYXlQYWdlKGQzLnNlbGVjdCh0aGlzKS5hdHRyKFwidHlwZV9jdnRlcm1faWRcIikpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAvLyBzaGFkZVRvbGVyYW5jZVxuICAgIGludGVyYWN0aXZlQnJvd3NlX2Vjb2xvZ3kuYXBwZW5kKFwicmVjdFwiKVxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDg2MClcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCA2NjApXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIDEyMClcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIDUwKVxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcInNoYWRlIHRvbGVyYW5jZVwiKVxuICAgICAgICAgICAgLmF0dHIoXCJ0eXBlX2N2dGVybV9pZFwiLCBcIjUwNFwiKVxuICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwLjAxKVxuICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBcIiNmZmZcIilcbiAgICAgICAgICAgIC5zdHlsZShcImN1cnNvclwiLCBcInBvaW50ZXJcIilcbiAgICAgICAgICAgIC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgZGlzcGxheVBhZ2UoZDMuc2VsZWN0KHRoaXMpLmF0dHIoXCJ0eXBlX2N2dGVybV9pZFwiKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgIC8vIGVsZXZhdGlvblxuICAgIGludGVyYWN0aXZlQnJvd3NlX2Vjb2xvZ3kuYXBwZW5kKFwicmVjdFwiKVxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDQ1MClcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAxMClcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgMTIwKVxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgNTApXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIFwiZWxldmF0aW9uXCIpXG4gICAgICAgICAgICAuYXR0cihcInR5cGVfY3Z0ZXJtX2lkXCIsIFwiMTAyXCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDAuMDEpXG4gICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIFwiI2ZmZlwiKVxuICAgICAgICAgICAgLnN0eWxlKFwiY3Vyc29yXCIsIFwicG9pbnRlclwiKVxuICAgICAgICAgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBkaXNwbGF5UGFnZShkMy5zZWxlY3QodGhpcykuYXR0cihcInR5cGVfY3Z0ZXJtX2lkXCIpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgLy8gd2F0ZXJEZXB0aFxuICAgIGludGVyYWN0aXZlQnJvd3NlX2Vjb2xvZ3kuYXBwZW5kKFwicmVjdFwiKVxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDI2MClcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAzODApXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIDE3MClcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIDQwKVxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcIndhdGVyIGRlcHRoXCIpXG4gICAgICAgICAgICAuYXR0cihcInR5cGVfY3Z0ZXJtX2lkXCIsIFwiMTdcIilcbiAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMC4wMSlcbiAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgXCIjZmZmXCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJjdXJzb3JcIiwgXCJwb2ludGVyXCIpXG4gICAgICAgICAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGRpc3BsYXlQYWdlKGQzLnNlbGVjdCh0aGlzKS5hdHRyKFwidHlwZV9jdnRlcm1faWRcIikpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAvLyBsb3dUbXBUb2xlcmFuY2VcbiAgICBpbnRlcmFjdGl2ZUJyb3dzZV9lY29sb2d5LmFwcGVuZChcInJlY3RcIilcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCAzMClcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCA1MClcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgMjAwKVxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgODApXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIFwibG93IHRlbXBlcmF0dXJlIHRvbGVyYW5jZVwiKVxuICAgICAgICAgICAgLmF0dHIoXCJ0eXBlX2N2dGVybV9pZFwiLCBcIjQzNlwiKVxuICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwLjAxKVxuICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBcIiNmZmZcIilcbiAgICAgICAgICAgIC5zdHlsZShcImN1cnNvclwiLCBcInBvaW50ZXJcIilcbiAgICAgICAgICAgIC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgZGlzcGxheVBhZ2UoZDMuc2VsZWN0KHRoaXMpLmF0dHIoXCJ0eXBlX2N2dGVybV9pZFwiKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgIC8vIGNhbGNUb2xlcmFuY2VcbiAgICBpbnRlcmFjdGl2ZUJyb3dzZV9lY29sb2d5LmFwcGVuZChcInJlY3RcIilcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCA2ODApXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgODApXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIDE4MClcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIDcwKVxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcImNhbGNhcmVvdXMgc29pbCB0b2xlcmFuY2VcIilcbiAgICAgICAgICAgIC5hdHRyKFwidHlwZV9jdnRlcm1faWRcIiwgXCI0OTJcIilcbiAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMC4wMSlcbiAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgXCIjZmZmXCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJjdXJzb3JcIiwgXCJwb2ludGVyXCIpXG4gICAgICAgICAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGRpc3BsYXlQYWdlKGQzLnNlbGVjdCh0aGlzKS5hdHRyKFwidHlwZV9jdnRlcm1faWRcIikpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAvLyBzb2lsRGVwdGhcbiAgICBpbnRlcmFjdGl2ZUJyb3dzZV9lY29sb2d5LmFwcGVuZChcInJlY3RcIilcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCA0NTApXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgNjE1KVxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCAxNTApXG4gICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCA1MClcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgXCJzb2lsIGRlcHRoXCIpXG4gICAgICAgICAgICAuYXR0cihcInR5cGVfY3Z0ZXJtX2lkXCIsIFwiNDM1XCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDAuMDEpXG4gICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIFwiI2ZmZlwiKVxuICAgICAgICAgICAgLnN0eWxlKFwiY3Vyc29yXCIsIFwicG9pbnRlclwiKVxuICAgICAgICAgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBkaXNwbGF5UGFnZShkMy5zZWxlY3QodGhpcykuYXR0cihcInR5cGVfY3Z0ZXJtX2lkXCIpKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gZGlzcGxheVBhZ2UodHJhaXRJZCl7XG4gICAgICAgIHZhciByZXN1bHRQYWdlID0gIFdlYlJvb3QrXCIvXCIrRGJWZXJzaW9uK1wiL3RyYWl0L2RldGFpbHMvYnlJZC9cIit0cmFpdElkO1xuICAgICAgICAkLmZhbmN5Ym94Lm9wZW4oe1xuICAgICAgICAgICB0eXBlOiAnaWZyYW1lJyxcbiAgICAgICAgICAgaHJlZjogcmVzdWx0UGFnZSxcbiAgICAgICAgICAgbWluV2lkdGg6IDEwMDAsXG4gICAgICAgICAgICBtYXhXaWR0aDogMTAwMCxcbiAgICAgICAgICAgIG1heEhlaWdodDogODAwLFxuICAgICAgICAgICAgbWluSGVpZ2h0OiA4MDBcbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvdHJhaXQvYnJvd3NlL2ludGVyYWN0aXZlVHJhaXRCcm93c2VfZWNvbG9neS5qc3giLCIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgIGQzLnNlbGVjdChcImJvZHlcIikuYXBwZW5kKFwiZGl2XCIpXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwidG9vbHRpcFwiKVxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcInRyYWl0QnJvd3NlVG9vbHRpcFwiKVxuICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwKTtcblxuICAgIHZhciBpbnRlcmFjdGl2ZUJyb3dzZV9odW1hbkFuZEVjb3N5c3RlbXMgPSBkMy5zZWxlY3QoXCIjaW50ZXJhY3RpdmVCcm93c2VfaHVtYW5BbmRFY29zeXN0ZW1zXCIpO1xuXG4gICAgLy8gdG94aWNpdHlcbiAgICBpbnRlcmFjdGl2ZUJyb3dzZV9odW1hbkFuZEVjb3N5c3RlbXMuYXBwZW5kKFwicmVjdFwiKVxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDU5MClcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAxODApXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIDIyMClcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIDcwKVxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcImh1bWFuL2xpdmVzdG9jayB0b3hpY2l0eVwiKVxuICAgICAgICAgICAgLmF0dHIoXCJ0eXBlX2N2dGVybV9pZFwiLCBcIjQ4MFwiKVxuICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAwLjAxKVxuICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBcIiNmZmZcIilcbiAgICAgICAgICAgIC5zdHlsZShcImN1cnNvclwiLCBcInBvaW50ZXJcIilcbiAgICAgICAgICAgIC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgZGlzcGxheVBhZ2UoZDMuc2VsZWN0KHRoaXMpLmF0dHIoXCJ0eXBlX2N2dGVybV9pZFwiKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgIC8vIHBsYW50UHJvcE1ldGhvZFxuICAgIGludGVyYWN0aXZlQnJvd3NlX2h1bWFuQW5kRWNvc3lzdGVtcy5hcHBlbmQoXCJyZWN0XCIpXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgMjAwKVxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIDY1MClcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgMjIwKVxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgNzApXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIFwicGxhbnQgcHJvcGFnYXRpb24gbWV0aG9kXCIpXG4gICAgICAgICAgICAuYXR0cihcInR5cGVfY3Z0ZXJtX2lkXCIsIFwiNTE1XCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDAuMDEpXG4gICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIFwiI2ZmZlwiKVxuICAgICAgICAgICAgLnN0eWxlKFwiY3Vyc29yXCIsIFwicG9pbnRlclwiKVxuICAgICAgICAgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBkaXNwbGF5UGFnZShkMy5zZWxlY3QodGhpcykuYXR0cihcInR5cGVfY3Z0ZXJtX2lkXCIpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgLy8gaG9ydGljdWx0dXJlXG4gICAgaW50ZXJhY3RpdmVCcm93c2VfaHVtYW5BbmRFY29zeXN0ZW1zLmFwcGVuZChcInJlY3RcIilcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCAxNTApXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgNDAwKVxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCAxODApXG4gICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCA1MClcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgXCJob3J0aWN1bHR1cmVcIilcbiAgICAgICAgICAgIC5hdHRyKFwidHlwZV9jdnRlcm1faWRcIiwgXCI0NThcIilcbiAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMC4wMSlcbiAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgXCIjZmZmXCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJjdXJzb3JcIiwgXCJwb2ludGVyXCIpXG4gICAgICAgICAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGRpc3BsYXlQYWdlKGQzLnNlbGVjdCh0aGlzKS5hdHRyKFwidHlwZV9jdnRlcm1faWRcIikpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAvLyBjb21tZXJjaWFsQXZhaWxhYmlsaXR5XG4gICAgaW50ZXJhY3RpdmVCcm93c2VfaHVtYW5BbmRFY29zeXN0ZW1zLmFwcGVuZChcInJlY3RcIilcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCAyNTApXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgNjApXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIDE4MClcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIDcwKVxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcImNvbW1lcmNpYWwgYXZhaWxhYmlsaXR5XCIpXG4gICAgICAgICAgICAuYXR0cihcInR5cGVfY3Z0ZXJtX2lkXCIsIFwiNTA1XCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDAuMDEpXG4gICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIFwiI2ZmZlwiKVxuICAgICAgICAgICAgLnN0eWxlKFwiY3Vyc29yXCIsIFwicG9pbnRlclwiKVxuICAgICAgICAgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBkaXNwbGF5UGFnZShkMy5zZWxlY3QodGhpcykuYXR0cihcInR5cGVfY3Z0ZXJtX2lkXCIpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgLy8gZ3JhemVBbmltYWxcbiAgICBpbnRlcmFjdGl2ZUJyb3dzZV9odW1hbkFuZEVjb3N5c3RlbXMuYXBwZW5kKFwicmVjdFwiKVxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDgyMClcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCA1NDApXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIDE2MClcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIDgwKVxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcImdyYXplIGFuaW1hbCBwYWxhdGFiaWxpdHlcIilcbiAgICAgICAgICAgIC5hdHRyKFwidHlwZV9jdnRlcm1faWRcIiwgXCIxMjYzXCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDAuMDEpXG4gICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIFwiI2ZmZlwiKVxuICAgICAgICAgICAgLnN0eWxlKFwiY3Vyc29yXCIsIFwicG9pbnRlclwiKVxuICAgICAgICAgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBkaXNwbGF5UGFnZShkMy5zZWxlY3QodGhpcykuYXR0cihcInR5cGVfY3Z0ZXJtX2lkXCIpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgLy8gZ3JhaW5UeXBlXG4gICAgaW50ZXJhY3RpdmVCcm93c2VfaHVtYW5BbmRFY29zeXN0ZW1zLmFwcGVuZChcInJlY3RcIilcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCA1NDApXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgMzAwKVxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCA4MClcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIDYwKVxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcImdyYXplIGFuaW1hbCBwYWxhdGFiaWxpdHlcIilcbiAgICAgICAgICAgIC5hdHRyKFwidHlwZV9jdnRlcm1faWRcIiwgXCI1MjhcIilcbiAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMC4wMSlcbiAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgXCIjZmZmXCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJjdXJzb3JcIiwgXCJwb2ludGVyXCIpXG4gICAgICAgICAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGRpc3BsYXlQYWdlKGQzLnNlbGVjdCh0aGlzKS5hdHRyKFwidHlwZV9jdnRlcm1faWRcIikpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICBmdW5jdGlvbiBkaXNwbGF5UGFnZSh0cmFpdElkKXtcbiAgICAgICAgdmFyIHJlc3VsdFBhZ2UgPSAgV2ViUm9vdCtcIi9cIitEYlZlcnNpb24rXCIvdHJhaXQvZGV0YWlscy9ieUlkL1wiK3RyYWl0SWQ7XG4gICAgICAgICQuZmFuY3lib3gub3Blbih7XG4gICAgICAgICAgIHR5cGU6ICdpZnJhbWUnLFxuICAgICAgICAgICBocmVmOiByZXN1bHRQYWdlLFxuICAgICAgICAgICBtaW5XaWR0aDogMTAwMCxcbiAgICAgICAgICAgIG1heFdpZHRoOiAxMDAwLFxuICAgICAgICAgICAgbWF4SGVpZ2h0OiA4MDAsXG4gICAgICAgICAgICBtaW5IZWlnaHQ6IDgwMFxuICAgICAgICB9KTtcbiAgICB9XG59KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9SZXNvdXJjZXMvY2xpZW50L2pzeC90cmFpdC9icm93c2UvaW50ZXJhY3RpdmVUcmFpdEJyb3dzZV9odW1hbkFuZEVjb3N5c3RlbXMuanN4Il0sInNvdXJjZVJvb3QiOiIifQ==