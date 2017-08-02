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
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/Resources/client/jsx/trait/search.jsx":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("./app/Resources/client/jsx/trait/search/quickSearch.jsx");

/***/ }),

/***/ "./app/Resources/client/jsx/trait/search/quickSearch.jsx":
/***/ (function(module, exports) {

/*
 * global $
 * global dbversion
 */

$(document).ready(function () {
    //autocomplete for trait search
    $("#search_trait").autocomplete({
        position: {
            my: "right top", at: "right bottom"
        },
        source: function (request, response) {
            var search = request.term;
            $.ajax({
                url: Routing.generate('api', { 'namespace': 'listing', 'classname': 'traits' }),
                data: { term: request.term, limit: 500, search: search, dbversion: dbversion },
                dataType: "json",
                success: function (data) {
                    response(data.map(x => {
                        x.value = x.name;return x;
                    }));
                }
            });
        },
        minLength: 3
    });

    $("#search_trait").data("ui-autocomplete")._renderItem = function (ul, item) {
        var details = Routing.generate('trait_details', { 'dbversion': dbversion, 'trait_type_id': item.trait_type_id });
        var link = "<a href='" + details + "'><span style='display:inline-block; width: 100%; font-style: italic;'>" + item.name + "</span></a>";
        var li = $("<li>").append(link).appendTo(ul);
        return li;
    };

    $("#btn_search_trait").click(function () {
        var searchTerm = $("#search_trait").val();
        var resultPage = Routing.generate('trait_result', { 'dbversion': dbversion, 'limit': 500, 'search': searchTerm });
        window.location.href = resultPage;
    });

    $("#search_trait").keyup(function (event) {
        if (event.keyCode == 13) {
            $("#btn_search_trait").click();
        }
    });
});

/***/ }),

/***/ 8:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./app/Resources/client/jsx/trait/search.jsx");


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYjFhMmE3MGM5YTAzMGJhMWIwYjkiLCJ3ZWJwYWNrOi8vLy4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L3RyYWl0L3NlYXJjaC5qc3giLCJ3ZWJwYWNrOi8vLy4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L3RyYWl0L3NlYXJjaC9xdWlja1NlYXJjaC5qc3giXSwibmFtZXMiOlsicmVxdWlyZSIsIiQiLCJkb2N1bWVudCIsInJlYWR5IiwiYXV0b2NvbXBsZXRlIiwicG9zaXRpb24iLCJteSIsImF0Iiwic291cmNlIiwicmVxdWVzdCIsInJlc3BvbnNlIiwic2VhcmNoIiwidGVybSIsImFqYXgiLCJ1cmwiLCJSb3V0aW5nIiwiZ2VuZXJhdGUiLCJkYXRhIiwibGltaXQiLCJkYnZlcnNpb24iLCJkYXRhVHlwZSIsInN1Y2Nlc3MiLCJtYXAiLCJ4IiwidmFsdWUiLCJuYW1lIiwibWluTGVuZ3RoIiwiX3JlbmRlckl0ZW0iLCJ1bCIsIml0ZW0iLCJkZXRhaWxzIiwidHJhaXRfdHlwZV9pZCIsImxpbmsiLCJsaSIsImFwcGVuZCIsImFwcGVuZFRvIiwiY2xpY2siLCJzZWFyY2hUZXJtIiwidmFsIiwicmVzdWx0UGFnZSIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsImtleXVwIiwiZXZlbnQiLCJrZXlDb2RlIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7O0FDN0RBLG1CQUFBQSxDQUFRLHlEQUFSLEU7Ozs7Ozs7QUNBQTs7Ozs7QUFLQUMsRUFBRUMsUUFBRixFQUFZQyxLQUFaLENBQWtCLFlBQVU7QUFDeEI7QUFDQUYsTUFBRSxlQUFGLEVBQW1CRyxZQUFuQixDQUFnQztBQUM1QkMsa0JBQVU7QUFDTkMsZ0JBQUksV0FERSxFQUNXQyxJQUFJO0FBRGYsU0FEa0I7QUFJNUJDLGdCQUFRLFVBQVVDLE9BQVYsRUFBbUJDLFFBQW5CLEVBQTZCO0FBQ2pDLGdCQUFJQyxTQUFTRixRQUFRRyxJQUFyQjtBQUNBWCxjQUFFWSxJQUFGLENBQU87QUFDSEMscUJBQUtDLFFBQVFDLFFBQVIsQ0FBaUIsS0FBakIsRUFBd0IsRUFBQyxhQUFhLFNBQWQsRUFBeUIsYUFBYSxRQUF0QyxFQUF4QixDQURGO0FBRUhDLHNCQUFNLEVBQUNMLE1BQU1ILFFBQVFHLElBQWYsRUFBcUJNLE9BQU8sR0FBNUIsRUFBaUNQLFFBQVFBLE1BQXpDLEVBQWlEUSxXQUFXQSxTQUE1RCxFQUZIO0FBR0hDLDBCQUFVLE1BSFA7QUFJSEMseUJBQVMsVUFBVUosSUFBVixFQUFnQjtBQUNyQlAsNkJBQVNPLEtBQUtLLEdBQUwsQ0FBU0MsS0FBSztBQUFDQSwwQkFBRUMsS0FBRixHQUFVRCxFQUFFRSxJQUFaLENBQWtCLE9BQU9GLENBQVA7QUFBVSxxQkFBM0MsQ0FBVDtBQUNIO0FBTkUsYUFBUDtBQVFILFNBZDJCO0FBZTVCRyxtQkFBVztBQWZpQixLQUFoQzs7QUFrQkF6QixNQUFFLGVBQUYsRUFBbUJnQixJQUFuQixDQUF3QixpQkFBeEIsRUFBMkNVLFdBQTNDLEdBQXlELFVBQVVDLEVBQVYsRUFBY0MsSUFBZCxFQUFvQjtBQUN6RSxZQUFJQyxVQUFVZixRQUFRQyxRQUFSLENBQWlCLGVBQWpCLEVBQWtDLEVBQUMsYUFBYUcsU0FBZCxFQUF5QixpQkFBaUJVLEtBQUtFLGFBQS9DLEVBQWxDLENBQWQ7QUFDQSxZQUFJQyxPQUFPLGNBQVlGLE9BQVosR0FBb0IseUVBQXBCLEdBQWdHRCxLQUFLSixJQUFyRyxHQUE0RyxhQUF2SDtBQUNBLFlBQUlRLEtBQUtoQyxFQUFFLE1BQUYsRUFDQWlDLE1BREEsQ0FDT0YsSUFEUCxFQUVBRyxRQUZBLENBRVNQLEVBRlQsQ0FBVDtBQUdBLGVBQU9LLEVBQVA7QUFDSCxLQVBEOztBQVNBaEMsTUFBRSxtQkFBRixFQUF1Qm1DLEtBQXZCLENBQTZCLFlBQVU7QUFDbkMsWUFBSUMsYUFBYXBDLEVBQUUsZUFBRixFQUFtQnFDLEdBQW5CLEVBQWpCO0FBQ0EsWUFBSUMsYUFBYXhCLFFBQVFDLFFBQVIsQ0FBaUIsY0FBakIsRUFBaUMsRUFBQyxhQUFhRyxTQUFkLEVBQXlCLFNBQVMsR0FBbEMsRUFBdUMsVUFBVWtCLFVBQWpELEVBQWpDLENBQWpCO0FBQ0FHLGVBQU9DLFFBQVAsQ0FBZ0JDLElBQWhCLEdBQXVCSCxVQUF2QjtBQUNILEtBSkQ7O0FBTUF0QyxNQUFFLGVBQUYsRUFBbUIwQyxLQUFuQixDQUF5QixVQUFTQyxLQUFULEVBQWU7QUFDcEMsWUFBR0EsTUFBTUMsT0FBTixJQUFpQixFQUFwQixFQUF1QjtBQUNuQjVDLGNBQUUsbUJBQUYsRUFBdUJtQyxLQUF2QjtBQUNIO0FBQ0osS0FKRDtBQUtILENBeENELEUiLCJmaWxlIjoidHJhaXQvc2VhcmNoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL2pzL1wiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDgpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGIxYTJhNzBjOWEwMzBiYTFiMGI5IiwicmVxdWlyZSgnLi9zZWFyY2gvcXVpY2tTZWFyY2guanN4JylcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvdHJhaXQvc2VhcmNoLmpzeCIsIi8qXG4gKiBnbG9iYWwgJFxuICogZ2xvYmFsIGRidmVyc2lvblxuICovXG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgLy9hdXRvY29tcGxldGUgZm9yIHRyYWl0IHNlYXJjaFxuICAgICQoXCIjc2VhcmNoX3RyYWl0XCIpLmF1dG9jb21wbGV0ZSh7XG4gICAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgICAgICBteTogXCJyaWdodCB0b3BcIiwgYXQ6IFwicmlnaHQgYm90dG9tXCJcbiAgICAgICAgfSxcbiAgICAgICAgc291cmNlOiBmdW5jdGlvbiAocmVxdWVzdCwgcmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHZhciBzZWFyY2ggPSByZXF1ZXN0LnRlcm07XG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogUm91dGluZy5nZW5lcmF0ZSgnYXBpJywgeyduYW1lc3BhY2UnOiAnbGlzdGluZycsICdjbGFzc25hbWUnOiAndHJhaXRzJ30pLFxuICAgICAgICAgICAgICAgIGRhdGE6IHt0ZXJtOiByZXF1ZXN0LnRlcm0sIGxpbWl0OiA1MDAsIHNlYXJjaDogc2VhcmNoLCBkYnZlcnNpb246IGRidmVyc2lvbn0sXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlKGRhdGEubWFwKHggPT4ge3gudmFsdWUgPSB4Lm5hbWU7IHJldHVybiB4O30pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgbWluTGVuZ3RoOiAzXG4gICAgfSk7XG5cbiAgICAkKFwiI3NlYXJjaF90cmFpdFwiKS5kYXRhKFwidWktYXV0b2NvbXBsZXRlXCIpLl9yZW5kZXJJdGVtID0gZnVuY3Rpb24gKHVsLCBpdGVtKSB7XG4gICAgICAgIHZhciBkZXRhaWxzID0gUm91dGluZy5nZW5lcmF0ZSgndHJhaXRfZGV0YWlscycsIHsnZGJ2ZXJzaW9uJzogZGJ2ZXJzaW9uLCAndHJhaXRfdHlwZV9pZCc6IGl0ZW0udHJhaXRfdHlwZV9pZH0pO1xuICAgICAgICB2YXIgbGluayA9IFwiPGEgaHJlZj0nXCIrZGV0YWlscytcIic+PHNwYW4gc3R5bGU9J2Rpc3BsYXk6aW5saW5lLWJsb2NrOyB3aWR0aDogMTAwJTsgZm9udC1zdHlsZTogaXRhbGljOyc+XCIgKyBpdGVtLm5hbWUgKyBcIjwvc3Bhbj48L2E+XCI7XG4gICAgICAgIHZhciBsaSA9ICQoXCI8bGk+XCIpXG4gICAgICAgICAgICAgICAgLmFwcGVuZChsaW5rKVxuICAgICAgICAgICAgICAgIC5hcHBlbmRUbyh1bCk7XG4gICAgICAgIHJldHVybiBsaTtcbiAgICB9O1xuXG4gICAgJChcIiNidG5fc2VhcmNoX3RyYWl0XCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBzZWFyY2hUZXJtID0gJChcIiNzZWFyY2hfdHJhaXRcIikudmFsKCk7XG4gICAgICAgIHZhciByZXN1bHRQYWdlID0gUm91dGluZy5nZW5lcmF0ZSgndHJhaXRfcmVzdWx0JywgeydkYnZlcnNpb24nOiBkYnZlcnNpb24sICdsaW1pdCc6IDUwMCwgJ3NlYXJjaCc6IHNlYXJjaFRlcm19KTtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSByZXN1bHRQYWdlO1xuICAgIH0pO1xuXG4gICAgJChcIiNzZWFyY2hfdHJhaXRcIikua2V5dXAoZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICBpZihldmVudC5rZXlDb2RlID09IDEzKXtcbiAgICAgICAgICAgICQoXCIjYnRuX3NlYXJjaF90cmFpdFwiKS5jbGljaygpO1xuICAgICAgICB9XG4gICAgfSk7XG59KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvdHJhaXQvc2VhcmNoL3F1aWNrU2VhcmNoLmpzeCJdLCJzb3VyY2VSb290IjoiIn0=