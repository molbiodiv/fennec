webpackJsonp([7],{

/***/ "./app/Resources/client/jsx/organism/search.jsx":
/*!******************************************************!*\
  !*** ./app/Resources/client/jsx/organism/search.jsx ***!
  \******************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./search/quickSearch.jsx */ "./app/Resources/client/jsx/organism/search/quickSearch.jsx");

/***/ }),

/***/ "./app/Resources/client/jsx/organism/search/quickSearch.jsx":
/*!******************************************************************!*\
  !*** ./app/Resources/client/jsx/organism/search/quickSearch.jsx ***!
  \******************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {$(document).ready(function () {
    //autocomplete for organism search
    $("#search_organism").autocomplete({
        position: {
            my: "right top", at: "right bottom"
        },
        source: function source(request, response) {
            var search = request.term;
            $.ajax({
                url: Routing.generate('api_listing_organisms', { 'dbversion': dbversion, 'limit': 500, 'search': search }),
                dataType: "json",
                success: function success(data) {
                    response(data.map(function (x) {
                        x.value = x.scientificName;return x;
                    }));
                }
            });
        },
        minLength: 3
    });

    $("#search_organism").data("ui-autocomplete")._renderItem = function (ul, item) {
        var details = Routing.generate('organism_details', { 'dbversion': dbversion, 'fennec_id': item.fennecId });
        var link = "<a href='" + details + "'><span style='display:inline-block; width: 100%; font-style: italic;'>" + item.scientificName + "</span></a>";
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ 4:
/*!************************************************************!*\
  !*** multi ./app/Resources/client/jsx/organism/search.jsx ***!
  \************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./app/Resources/client/jsx/organism/search.jsx */"./app/Resources/client/jsx/organism/search.jsx");


/***/ })

},[4]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvb3JnYW5pc20vc2VhcmNoLmpzeCIsIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvb3JnYW5pc20vc2VhcmNoL3F1aWNrU2VhcmNoLmpzeCJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiJCIsImRvY3VtZW50IiwicmVhZHkiLCJhdXRvY29tcGxldGUiLCJwb3NpdGlvbiIsIm15IiwiYXQiLCJzb3VyY2UiLCJyZXF1ZXN0IiwicmVzcG9uc2UiLCJzZWFyY2giLCJ0ZXJtIiwiYWpheCIsInVybCIsIlJvdXRpbmciLCJnZW5lcmF0ZSIsImRidmVyc2lvbiIsImRhdGFUeXBlIiwic3VjY2VzcyIsImRhdGEiLCJtYXAiLCJ4IiwidmFsdWUiLCJzY2llbnRpZmljTmFtZSIsIm1pbkxlbmd0aCIsIl9yZW5kZXJJdGVtIiwidWwiLCJpdGVtIiwiZGV0YWlscyIsImZlbm5lY0lkIiwibGluayIsImxpIiwiYXBwZW5kIiwiYXBwZW5kVG8iLCJjbGljayIsInNlYXJjaFRlcm0iLCJ2YWwiLCJyZXN1bHRQYWdlIiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwia2V5dXAiLCJldmVudCIsImtleUNvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxtQkFBQUEsQ0FBUSw0RkFBUixFOzs7Ozs7Ozs7Ozs7QUNBQSx5Q0FBQUMsRUFBRUMsUUFBRixFQUFZQyxLQUFaLENBQWtCLFlBQVU7QUFDeEI7QUFDQUYsTUFBRSxrQkFBRixFQUFzQkcsWUFBdEIsQ0FBbUM7QUFDL0JDLGtCQUFVO0FBQ05DLGdCQUFJLFdBREUsRUFDV0MsSUFBSTtBQURmLFNBRHFCO0FBSS9CQyxnQkFBUSxnQkFBVUMsT0FBVixFQUFtQkMsUUFBbkIsRUFBNkI7QUFDakMsZ0JBQUlDLFNBQVNGLFFBQVFHLElBQXJCO0FBQ0FYLGNBQUVZLElBQUYsQ0FBTztBQUNIQyxxQkFBS0MsUUFBUUMsUUFBUixDQUFpQix1QkFBakIsRUFBMEMsRUFBQyxhQUFhQyxTQUFkLEVBQXlCLFNBQVMsR0FBbEMsRUFBdUMsVUFBVU4sTUFBakQsRUFBMUMsQ0FERjtBQUVITywwQkFBVSxNQUZQO0FBR0hDLHlCQUFTLGlCQUFVQyxJQUFWLEVBQWdCO0FBQ3JCViw2QkFBU1UsS0FBS0MsR0FBTCxDQUFTLGFBQUs7QUFBQ0MsMEJBQUVDLEtBQUYsR0FBVUQsRUFBRUUsY0FBWixDQUE0QixPQUFPRixDQUFQO0FBQVUscUJBQXJELENBQVQ7QUFDSDtBQUxFLGFBQVA7QUFPSCxTQWI4QjtBQWMvQkcsbUJBQVc7QUFkb0IsS0FBbkM7O0FBaUJBeEIsTUFBRSxrQkFBRixFQUFzQm1CLElBQXRCLENBQTJCLGlCQUEzQixFQUE4Q00sV0FBOUMsR0FBNEQsVUFBVUMsRUFBVixFQUFjQyxJQUFkLEVBQW9CO0FBQ3hFLFlBQUlDLFVBQVVkLFFBQVFDLFFBQVIsQ0FBaUIsa0JBQWpCLEVBQXFDLEVBQUMsYUFBYUMsU0FBZCxFQUF5QixhQUFhVyxLQUFLRSxRQUEzQyxFQUFyQyxDQUFkO0FBQ0EsWUFBSUMsT0FBTyxjQUFZRixPQUFaLEdBQW9CLHlFQUFwQixHQUFnR0QsS0FBS0osY0FBckcsR0FBc0gsYUFBakk7QUFDSixZQUFJUSxLQUFLL0IsRUFBRSxNQUFGLEVBQ0FnQyxNQURBLENBQ09GLElBRFAsRUFFQUcsUUFGQSxDQUVTUCxFQUZULENBQVQ7QUFHQSxlQUFPSyxFQUFQO0FBQ0gsS0FQRDs7QUFTQS9CLE1BQUUsc0JBQUYsRUFBMEJrQyxLQUExQixDQUFnQyxZQUFVO0FBQ3RDLFlBQUlDLGFBQWFuQyxFQUFFLGtCQUFGLEVBQXNCb0MsR0FBdEIsRUFBakI7QUFDQSxZQUFJQyxhQUFhdkIsUUFBUUMsUUFBUixDQUFpQixpQkFBakIsRUFBb0MsRUFBQyxhQUFhQyxTQUFkLEVBQXlCLFNBQVMsR0FBbEMsRUFBdUMsVUFBVW1CLFVBQWpELEVBQXBDLENBQWpCO0FBQ0FHLGVBQU9DLFFBQVAsQ0FBZ0JDLElBQWhCLEdBQXVCSCxVQUF2QjtBQUNILEtBSkQ7O0FBTUFyQyxNQUFFLGtCQUFGLEVBQXNCeUMsS0FBdEIsQ0FBNEIsVUFBU0MsS0FBVCxFQUFlO0FBQ3ZDLFlBQUdBLE1BQU1DLE9BQU4sSUFBaUIsRUFBcEIsRUFBdUI7QUFDbkIzQyxjQUFFLHNCQUFGLEVBQTBCa0MsS0FBMUI7QUFDSDtBQUNKLEtBSkQ7QUFLSCxDQXZDRCxFIiwiZmlsZSI6Im9yZ2FuaXNtL3NlYXJjaC5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJy4vc2VhcmNoL3F1aWNrU2VhcmNoLmpzeCcpXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L29yZ2FuaXNtL3NlYXJjaC5qc3giLCIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgIC8vYXV0b2NvbXBsZXRlIGZvciBvcmdhbmlzbSBzZWFyY2hcbiAgICAkKFwiI3NlYXJjaF9vcmdhbmlzbVwiKS5hdXRvY29tcGxldGUoe1xuICAgICAgICBwb3NpdGlvbjoge1xuICAgICAgICAgICAgbXk6IFwicmlnaHQgdG9wXCIsIGF0OiBcInJpZ2h0IGJvdHRvbVwiXG4gICAgICAgIH0sXG4gICAgICAgIHNvdXJjZTogZnVuY3Rpb24gKHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gICAgICAgICAgICB2YXIgc2VhcmNoID0gcmVxdWVzdC50ZXJtO1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6IFJvdXRpbmcuZ2VuZXJhdGUoJ2FwaV9saXN0aW5nX29yZ2FuaXNtcycsIHsnZGJ2ZXJzaW9uJzogZGJ2ZXJzaW9uLCAnbGltaXQnOiA1MDAsICdzZWFyY2gnOiBzZWFyY2h9KSxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UoZGF0YS5tYXAoeCA9PiB7eC52YWx1ZSA9IHguc2NpZW50aWZpY05hbWU7IHJldHVybiB4O30pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgbWluTGVuZ3RoOiAzXG4gICAgfSk7XG5cbiAgICAkKFwiI3NlYXJjaF9vcmdhbmlzbVwiKS5kYXRhKFwidWktYXV0b2NvbXBsZXRlXCIpLl9yZW5kZXJJdGVtID0gZnVuY3Rpb24gKHVsLCBpdGVtKSB7XG4gICAgICAgICAgICB2YXIgZGV0YWlscyA9IFJvdXRpbmcuZ2VuZXJhdGUoJ29yZ2FuaXNtX2RldGFpbHMnLCB7J2RidmVyc2lvbic6IGRidmVyc2lvbiwgJ2Zlbm5lY19pZCc6IGl0ZW0uZmVubmVjSWR9KTtcbiAgICAgICAgICAgIHZhciBsaW5rID0gXCI8YSBocmVmPSdcIitkZXRhaWxzK1wiJz48c3BhbiBzdHlsZT0nZGlzcGxheTppbmxpbmUtYmxvY2s7IHdpZHRoOiAxMDAlOyBmb250LXN0eWxlOiBpdGFsaWM7Jz5cIiArIGl0ZW0uc2NpZW50aWZpY05hbWUgKyBcIjwvc3Bhbj48L2E+XCI7XG4gICAgICAgIHZhciBsaSA9ICQoXCI8bGk+XCIpXG4gICAgICAgICAgICAgICAgLmFwcGVuZChsaW5rKVxuICAgICAgICAgICAgICAgIC5hcHBlbmRUbyh1bCk7XG4gICAgICAgIHJldHVybiBsaTtcbiAgICB9O1xuXG4gICAgJChcIiNidG5fc2VhcmNoX29yZ2FuaXNtXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBzZWFyY2hUZXJtID0gJChcIiNzZWFyY2hfb3JnYW5pc21cIikudmFsKCk7XG4gICAgICAgIHZhciByZXN1bHRQYWdlID0gUm91dGluZy5nZW5lcmF0ZSgnb3JnYW5pc21fcmVzdWx0JywgeydkYnZlcnNpb24nOiBkYnZlcnNpb24sICdsaW1pdCc6IDUwMCwgJ3NlYXJjaCc6IHNlYXJjaFRlcm19KTtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSByZXN1bHRQYWdlO1xuICAgIH0pO1xuXG4gICAgJChcIiNzZWFyY2hfb3JnYW5pc21cIikua2V5dXAoZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICBpZihldmVudC5rZXlDb2RlID09IDEzKXtcbiAgICAgICAgICAgICQoXCIjYnRuX3NlYXJjaF9vcmdhbmlzbVwiKS5jbGljaygpO1xuICAgICAgICB9XG4gICAgfSk7XG59KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvb3JnYW5pc20vc2VhcmNoL3F1aWNrU2VhcmNoLmpzeCJdLCJzb3VyY2VSb290IjoiIn0=