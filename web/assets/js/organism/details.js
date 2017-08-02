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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/Resources/client/jsx/organism/details.jsx":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("./app/Resources/client/jsx/organism/details/appendTraits.jsx");
__webpack_require__("./app/Resources/client/jsx/organism/details/eol.jsx");

/***/ }),

/***/ "./app/Resources/client/jsx/organism/details/appendTraits.jsx":
/***/ (function(module, exports) {

/**
 * Created by s216121 on 14.03.17.
 */

function appendTraitEntries(domElement, traitEntries, traitFormat) {
    $.ajax({
        url: Routing.generate('api', { 'namespace': 'details', 'classname': 'TraitEntries' }),
        data: {
            "dbversion": dbversion,
            "trait_entry_ids": traitEntries,
            "trait_format": traitFormat
        },
        method: "GET",
        success: function (result) {
            $.each(result, function (key, value) {
                var realValue = value.value;
                if (value.value === null) {
                    realValue = value.value_definition;
                }
                let unitString = "";
                if (value.unit != null) {
                    unitString = " $" + value.unit + "$";
                }
                let traitCitationDiv = $('<div class="trait-citation">').text(value.citation).css({ 'font-size': '11px' });
                let originUrl = $(`<a href="${value.origin_url}">`).text(" origin");
                if (value.origin_url != "") {
                    traitCitationDiv.append(originUrl);
                }
                domElement.append($('<div>').text(realValue + unitString).append(traitCitationDiv));
            });
        }
    });
}

/***/ }),

/***/ "./app/Resources/client/jsx/organism/details/eol.jsx":
/***/ (function(module, exports) {

/**
 * Created by s216121 on 14.03.17.
 */
$('document').ready(function () {
    let img_template = '<a class="thumbnail" href="<%= href %>"><img src="<%= src %>"/></a><a href="<%= source %>"><div><%= rights %> <%= license %></div></a>';
    let txt_template = '<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title"><%= title %></h3><a href="<%= href %>"><%= rights %> <%= license %></a></div><div class="panel-body"><%= body %></div></div>';
    $.ajax({
        method: "GET",
        url: "http://eol.org/api/pages/1.0.json",
        data: {
            id: eol_id,
            batch: false,
            images_per_page: 3,
            images_page: 1,
            videos_per_page: 0,
            videos_page: 1,
            sounds_per_page: 0,
            sounds_page: 1,
            maps_per_page: 0,
            maps_page: 1,
            texts_per_page: 3,
            texts_page: 1,
            iucn: true,
            subjects: "overview",
            licenses: "cc-by|cc-by-nc|cc-by-sa|cc-by-nc-sa|pd",
            details: true,
            common_names: true,
            synonyms: true,
            references: true,
            taxonomy: true,
            vetted: 0,
            cache_ttl: 60,
            language: "en"
        },
        success: function (result) {
            console.log(result);
            $.each(result["dataObjects"], function (dob) {
                if (result["dataObjects"][dob]["dataType"] === "http://purl.org/dc/dcmitype/StillImage") {
                    let url = result["dataObjects"][dob]["eolMediaURL"];
                    let license = result["dataObjects"][dob]["license"];
                    let rights = result["dataObjects"][dob]["rights"];
                    if (typeof rights === 'undefined') {
                        rights = "(c)" + result["dataObjects"][dob]["rightsHolder"];
                    }
                    let source = result["dataObjects"][dob]["source"];
                    let img_element = _.template(img_template)({ src: url, href: url, license: license, rights: rights, source: source });
                    $('#organism-img-column').append(img_element);
                }
                if (result["dataObjects"][dob]["dataType"] === "http://purl.org/dc/dcmitype/Text") {
                    let title = result["dataObjects"][dob]["title"];
                    let body = result["dataObjects"][dob]["description"];
                    let url = result["dataObjects"][dob]["source"];
                    let license = result["dataObjects"][dob]["license"];
                    let rights = result["dataObjects"][dob]["rights"];
                    if (typeof rights === 'undefined') {
                        rights = "(c)" + result["dataObjects"][dob]["rightsHolder"];
                    }
                    let txt_element = _.template(txt_template)({ title: title, body: body, href: url, rights: rights, license: license });
                    $('#organism-txt-column').append(txt_element);
                }
            });
            $("#vernacularName").text(getBestVernacularNameEOL(result));
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showMessageDialog(errorThrown, 'danger');
        }
    }).always(function () {
        $('#loading-progress').empty();
    });
    $("#toggleCitationButton").on("click", function () {
        $(".trait-citation").toggle();
    });
});

/***/ }),

/***/ 5:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./app/Resources/client/jsx/organism/details.jsx");


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYjFhMmE3MGM5YTAzMGJhMWIwYjkiLCJ3ZWJwYWNrOi8vLy4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L29yZ2FuaXNtL2RldGFpbHMuanN4Iiwid2VicGFjazovLy8uL2FwcC9SZXNvdXJjZXMvY2xpZW50L2pzeC9vcmdhbmlzbS9kZXRhaWxzL2FwcGVuZFRyYWl0cy5qc3giLCJ3ZWJwYWNrOi8vLy4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L29yZ2FuaXNtL2RldGFpbHMvZW9sLmpzeCJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiYXBwZW5kVHJhaXRFbnRyaWVzIiwiZG9tRWxlbWVudCIsInRyYWl0RW50cmllcyIsInRyYWl0Rm9ybWF0IiwiJCIsImFqYXgiLCJ1cmwiLCJSb3V0aW5nIiwiZ2VuZXJhdGUiLCJkYXRhIiwiZGJ2ZXJzaW9uIiwibWV0aG9kIiwic3VjY2VzcyIsInJlc3VsdCIsImVhY2giLCJrZXkiLCJ2YWx1ZSIsInJlYWxWYWx1ZSIsInZhbHVlX2RlZmluaXRpb24iLCJ1bml0U3RyaW5nIiwidW5pdCIsInRyYWl0Q2l0YXRpb25EaXYiLCJ0ZXh0IiwiY2l0YXRpb24iLCJjc3MiLCJvcmlnaW5VcmwiLCJvcmlnaW5fdXJsIiwiYXBwZW5kIiwicmVhZHkiLCJpbWdfdGVtcGxhdGUiLCJ0eHRfdGVtcGxhdGUiLCJpZCIsImVvbF9pZCIsImJhdGNoIiwiaW1hZ2VzX3Blcl9wYWdlIiwiaW1hZ2VzX3BhZ2UiLCJ2aWRlb3NfcGVyX3BhZ2UiLCJ2aWRlb3NfcGFnZSIsInNvdW5kc19wZXJfcGFnZSIsInNvdW5kc19wYWdlIiwibWFwc19wZXJfcGFnZSIsIm1hcHNfcGFnZSIsInRleHRzX3Blcl9wYWdlIiwidGV4dHNfcGFnZSIsIml1Y24iLCJzdWJqZWN0cyIsImxpY2Vuc2VzIiwiZGV0YWlscyIsImNvbW1vbl9uYW1lcyIsInN5bm9ueW1zIiwicmVmZXJlbmNlcyIsInRheG9ub215IiwidmV0dGVkIiwiY2FjaGVfdHRsIiwibGFuZ3VhZ2UiLCJjb25zb2xlIiwibG9nIiwiZG9iIiwibGljZW5zZSIsInJpZ2h0cyIsInNvdXJjZSIsImltZ19lbGVtZW50IiwiXyIsInRlbXBsYXRlIiwic3JjIiwiaHJlZiIsInRpdGxlIiwiYm9keSIsInR4dF9lbGVtZW50IiwiZ2V0QmVzdFZlcm5hY3VsYXJOYW1lRU9MIiwiZXJyb3IiLCJqcVhIUiIsInRleHRTdGF0dXMiLCJlcnJvclRocm93biIsInNob3dNZXNzYWdlRGlhbG9nIiwiYWx3YXlzIiwiZW1wdHkiLCJvbiIsInRvZ2dsZSJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7OztBQzdEQSxtQkFBQUEsQ0FBUSw4REFBUjtBQUNBLG1CQUFBQSxDQUFRLHFEQUFSLEU7Ozs7Ozs7QUNEQTs7OztBQUlBLFNBQVNDLGtCQUFULENBQTRCQyxVQUE1QixFQUF3Q0MsWUFBeEMsRUFBc0RDLFdBQXRELEVBQWtFO0FBQzlEQyxNQUFFQyxJQUFGLENBQU87QUFDSEMsYUFBS0MsUUFBUUMsUUFBUixDQUFpQixLQUFqQixFQUF3QixFQUFDLGFBQWEsU0FBZCxFQUF5QixhQUFhLGNBQXRDLEVBQXhCLENBREY7QUFFSEMsY0FBTTtBQUNGLHlCQUFhQyxTQURYO0FBRUYsK0JBQW1CUixZQUZqQjtBQUdGLDRCQUFnQkM7QUFIZCxT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QXRELHNCQUFFLHNCQUFGLEVBQTBCdUIsTUFBMUIsQ0FBaUN5QyxXQUFqQztBQUNIO0FBQ0osYUF4QkQ7QUF5QkFoRSxjQUFFLGlCQUFGLEVBQXFCa0IsSUFBckIsQ0FBMEIrQyx5QkFBeUJ4RCxNQUF6QixDQUExQjtBQUNILFNBeERFO0FBeURIeUQsZUFBTyxVQUFVQyxLQUFWLEVBQWlCQyxVQUFqQixFQUE2QkMsV0FBN0IsRUFBMEM7QUFDN0NDLDhCQUFrQkQsV0FBbEIsRUFBK0IsUUFBL0I7QUFDSDtBQTNERSxLQUFQLEVBNERHRSxNQTVESCxDQTREVSxZQUFVO0FBQ2hCdkUsVUFBRSxtQkFBRixFQUF1QndFLEtBQXZCO0FBQ0gsS0E5REQ7QUErREF4RSxNQUFFLHVCQUFGLEVBQTJCeUUsRUFBM0IsQ0FBOEIsT0FBOUIsRUFBdUMsWUFBVTtBQUM3Q3pFLFVBQUUsaUJBQUYsRUFBcUIwRSxNQUFyQjtBQUNILEtBRkQ7QUFHSCxDQXJFRCxFIiwiZmlsZSI6Im9yZ2FuaXNtL2RldGFpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvanMvXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgYjFhMmE3MGM5YTAzMGJhMWIwYjkiLCJyZXF1aXJlKCcuL2RldGFpbHMvYXBwZW5kVHJhaXRzLmpzeCcpXG5yZXF1aXJlKCcuL2RldGFpbHMvZW9sLmpzeCcpXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L29yZ2FuaXNtL2RldGFpbHMuanN4IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHMyMTYxMjEgb24gMTQuMDMuMTcuXG4gKi9cblxuZnVuY3Rpb24gYXBwZW5kVHJhaXRFbnRyaWVzKGRvbUVsZW1lbnQsIHRyYWl0RW50cmllcywgdHJhaXRGb3JtYXQpe1xuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogUm91dGluZy5nZW5lcmF0ZSgnYXBpJywgeyduYW1lc3BhY2UnOiAnZGV0YWlscycsICdjbGFzc25hbWUnOiAnVHJhaXRFbnRyaWVzJ30pLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBcImRidmVyc2lvblwiOiBkYnZlcnNpb24sXG4gICAgICAgICAgICBcInRyYWl0X2VudHJ5X2lkc1wiOiB0cmFpdEVudHJpZXMsXG4gICAgICAgICAgICBcInRyYWl0X2Zvcm1hdFwiOiB0cmFpdEZvcm1hdFxuICAgICAgICB9LFxuICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICAkLmVhY2gocmVzdWx0LCBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhciByZWFsVmFsdWUgPSB2YWx1ZS52YWx1ZTtcbiAgICAgICAgICAgICAgICBpZih2YWx1ZS52YWx1ZSA9PT0gbnVsbCl7XG4gICAgICAgICAgICAgICAgICAgIHJlYWxWYWx1ZSA9IHZhbHVlLnZhbHVlX2RlZmluaXRpb247XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCB1bml0U3RyaW5nID0gXCJcIlxuICAgICAgICAgICAgICAgIGlmKHZhbHVlLnVuaXQgIT0gbnVsbCl7XG4gICAgICAgICAgICAgICAgICAgIHVuaXRTdHJpbmcgPSBcIiAkXCIrIHZhbHVlLnVuaXQgK1wiJFwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCB0cmFpdENpdGF0aW9uRGl2ID0gJCgnPGRpdiBjbGFzcz1cInRyYWl0LWNpdGF0aW9uXCI+JykudGV4dCh2YWx1ZS5jaXRhdGlvbikuY3NzKHsnZm9udC1zaXplJzogJzExcHgnfSlcbiAgICAgICAgICAgICAgICBsZXQgb3JpZ2luVXJsID0gJChgPGEgaHJlZj1cIiR7dmFsdWUub3JpZ2luX3VybH1cIj5gKS50ZXh0KFwiIG9yaWdpblwiKVxuICAgICAgICAgICAgICAgIGlmKHZhbHVlLm9yaWdpbl91cmwgIT0gXCJcIil7XG4gICAgICAgICAgICAgICAgICAgIHRyYWl0Q2l0YXRpb25EaXYuYXBwZW5kKG9yaWdpblVybClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZG9tRWxlbWVudC5hcHBlbmQoJCgnPGRpdj4nKS50ZXh0KHJlYWxWYWx1ZSt1bml0U3RyaW5nKS5hcHBlbmQodHJhaXRDaXRhdGlvbkRpdikpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9SZXNvdXJjZXMvY2xpZW50L2pzeC9vcmdhbmlzbS9kZXRhaWxzL2FwcGVuZFRyYWl0cy5qc3giLCIvKipcbiAqIENyZWF0ZWQgYnkgczIxNjEyMSBvbiAxNC4wMy4xNy5cbiAqL1xuJCgnZG9jdW1lbnQnKS5yZWFkeShmdW5jdGlvbigpe1xuICAgIGxldCBpbWdfdGVtcGxhdGUgPSAnPGEgY2xhc3M9XCJ0aHVtYm5haWxcIiBocmVmPVwiPCU9IGhyZWYgJT5cIj48aW1nIHNyYz1cIjwlPSBzcmMgJT5cIi8+PC9hPjxhIGhyZWY9XCI8JT0gc291cmNlICU+XCI+PGRpdj48JT0gcmlnaHRzICU+IDwlPSBsaWNlbnNlICU+PC9kaXY+PC9hPic7XG4gICAgbGV0IHR4dF90ZW1wbGF0ZSA9ICc8ZGl2IGNsYXNzPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiPjxkaXYgY2xhc3M9XCJwYW5lbC1oZWFkaW5nXCI+PGgzIGNsYXNzPVwicGFuZWwtdGl0bGVcIj48JT0gdGl0bGUgJT48L2gzPjxhIGhyZWY9XCI8JT0gaHJlZiAlPlwiPjwlPSByaWdodHMgJT4gPCU9IGxpY2Vuc2UgJT48L2E+PC9kaXY+PGRpdiBjbGFzcz1cInBhbmVsLWJvZHlcIj48JT0gYm9keSAlPjwvZGl2PjwvZGl2Pic7XG4gICAgJC5hamF4KHtcbiAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICB1cmw6IFwiaHR0cDovL2VvbC5vcmcvYXBpL3BhZ2VzLzEuMC5qc29uXCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGlkOiBlb2xfaWQsXG4gICAgICAgICAgICBiYXRjaDogZmFsc2UsXG4gICAgICAgICAgICBpbWFnZXNfcGVyX3BhZ2U6IDMsXG4gICAgICAgICAgICBpbWFnZXNfcGFnZTogMSxcbiAgICAgICAgICAgIHZpZGVvc19wZXJfcGFnZTogMCxcbiAgICAgICAgICAgIHZpZGVvc19wYWdlOiAxLFxuICAgICAgICAgICAgc291bmRzX3Blcl9wYWdlOiAwLFxuICAgICAgICAgICAgc291bmRzX3BhZ2U6IDEsXG4gICAgICAgICAgICBtYXBzX3Blcl9wYWdlOiAwLFxuICAgICAgICAgICAgbWFwc19wYWdlOiAxLFxuICAgICAgICAgICAgdGV4dHNfcGVyX3BhZ2U6IDMsXG4gICAgICAgICAgICB0ZXh0c19wYWdlOiAxLFxuICAgICAgICAgICAgaXVjbjogdHJ1ZSxcbiAgICAgICAgICAgIHN1YmplY3RzOiBcIm92ZXJ2aWV3XCIsXG4gICAgICAgICAgICBsaWNlbnNlczogXCJjYy1ieXxjYy1ieS1uY3xjYy1ieS1zYXxjYy1ieS1uYy1zYXxwZFwiLFxuICAgICAgICAgICAgZGV0YWlsczogdHJ1ZSxcbiAgICAgICAgICAgIGNvbW1vbl9uYW1lczogdHJ1ZSxcbiAgICAgICAgICAgIHN5bm9ueW1zOiB0cnVlLFxuICAgICAgICAgICAgcmVmZXJlbmNlczogdHJ1ZSxcbiAgICAgICAgICAgIHRheG9ub215OiB0cnVlLFxuICAgICAgICAgICAgdmV0dGVkOiAwLFxuICAgICAgICAgICAgY2FjaGVfdHRsOiA2MCxcbiAgICAgICAgICAgIGxhbmd1YWdlOiBcImVuXCJcbiAgICAgICAgfSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICAgICAgICAkLmVhY2gocmVzdWx0W1wiZGF0YU9iamVjdHNcIl0sIGZ1bmN0aW9uIChkb2IpIHtcbiAgICAgICAgICAgICAgICBpZihyZXN1bHRbXCJkYXRhT2JqZWN0c1wiXVtkb2JdW1wiZGF0YVR5cGVcIl0gPT09IFwiaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2VcIil7XG4gICAgICAgICAgICAgICAgICAgIGxldCB1cmwgPSByZXN1bHRbXCJkYXRhT2JqZWN0c1wiXVtkb2JdW1wiZW9sTWVkaWFVUkxcIl07XG4gICAgICAgICAgICAgICAgICAgIGxldCBsaWNlbnNlID0gcmVzdWx0W1wiZGF0YU9iamVjdHNcIl1bZG9iXVtcImxpY2Vuc2VcIl07XG4gICAgICAgICAgICAgICAgICAgIGxldCByaWdodHMgPSByZXN1bHRbXCJkYXRhT2JqZWN0c1wiXVtkb2JdW1wicmlnaHRzXCJdO1xuICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YgcmlnaHRzID09PSAndW5kZWZpbmVkJyl7XG4gICAgICAgICAgICAgICAgICAgICAgICByaWdodHMgPSBcIihjKVwiK3Jlc3VsdFtcImRhdGFPYmplY3RzXCJdW2RvYl1bXCJyaWdodHNIb2xkZXJcIl07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGV0IHNvdXJjZSA9IHJlc3VsdFtcImRhdGFPYmplY3RzXCJdW2RvYl1bXCJzb3VyY2VcIl07XG4gICAgICAgICAgICAgICAgICAgIGxldCBpbWdfZWxlbWVudCA9IF8udGVtcGxhdGUoaW1nX3RlbXBsYXRlKSh7c3JjOiB1cmwsIGhyZWY6IHVybCwgbGljZW5zZTogbGljZW5zZSwgcmlnaHRzOiByaWdodHMsIHNvdXJjZTogc291cmNlfSk7XG4gICAgICAgICAgICAgICAgICAgICQoJyNvcmdhbmlzbS1pbWctY29sdW1uJykuYXBwZW5kKGltZ19lbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYocmVzdWx0W1wiZGF0YU9iamVjdHNcIl1bZG9iXVtcImRhdGFUeXBlXCJdID09PSBcImh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9UZXh0XCIpe1xuICAgICAgICAgICAgICAgICAgICBsZXQgdGl0bGUgPSByZXN1bHRbXCJkYXRhT2JqZWN0c1wiXVtkb2JdW1widGl0bGVcIl07XG4gICAgICAgICAgICAgICAgICAgIGxldCBib2R5ID0gcmVzdWx0W1wiZGF0YU9iamVjdHNcIl1bZG9iXVtcImRlc2NyaXB0aW9uXCJdO1xuICAgICAgICAgICAgICAgICAgICBsZXQgdXJsID0gcmVzdWx0W1wiZGF0YU9iamVjdHNcIl1bZG9iXVtcInNvdXJjZVwiXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxpY2Vuc2UgPSByZXN1bHRbXCJkYXRhT2JqZWN0c1wiXVtkb2JdW1wibGljZW5zZVwiXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJpZ2h0cyA9IHJlc3VsdFtcImRhdGFPYmplY3RzXCJdW2RvYl1bXCJyaWdodHNcIl07XG4gICAgICAgICAgICAgICAgICAgIGlmKHR5cGVvZiByaWdodHMgPT09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0cyA9IFwiKGMpXCIrcmVzdWx0W1wiZGF0YU9iamVjdHNcIl1bZG9iXVtcInJpZ2h0c0hvbGRlclwiXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsZXQgdHh0X2VsZW1lbnQgPSBfLnRlbXBsYXRlKHR4dF90ZW1wbGF0ZSkoe3RpdGxlOiB0aXRsZSwgYm9keTogYm9keSwgaHJlZjogdXJsLCByaWdodHM6IHJpZ2h0cywgbGljZW5zZTogbGljZW5zZX0pO1xuICAgICAgICAgICAgICAgICAgICAkKCcjb3JnYW5pc20tdHh0LWNvbHVtbicpLmFwcGVuZCh0eHRfZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKFwiI3Zlcm5hY3VsYXJOYW1lXCIpLnRleHQoZ2V0QmVzdFZlcm5hY3VsYXJOYW1lRU9MKHJlc3VsdCkpO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikge1xuICAgICAgICAgICAgc2hvd01lc3NhZ2VEaWFsb2coZXJyb3JUaHJvd24sICdkYW5nZXInKTtcbiAgICAgICAgfVxuICAgIH0pLmFsd2F5cyhmdW5jdGlvbigpe1xuICAgICAgICAkKCcjbG9hZGluZy1wcm9ncmVzcycpLmVtcHR5KCk7XG4gICAgfSk7XG4gICAgJChcIiN0b2dnbGVDaXRhdGlvbkJ1dHRvblwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgICQoXCIudHJhaXQtY2l0YXRpb25cIikudG9nZ2xlKCk7XG4gICAgfSlcbn0pO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L29yZ2FuaXNtL2RldGFpbHMvZW9sLmpzeCJdLCJzb3VyY2VSb290IjoiIn0=