webpackJsonp([6],{

/***/ "./app/Resources/client/jsx/trait/search.jsx":
/*!***************************************************!*\
  !*** ./app/Resources/client/jsx/trait/search.jsx ***!
  \***************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./search/quickSearch.jsx */ "./app/Resources/client/jsx/trait/search/quickSearch.jsx");

/***/ }),

/***/ "./app/Resources/client/jsx/trait/search/quickSearch.jsx":
/*!***************************************************************!*\
  !*** ./app/Resources/client/jsx/trait/search/quickSearch.jsx ***!
  \***************************************************************/
/*! no static exports found */
/*! all exports used */
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
                url: Routing.generate('api_listing_traits', { 'dbversion': dbversion, 'limit': 500, 'search': search }),
                dataType: "json",
                success: function success(data) {
                    response(data.map(function (x) {
                        x.value = x.type;return x;
                    }));
                }
            });
        },
        minLength: 3
    });

    $("#search_trait").data("ui-autocomplete")._renderItem = function (ul, item) {
        var details = Routing.generate('trait_details', { 'dbversion': dbversion, 'trait_type_id': item.traitTypeId });
        var link = "<a href='" + details + "'><span style='display:inline-block; width: 100%; font-style: italic;'>" + item.value + "</span></a>";
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ 6:
/*!*********************************************************!*\
  !*** multi ./app/Resources/client/jsx/trait/search.jsx ***!
  \*********************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./app/Resources/client/jsx/trait/search.jsx */"./app/Resources/client/jsx/trait/search.jsx");


/***/ })

},[6]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvdHJhaXQvc2VhcmNoLmpzeCIsIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvdHJhaXQvc2VhcmNoL3F1aWNrU2VhcmNoLmpzeCJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiJCIsImRvY3VtZW50IiwicmVhZHkiLCJhdXRvY29tcGxldGUiLCJwb3NpdGlvbiIsIm15IiwiYXQiLCJzb3VyY2UiLCJyZXF1ZXN0IiwicmVzcG9uc2UiLCJzZWFyY2giLCJ0ZXJtIiwiYWpheCIsInVybCIsIlJvdXRpbmciLCJnZW5lcmF0ZSIsImRidmVyc2lvbiIsImRhdGFUeXBlIiwic3VjY2VzcyIsImRhdGEiLCJtYXAiLCJ4IiwidmFsdWUiLCJ0eXBlIiwibWluTGVuZ3RoIiwiX3JlbmRlckl0ZW0iLCJ1bCIsIml0ZW0iLCJkZXRhaWxzIiwidHJhaXRUeXBlSWQiLCJsaW5rIiwibGkiLCJhcHBlbmQiLCJhcHBlbmRUbyIsImNsaWNrIiwic2VhcmNoVGVybSIsInZhbCIsInJlc3VsdFBhZ2UiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhyZWYiLCJrZXl1cCIsImV2ZW50Iiwia2V5Q29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLG1CQUFBQSxDQUFRLHlGQUFSLEU7Ozs7Ozs7Ozs7OztBQ0FBOzs7OztBQUtBQyxFQUFFQyxRQUFGLEVBQVlDLEtBQVosQ0FBa0IsWUFBVTtBQUN4QjtBQUNBRixNQUFFLGVBQUYsRUFBbUJHLFlBQW5CLENBQWdDO0FBQzVCQyxrQkFBVTtBQUNOQyxnQkFBSSxXQURFLEVBQ1dDLElBQUk7QUFEZixTQURrQjtBQUk1QkMsZ0JBQVEsZ0JBQVVDLE9BQVYsRUFBbUJDLFFBQW5CLEVBQTZCO0FBQ2pDLGdCQUFJQyxTQUFTRixRQUFRRyxJQUFyQjtBQUNBWCxjQUFFWSxJQUFGLENBQU87QUFDSEMscUJBQUtDLFFBQVFDLFFBQVIsQ0FBaUIsb0JBQWpCLEVBQXVDLEVBQUMsYUFBYUMsU0FBZCxFQUF5QixTQUFTLEdBQWxDLEVBQXVDLFVBQVVOLE1BQWpELEVBQXZDLENBREY7QUFFSE8sMEJBQVUsTUFGUDtBQUdIQyx5QkFBUyxpQkFBVUMsSUFBVixFQUFnQjtBQUNyQlYsNkJBQVNVLEtBQUtDLEdBQUwsQ0FBUyxhQUFLO0FBQUNDLDBCQUFFQyxLQUFGLEdBQVVELEVBQUVFLElBQVosQ0FBa0IsT0FBT0YsQ0FBUDtBQUFVLHFCQUEzQyxDQUFUO0FBQ0g7QUFMRSxhQUFQO0FBT0gsU0FiMkI7QUFjNUJHLG1CQUFXO0FBZGlCLEtBQWhDOztBQWlCQXhCLE1BQUUsZUFBRixFQUFtQm1CLElBQW5CLENBQXdCLGlCQUF4QixFQUEyQ00sV0FBM0MsR0FBeUQsVUFBVUMsRUFBVixFQUFjQyxJQUFkLEVBQW9CO0FBQ3pFLFlBQUlDLFVBQVVkLFFBQVFDLFFBQVIsQ0FBaUIsZUFBakIsRUFBa0MsRUFBQyxhQUFhQyxTQUFkLEVBQXlCLGlCQUFpQlcsS0FBS0UsV0FBL0MsRUFBbEMsQ0FBZDtBQUNBLFlBQUlDLE9BQU8sY0FBWUYsT0FBWixHQUFvQix5RUFBcEIsR0FBZ0dELEtBQUtMLEtBQXJHLEdBQTZHLGFBQXhIO0FBQ0EsWUFBSVMsS0FBSy9CLEVBQUUsTUFBRixFQUNBZ0MsTUFEQSxDQUNPRixJQURQLEVBRUFHLFFBRkEsQ0FFU1AsRUFGVCxDQUFUO0FBR0EsZUFBT0ssRUFBUDtBQUNILEtBUEQ7O0FBU0EvQixNQUFFLG1CQUFGLEVBQXVCa0MsS0FBdkIsQ0FBNkIsWUFBVTtBQUNuQyxZQUFJQyxhQUFhbkMsRUFBRSxlQUFGLEVBQW1Cb0MsR0FBbkIsRUFBakI7QUFDQSxZQUFJQyxhQUFhdkIsUUFBUUMsUUFBUixDQUFpQixjQUFqQixFQUFpQyxFQUFDLGFBQWFDLFNBQWQsRUFBeUIsU0FBUyxHQUFsQyxFQUF1QyxVQUFVbUIsVUFBakQsRUFBakMsQ0FBakI7QUFDQUcsZUFBT0MsUUFBUCxDQUFnQkMsSUFBaEIsR0FBdUJILFVBQXZCO0FBQ0gsS0FKRDs7QUFNQXJDLE1BQUUsZUFBRixFQUFtQnlDLEtBQW5CLENBQXlCLFVBQVNDLEtBQVQsRUFBZTtBQUNwQyxZQUFHQSxNQUFNQyxPQUFOLElBQWlCLEVBQXBCLEVBQXVCO0FBQ25CM0MsY0FBRSxtQkFBRixFQUF1QmtDLEtBQXZCO0FBQ0g7QUFDSixLQUpEO0FBS0gsQ0F2Q0QsRSIsImZpbGUiOiJ0cmFpdC9zZWFyY2guanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCcuL3NlYXJjaC9xdWlja1NlYXJjaC5qc3gnKVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9SZXNvdXJjZXMvY2xpZW50L2pzeC90cmFpdC9zZWFyY2guanN4IiwiLypcbiAqIGdsb2JhbCAkXG4gKiBnbG9iYWwgZGJ2ZXJzaW9uXG4gKi9cblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAvL2F1dG9jb21wbGV0ZSBmb3IgdHJhaXQgc2VhcmNoXG4gICAgJChcIiNzZWFyY2hfdHJhaXRcIikuYXV0b2NvbXBsZXRlKHtcbiAgICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgICAgIG15OiBcInJpZ2h0IHRvcFwiLCBhdDogXCJyaWdodCBib3R0b21cIlxuICAgICAgICB9LFxuICAgICAgICBzb3VyY2U6IGZ1bmN0aW9uIChyZXF1ZXN0LCByZXNwb25zZSkge1xuICAgICAgICAgICAgdmFyIHNlYXJjaCA9IHJlcXVlc3QudGVybTtcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiBSb3V0aW5nLmdlbmVyYXRlKCdhcGlfbGlzdGluZ190cmFpdHMnLCB7J2RidmVyc2lvbic6IGRidmVyc2lvbiwgJ2xpbWl0JzogNTAwLCAnc2VhcmNoJzogc2VhcmNofSksXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlKGRhdGEubWFwKHggPT4ge3gudmFsdWUgPSB4LnR5cGU7IHJldHVybiB4O30pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgbWluTGVuZ3RoOiAzXG4gICAgfSk7XG5cbiAgICAkKFwiI3NlYXJjaF90cmFpdFwiKS5kYXRhKFwidWktYXV0b2NvbXBsZXRlXCIpLl9yZW5kZXJJdGVtID0gZnVuY3Rpb24gKHVsLCBpdGVtKSB7XG4gICAgICAgIHZhciBkZXRhaWxzID0gUm91dGluZy5nZW5lcmF0ZSgndHJhaXRfZGV0YWlscycsIHsnZGJ2ZXJzaW9uJzogZGJ2ZXJzaW9uLCAndHJhaXRfdHlwZV9pZCc6IGl0ZW0udHJhaXRUeXBlSWR9KTtcbiAgICAgICAgdmFyIGxpbmsgPSBcIjxhIGhyZWY9J1wiK2RldGFpbHMrXCInPjxzcGFuIHN0eWxlPSdkaXNwbGF5OmlubGluZS1ibG9jazsgd2lkdGg6IDEwMCU7IGZvbnQtc3R5bGU6IGl0YWxpYzsnPlwiICsgaXRlbS52YWx1ZSArIFwiPC9zcGFuPjwvYT5cIjtcbiAgICAgICAgdmFyIGxpID0gJChcIjxsaT5cIilcbiAgICAgICAgICAgICAgICAuYXBwZW5kKGxpbmspXG4gICAgICAgICAgICAgICAgLmFwcGVuZFRvKHVsKTtcbiAgICAgICAgcmV0dXJuIGxpO1xuICAgIH07XG5cbiAgICAkKFwiI2J0bl9zZWFyY2hfdHJhaXRcIikuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHNlYXJjaFRlcm0gPSAkKFwiI3NlYXJjaF90cmFpdFwiKS52YWwoKTtcbiAgICAgICAgdmFyIHJlc3VsdFBhZ2UgPSBSb3V0aW5nLmdlbmVyYXRlKCd0cmFpdF9yZXN1bHQnLCB7J2RidmVyc2lvbic6IGRidmVyc2lvbiwgJ2xpbWl0JzogNTAwLCAnc2VhcmNoJzogc2VhcmNoVGVybX0pO1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHJlc3VsdFBhZ2U7XG4gICAgfSk7XG5cbiAgICAkKFwiI3NlYXJjaF90cmFpdFwiKS5rZXl1cChmdW5jdGlvbihldmVudCl7XG4gICAgICAgIGlmKGV2ZW50LmtleUNvZGUgPT0gMTMpe1xuICAgICAgICAgICAgJChcIiNidG5fc2VhcmNoX3RyYWl0XCIpLmNsaWNrKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9SZXNvdXJjZXMvY2xpZW50L2pzeC90cmFpdC9zZWFyY2gvcXVpY2tTZWFyY2guanN4Il0sInNvdXJjZVJvb3QiOiIifQ==