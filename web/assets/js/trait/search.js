webpackJsonp([6],{

/***/ "./app/Resources/client/jsx/trait/search.jsx":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("./app/Resources/client/jsx/trait/search/quickSearch.jsx");

/***/ }),

/***/ "./app/Resources/client/jsx/trait/search/quickSearch.jsx":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {/*
 * global $
 * global dbversion
 */

$(document).ready(function () {
    //autocomplete for trait search
    $("#search_trait").autocomplete({
        position: {
            my: "right top", at: "right bottom"
        },
        source: function source(request, response) {
            var search = request.term;
            $.ajax({
                url: Routing.generate('api', { 'namespace': 'listing', 'classname': 'traits' }),
                data: { term: request.term, limit: 500, search: search, dbversion: dbversion },
                dataType: "json",
                success: function success(data) {
                    response(data.map(function (x) {
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ 6:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./app/Resources/client/jsx/trait/search.jsx");


/***/ })

},[6]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvdHJhaXQvc2VhcmNoLmpzeCIsIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvdHJhaXQvc2VhcmNoL3F1aWNrU2VhcmNoLmpzeCJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiJCIsImRvY3VtZW50IiwicmVhZHkiLCJhdXRvY29tcGxldGUiLCJwb3NpdGlvbiIsIm15IiwiYXQiLCJzb3VyY2UiLCJyZXF1ZXN0IiwicmVzcG9uc2UiLCJzZWFyY2giLCJ0ZXJtIiwiYWpheCIsInVybCIsIlJvdXRpbmciLCJnZW5lcmF0ZSIsImRhdGEiLCJsaW1pdCIsImRidmVyc2lvbiIsImRhdGFUeXBlIiwic3VjY2VzcyIsIm1hcCIsIngiLCJ2YWx1ZSIsIm5hbWUiLCJtaW5MZW5ndGgiLCJfcmVuZGVySXRlbSIsInVsIiwiaXRlbSIsImRldGFpbHMiLCJ0cmFpdF90eXBlX2lkIiwibGluayIsImxpIiwiYXBwZW5kIiwiYXBwZW5kVG8iLCJjbGljayIsInNlYXJjaFRlcm0iLCJ2YWwiLCJyZXN1bHRQYWdlIiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwia2V5dXAiLCJldmVudCIsImtleUNvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsbUJBQUFBLENBQVEseURBQVIsRTs7Ozs7OztBQ0FBOzs7OztBQUtBQyxFQUFFQyxRQUFGLEVBQVlDLEtBQVosQ0FBa0IsWUFBVTtBQUN4QjtBQUNBRixNQUFFLGVBQUYsRUFBbUJHLFlBQW5CLENBQWdDO0FBQzVCQyxrQkFBVTtBQUNOQyxnQkFBSSxXQURFLEVBQ1dDLElBQUk7QUFEZixTQURrQjtBQUk1QkMsZ0JBQVEsZ0JBQVVDLE9BQVYsRUFBbUJDLFFBQW5CLEVBQTZCO0FBQ2pDLGdCQUFJQyxTQUFTRixRQUFRRyxJQUFyQjtBQUNBWCxjQUFFWSxJQUFGLENBQU87QUFDSEMscUJBQUtDLFFBQVFDLFFBQVIsQ0FBaUIsS0FBakIsRUFBd0IsRUFBQyxhQUFhLFNBQWQsRUFBeUIsYUFBYSxRQUF0QyxFQUF4QixDQURGO0FBRUhDLHNCQUFNLEVBQUNMLE1BQU1ILFFBQVFHLElBQWYsRUFBcUJNLE9BQU8sR0FBNUIsRUFBaUNQLFFBQVFBLE1BQXpDLEVBQWlEUSxXQUFXQSxTQUE1RCxFQUZIO0FBR0hDLDBCQUFVLE1BSFA7QUFJSEMseUJBQVMsaUJBQVVKLElBQVYsRUFBZ0I7QUFDckJQLDZCQUFTTyxLQUFLSyxHQUFMLENBQVMsYUFBSztBQUFDQywwQkFBRUMsS0FBRixHQUFVRCxFQUFFRSxJQUFaLENBQWtCLE9BQU9GLENBQVA7QUFBVSxxQkFBM0MsQ0FBVDtBQUNIO0FBTkUsYUFBUDtBQVFILFNBZDJCO0FBZTVCRyxtQkFBVztBQWZpQixLQUFoQzs7QUFrQkF6QixNQUFFLGVBQUYsRUFBbUJnQixJQUFuQixDQUF3QixpQkFBeEIsRUFBMkNVLFdBQTNDLEdBQXlELFVBQVVDLEVBQVYsRUFBY0MsSUFBZCxFQUFvQjtBQUN6RSxZQUFJQyxVQUFVZixRQUFRQyxRQUFSLENBQWlCLGVBQWpCLEVBQWtDLEVBQUMsYUFBYUcsU0FBZCxFQUF5QixpQkFBaUJVLEtBQUtFLGFBQS9DLEVBQWxDLENBQWQ7QUFDQSxZQUFJQyxPQUFPLGNBQVlGLE9BQVosR0FBb0IseUVBQXBCLEdBQWdHRCxLQUFLSixJQUFyRyxHQUE0RyxhQUF2SDtBQUNBLFlBQUlRLEtBQUtoQyxFQUFFLE1BQUYsRUFDQWlDLE1BREEsQ0FDT0YsSUFEUCxFQUVBRyxRQUZBLENBRVNQLEVBRlQsQ0FBVDtBQUdBLGVBQU9LLEVBQVA7QUFDSCxLQVBEOztBQVNBaEMsTUFBRSxtQkFBRixFQUF1Qm1DLEtBQXZCLENBQTZCLFlBQVU7QUFDbkMsWUFBSUMsYUFBYXBDLEVBQUUsZUFBRixFQUFtQnFDLEdBQW5CLEVBQWpCO0FBQ0EsWUFBSUMsYUFBYXhCLFFBQVFDLFFBQVIsQ0FBaUIsY0FBakIsRUFBaUMsRUFBQyxhQUFhRyxTQUFkLEVBQXlCLFNBQVMsR0FBbEMsRUFBdUMsVUFBVWtCLFVBQWpELEVBQWpDLENBQWpCO0FBQ0FHLGVBQU9DLFFBQVAsQ0FBZ0JDLElBQWhCLEdBQXVCSCxVQUF2QjtBQUNILEtBSkQ7O0FBTUF0QyxNQUFFLGVBQUYsRUFBbUIwQyxLQUFuQixDQUF5QixVQUFTQyxLQUFULEVBQWU7QUFDcEMsWUFBR0EsTUFBTUMsT0FBTixJQUFpQixFQUFwQixFQUF1QjtBQUNuQjVDLGNBQUUsbUJBQUYsRUFBdUJtQyxLQUF2QjtBQUNIO0FBQ0osS0FKRDtBQUtILENBeENELEUiLCJmaWxlIjoidHJhaXQvc2VhcmNoLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnLi9zZWFyY2gvcXVpY2tTZWFyY2guanN4JylcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvdHJhaXQvc2VhcmNoLmpzeCIsIi8qXG4gKiBnbG9iYWwgJFxuICogZ2xvYmFsIGRidmVyc2lvblxuICovXG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgLy9hdXRvY29tcGxldGUgZm9yIHRyYWl0IHNlYXJjaFxuICAgICQoXCIjc2VhcmNoX3RyYWl0XCIpLmF1dG9jb21wbGV0ZSh7XG4gICAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgICAgICBteTogXCJyaWdodCB0b3BcIiwgYXQ6IFwicmlnaHQgYm90dG9tXCJcbiAgICAgICAgfSxcbiAgICAgICAgc291cmNlOiBmdW5jdGlvbiAocmVxdWVzdCwgcmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHZhciBzZWFyY2ggPSByZXF1ZXN0LnRlcm07XG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogUm91dGluZy5nZW5lcmF0ZSgnYXBpJywgeyduYW1lc3BhY2UnOiAnbGlzdGluZycsICdjbGFzc25hbWUnOiAndHJhaXRzJ30pLFxuICAgICAgICAgICAgICAgIGRhdGE6IHt0ZXJtOiByZXF1ZXN0LnRlcm0sIGxpbWl0OiA1MDAsIHNlYXJjaDogc2VhcmNoLCBkYnZlcnNpb246IGRidmVyc2lvbn0sXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlKGRhdGEubWFwKHggPT4ge3gudmFsdWUgPSB4Lm5hbWU7IHJldHVybiB4O30pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgbWluTGVuZ3RoOiAzXG4gICAgfSk7XG5cbiAgICAkKFwiI3NlYXJjaF90cmFpdFwiKS5kYXRhKFwidWktYXV0b2NvbXBsZXRlXCIpLl9yZW5kZXJJdGVtID0gZnVuY3Rpb24gKHVsLCBpdGVtKSB7XG4gICAgICAgIHZhciBkZXRhaWxzID0gUm91dGluZy5nZW5lcmF0ZSgndHJhaXRfZGV0YWlscycsIHsnZGJ2ZXJzaW9uJzogZGJ2ZXJzaW9uLCAndHJhaXRfdHlwZV9pZCc6IGl0ZW0udHJhaXRfdHlwZV9pZH0pO1xuICAgICAgICB2YXIgbGluayA9IFwiPGEgaHJlZj0nXCIrZGV0YWlscytcIic+PHNwYW4gc3R5bGU9J2Rpc3BsYXk6aW5saW5lLWJsb2NrOyB3aWR0aDogMTAwJTsgZm9udC1zdHlsZTogaXRhbGljOyc+XCIgKyBpdGVtLm5hbWUgKyBcIjwvc3Bhbj48L2E+XCI7XG4gICAgICAgIHZhciBsaSA9ICQoXCI8bGk+XCIpXG4gICAgICAgICAgICAgICAgLmFwcGVuZChsaW5rKVxuICAgICAgICAgICAgICAgIC5hcHBlbmRUbyh1bCk7XG4gICAgICAgIHJldHVybiBsaTtcbiAgICB9O1xuXG4gICAgJChcIiNidG5fc2VhcmNoX3RyYWl0XCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBzZWFyY2hUZXJtID0gJChcIiNzZWFyY2hfdHJhaXRcIikudmFsKCk7XG4gICAgICAgIHZhciByZXN1bHRQYWdlID0gUm91dGluZy5nZW5lcmF0ZSgndHJhaXRfcmVzdWx0JywgeydkYnZlcnNpb24nOiBkYnZlcnNpb24sICdsaW1pdCc6IDUwMCwgJ3NlYXJjaCc6IHNlYXJjaFRlcm19KTtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSByZXN1bHRQYWdlO1xuICAgIH0pO1xuXG4gICAgJChcIiNzZWFyY2hfdHJhaXRcIikua2V5dXAoZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICBpZihldmVudC5rZXlDb2RlID09IDEzKXtcbiAgICAgICAgICAgICQoXCIjYnRuX3NlYXJjaF90cmFpdFwiKS5jbGljaygpO1xuICAgICAgICB9XG4gICAgfSk7XG59KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvdHJhaXQvc2VhcmNoL3F1aWNrU2VhcmNoLmpzeCJdLCJzb3VyY2VSb290IjoiIn0=