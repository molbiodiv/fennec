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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/Resources/client/jsx/organism/search.jsx":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("./app/Resources/client/jsx/organism/search/quickSearch.jsx");

/***/ }),

/***/ "./app/Resources/client/jsx/organism/search/quickSearch.jsx":
/***/ (function(module, exports) {

$(document).ready(function () {
    //autocomplete for organism search
    $("#search_organism").autocomplete({
        position: {
            my: "right top", at: "right bottom"
        },
        source: function (request, response) {
            var search = request.term;
            $.ajax({
                url: Routing.generate('api', { 'namespace': 'listing', 'classname': 'organisms' }),
                data: { term: request.term, limit: 500, search: search, dbversion: dbversion },
                dataType: "json",
                success: function (data) {
                    response(data.map(x => {
                        x.value = x.scientific_name;return x;
                    }));
                }
            });
        },
        minLength: 3
    });

    $("#search_organism").data("ui-autocomplete")._renderItem = function (ul, item) {
        var details = Routing.generate('organism_details', { 'dbversion': dbversion, 'fennec_id': item.fennec_id });
        var link = "<a href='" + details + "'><span style='display:inline-block; width: 100%; font-style: italic;'>" + item.scientific_name + "</span></a>";
        var li = $("<li>").append(link).appendTo(ul);
        return li;
    };

    $("#btn_search_organism").click(function () {
        var searchTerm = $("#search_organism").val();
        var resultPage = Routing.generate('organism_result', { 'dbversion': dbversion, 'limit': 500, 'search': searchTerm });
        window.location.href = resultPage;
    });

    $("#search_organism").keyup(function (event) {
        if (event.keyCode == 13) {
            $("#btn_search_organism").click();
        }
    });
});

/***/ }),

/***/ 6:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./app/Resources/client/jsx/organism/search.jsx");


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYjFhMmE3MGM5YTAzMGJhMWIwYjkiLCJ3ZWJwYWNrOi8vLy4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L29yZ2FuaXNtL3NlYXJjaC5qc3giLCJ3ZWJwYWNrOi8vLy4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L29yZ2FuaXNtL3NlYXJjaC9xdWlja1NlYXJjaC5qc3giXSwibmFtZXMiOlsicmVxdWlyZSIsIiQiLCJkb2N1bWVudCIsInJlYWR5IiwiYXV0b2NvbXBsZXRlIiwicG9zaXRpb24iLCJteSIsImF0Iiwic291cmNlIiwicmVxdWVzdCIsInJlc3BvbnNlIiwic2VhcmNoIiwidGVybSIsImFqYXgiLCJ1cmwiLCJSb3V0aW5nIiwiZ2VuZXJhdGUiLCJkYXRhIiwibGltaXQiLCJkYnZlcnNpb24iLCJkYXRhVHlwZSIsInN1Y2Nlc3MiLCJtYXAiLCJ4IiwidmFsdWUiLCJzY2llbnRpZmljX25hbWUiLCJtaW5MZW5ndGgiLCJfcmVuZGVySXRlbSIsInVsIiwiaXRlbSIsImRldGFpbHMiLCJmZW5uZWNfaWQiLCJsaW5rIiwibGkiLCJhcHBlbmQiLCJhcHBlbmRUbyIsImNsaWNrIiwic2VhcmNoVGVybSIsInZhbCIsInJlc3VsdFBhZ2UiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhyZWYiLCJrZXl1cCIsImV2ZW50Iiwia2V5Q29kZSJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7OztBQzdEQSxtQkFBQUEsQ0FBUSw0REFBUixFOzs7Ozs7O0FDQUFDLEVBQUVDLFFBQUYsRUFBWUMsS0FBWixDQUFrQixZQUFVO0FBQ3hCO0FBQ0FGLE1BQUUsa0JBQUYsRUFBc0JHLFlBQXRCLENBQW1DO0FBQy9CQyxrQkFBVTtBQUNOQyxnQkFBSSxXQURFLEVBQ1dDLElBQUk7QUFEZixTQURxQjtBQUkvQkMsZ0JBQVEsVUFBVUMsT0FBVixFQUFtQkMsUUFBbkIsRUFBNkI7QUFDakMsZ0JBQUlDLFNBQVNGLFFBQVFHLElBQXJCO0FBQ0FYLGNBQUVZLElBQUYsQ0FBTztBQUNIQyxxQkFBS0MsUUFBUUMsUUFBUixDQUFpQixLQUFqQixFQUF3QixFQUFDLGFBQWEsU0FBZCxFQUF5QixhQUFhLFdBQXRDLEVBQXhCLENBREY7QUFFSEMsc0JBQU0sRUFBQ0wsTUFBT0gsUUFBUUcsSUFBaEIsRUFBc0JNLE9BQU8sR0FBN0IsRUFBa0NQLFFBQVFBLE1BQTFDLEVBQWtEUSxXQUFXQSxTQUE3RCxFQUZIO0FBR0hDLDBCQUFVLE1BSFA7QUFJSEMseUJBQVMsVUFBVUosSUFBVixFQUFnQjtBQUNyQlAsNkJBQVNPLEtBQUtLLEdBQUwsQ0FBU0MsS0FBSztBQUFDQSwwQkFBRUMsS0FBRixHQUFVRCxFQUFFRSxlQUFaLENBQTZCLE9BQU9GLENBQVA7QUFBVSxxQkFBdEQsQ0FBVDtBQUNIO0FBTkUsYUFBUDtBQVFILFNBZDhCO0FBZS9CRyxtQkFBVztBQWZvQixLQUFuQzs7QUFrQkF6QixNQUFFLGtCQUFGLEVBQXNCZ0IsSUFBdEIsQ0FBMkIsaUJBQTNCLEVBQThDVSxXQUE5QyxHQUE0RCxVQUFVQyxFQUFWLEVBQWNDLElBQWQsRUFBb0I7QUFDeEUsWUFBSUMsVUFBVWYsUUFBUUMsUUFBUixDQUFpQixrQkFBakIsRUFBcUMsRUFBQyxhQUFhRyxTQUFkLEVBQXlCLGFBQWFVLEtBQUtFLFNBQTNDLEVBQXJDLENBQWQ7QUFDQSxZQUFJQyxPQUFPLGNBQVlGLE9BQVosR0FBb0IseUVBQXBCLEdBQWdHRCxLQUFLSixlQUFyRyxHQUF1SCxhQUFsSTtBQUNKLFlBQUlRLEtBQUtoQyxFQUFFLE1BQUYsRUFDQWlDLE1BREEsQ0FDT0YsSUFEUCxFQUVBRyxRQUZBLENBRVNQLEVBRlQsQ0FBVDtBQUdBLGVBQU9LLEVBQVA7QUFDSCxLQVBEOztBQVNBaEMsTUFBRSxzQkFBRixFQUEwQm1DLEtBQTFCLENBQWdDLFlBQVU7QUFDdEMsWUFBSUMsYUFBYXBDLEVBQUUsa0JBQUYsRUFBc0JxQyxHQUF0QixFQUFqQjtBQUNBLFlBQUlDLGFBQWF4QixRQUFRQyxRQUFSLENBQWlCLGlCQUFqQixFQUFvQyxFQUFDLGFBQWFHLFNBQWQsRUFBeUIsU0FBUyxHQUFsQyxFQUF1QyxVQUFVa0IsVUFBakQsRUFBcEMsQ0FBakI7QUFDQUcsZUFBT0MsUUFBUCxDQUFnQkMsSUFBaEIsR0FBdUJILFVBQXZCO0FBQ0gsS0FKRDs7QUFNQXRDLE1BQUUsa0JBQUYsRUFBc0IwQyxLQUF0QixDQUE0QixVQUFTQyxLQUFULEVBQWU7QUFDdkMsWUFBR0EsTUFBTUMsT0FBTixJQUFpQixFQUFwQixFQUF1QjtBQUNuQjVDLGNBQUUsc0JBQUYsRUFBMEJtQyxLQUExQjtBQUNIO0FBQ0osS0FKRDtBQUtILENBeENELEUiLCJmaWxlIjoib3JnYW5pc20vc2VhcmNoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL2pzL1wiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDYpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGIxYTJhNzBjOWEwMzBiYTFiMGI5IiwicmVxdWlyZSgnLi9zZWFyY2gvcXVpY2tTZWFyY2guanN4JylcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvb3JnYW5pc20vc2VhcmNoLmpzeCIsIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgLy9hdXRvY29tcGxldGUgZm9yIG9yZ2FuaXNtIHNlYXJjaFxuICAgICQoXCIjc2VhcmNoX29yZ2FuaXNtXCIpLmF1dG9jb21wbGV0ZSh7XG4gICAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgICAgICBteTogXCJyaWdodCB0b3BcIiwgYXQ6IFwicmlnaHQgYm90dG9tXCJcbiAgICAgICAgfSxcbiAgICAgICAgc291cmNlOiBmdW5jdGlvbiAocmVxdWVzdCwgcmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHZhciBzZWFyY2ggPSByZXF1ZXN0LnRlcm07XG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogUm91dGluZy5nZW5lcmF0ZSgnYXBpJywgeyduYW1lc3BhY2UnOiAnbGlzdGluZycsICdjbGFzc25hbWUnOiAnb3JnYW5pc21zJ30pLFxuICAgICAgICAgICAgICAgIGRhdGE6IHt0ZXJtOiAgcmVxdWVzdC50ZXJtLCBsaW1pdDogNTAwLCBzZWFyY2g6IHNlYXJjaCwgZGJ2ZXJzaW9uOiBkYnZlcnNpb259LFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICByZXNwb25zZShkYXRhLm1hcCh4ID0+IHt4LnZhbHVlID0geC5zY2llbnRpZmljX25hbWU7IHJldHVybiB4O30pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgbWluTGVuZ3RoOiAzXG4gICAgfSk7XG5cbiAgICAkKFwiI3NlYXJjaF9vcmdhbmlzbVwiKS5kYXRhKFwidWktYXV0b2NvbXBsZXRlXCIpLl9yZW5kZXJJdGVtID0gZnVuY3Rpb24gKHVsLCBpdGVtKSB7XG4gICAgICAgICAgICB2YXIgZGV0YWlscyA9IFJvdXRpbmcuZ2VuZXJhdGUoJ29yZ2FuaXNtX2RldGFpbHMnLCB7J2RidmVyc2lvbic6IGRidmVyc2lvbiwgJ2Zlbm5lY19pZCc6IGl0ZW0uZmVubmVjX2lkfSk7XG4gICAgICAgICAgICB2YXIgbGluayA9IFwiPGEgaHJlZj0nXCIrZGV0YWlscytcIic+PHNwYW4gc3R5bGU9J2Rpc3BsYXk6aW5saW5lLWJsb2NrOyB3aWR0aDogMTAwJTsgZm9udC1zdHlsZTogaXRhbGljOyc+XCIgKyBpdGVtLnNjaWVudGlmaWNfbmFtZSArIFwiPC9zcGFuPjwvYT5cIjtcbiAgICAgICAgdmFyIGxpID0gJChcIjxsaT5cIilcbiAgICAgICAgICAgICAgICAuYXBwZW5kKGxpbmspXG4gICAgICAgICAgICAgICAgLmFwcGVuZFRvKHVsKTtcbiAgICAgICAgcmV0dXJuIGxpO1xuICAgIH07XG5cbiAgICAkKFwiI2J0bl9zZWFyY2hfb3JnYW5pc21cIikuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHNlYXJjaFRlcm0gPSAkKFwiI3NlYXJjaF9vcmdhbmlzbVwiKS52YWwoKTtcbiAgICAgICAgdmFyIHJlc3VsdFBhZ2UgPSBSb3V0aW5nLmdlbmVyYXRlKCdvcmdhbmlzbV9yZXN1bHQnLCB7J2RidmVyc2lvbic6IGRidmVyc2lvbiwgJ2xpbWl0JzogNTAwLCAnc2VhcmNoJzogc2VhcmNoVGVybX0pO1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHJlc3VsdFBhZ2U7XG4gICAgfSk7XG5cbiAgICAkKFwiI3NlYXJjaF9vcmdhbmlzbVwiKS5rZXl1cChmdW5jdGlvbihldmVudCl7XG4gICAgICAgIGlmKGV2ZW50LmtleUNvZGUgPT0gMTMpe1xuICAgICAgICAgICAgJChcIiNidG5fc2VhcmNoX29yZ2FuaXNtXCIpLmNsaWNrKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9SZXNvdXJjZXMvY2xpZW50L2pzeC9vcmdhbmlzbS9zZWFyY2gvcXVpY2tTZWFyY2guanN4Il0sInNvdXJjZVJvb3QiOiIifQ==