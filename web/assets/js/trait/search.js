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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ 6:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./app/Resources/client/jsx/trait/search.jsx");


/***/ })

},[6]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvdHJhaXQvc2VhcmNoLmpzeCIsIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvdHJhaXQvc2VhcmNoL3F1aWNrU2VhcmNoLmpzeCJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiJCIsImRvY3VtZW50IiwicmVhZHkiLCJhdXRvY29tcGxldGUiLCJwb3NpdGlvbiIsIm15IiwiYXQiLCJzb3VyY2UiLCJyZXF1ZXN0IiwicmVzcG9uc2UiLCJzZWFyY2giLCJ0ZXJtIiwiYWpheCIsInVybCIsIlJvdXRpbmciLCJnZW5lcmF0ZSIsImRhdGEiLCJsaW1pdCIsImRidmVyc2lvbiIsImRhdGFUeXBlIiwic3VjY2VzcyIsIm1hcCIsIngiLCJ2YWx1ZSIsIm5hbWUiLCJtaW5MZW5ndGgiLCJfcmVuZGVySXRlbSIsInVsIiwiaXRlbSIsImRldGFpbHMiLCJ0cmFpdF90eXBlX2lkIiwibGluayIsImxpIiwiYXBwZW5kIiwiYXBwZW5kVG8iLCJjbGljayIsInNlYXJjaFRlcm0iLCJ2YWwiLCJyZXN1bHRQYWdlIiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwia2V5dXAiLCJldmVudCIsImtleUNvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsbUJBQUFBLENBQVEseURBQVIsRTs7Ozs7OztBQ0FBOzs7OztBQUtBQyxFQUFFQyxRQUFGLEVBQVlDLEtBQVosQ0FBa0IsWUFBVTtBQUN4QjtBQUNBRixNQUFFLGVBQUYsRUFBbUJHLFlBQW5CLENBQWdDO0FBQzVCQyxrQkFBVTtBQUNOQyxnQkFBSSxXQURFLEVBQ1dDLElBQUk7QUFEZixTQURrQjtBQUk1QkMsZ0JBQVEsVUFBVUMsT0FBVixFQUFtQkMsUUFBbkIsRUFBNkI7QUFDakMsZ0JBQUlDLFNBQVNGLFFBQVFHLElBQXJCO0FBQ0FYLGNBQUVZLElBQUYsQ0FBTztBQUNIQyxxQkFBS0MsUUFBUUMsUUFBUixDQUFpQixLQUFqQixFQUF3QixFQUFDLGFBQWEsU0FBZCxFQUF5QixhQUFhLFFBQXRDLEVBQXhCLENBREY7QUFFSEMsc0JBQU0sRUFBQ0wsTUFBTUgsUUFBUUcsSUFBZixFQUFxQk0sT0FBTyxHQUE1QixFQUFpQ1AsUUFBUUEsTUFBekMsRUFBaURRLFdBQVdBLFNBQTVELEVBRkg7QUFHSEMsMEJBQVUsTUFIUDtBQUlIQyx5QkFBUyxVQUFVSixJQUFWLEVBQWdCO0FBQ3JCUCw2QkFBU08sS0FBS0ssR0FBTCxDQUFTQyxLQUFLO0FBQUNBLDBCQUFFQyxLQUFGLEdBQVVELEVBQUVFLElBQVosQ0FBa0IsT0FBT0YsQ0FBUDtBQUFVLHFCQUEzQyxDQUFUO0FBQ0g7QUFORSxhQUFQO0FBUUgsU0FkMkI7QUFlNUJHLG1CQUFXO0FBZmlCLEtBQWhDOztBQWtCQXpCLE1BQUUsZUFBRixFQUFtQmdCLElBQW5CLENBQXdCLGlCQUF4QixFQUEyQ1UsV0FBM0MsR0FBeUQsVUFBVUMsRUFBVixFQUFjQyxJQUFkLEVBQW9CO0FBQ3pFLFlBQUlDLFVBQVVmLFFBQVFDLFFBQVIsQ0FBaUIsZUFBakIsRUFBa0MsRUFBQyxhQUFhRyxTQUFkLEVBQXlCLGlCQUFpQlUsS0FBS0UsYUFBL0MsRUFBbEMsQ0FBZDtBQUNBLFlBQUlDLE9BQU8sY0FBWUYsT0FBWixHQUFvQix5RUFBcEIsR0FBZ0dELEtBQUtKLElBQXJHLEdBQTRHLGFBQXZIO0FBQ0EsWUFBSVEsS0FBS2hDLEVBQUUsTUFBRixFQUNBaUMsTUFEQSxDQUNPRixJQURQLEVBRUFHLFFBRkEsQ0FFU1AsRUFGVCxDQUFUO0FBR0EsZUFBT0ssRUFBUDtBQUNILEtBUEQ7O0FBU0FoQyxNQUFFLG1CQUFGLEVBQXVCbUMsS0FBdkIsQ0FBNkIsWUFBVTtBQUNuQyxZQUFJQyxhQUFhcEMsRUFBRSxlQUFGLEVBQW1CcUMsR0FBbkIsRUFBakI7QUFDQSxZQUFJQyxhQUFheEIsUUFBUUMsUUFBUixDQUFpQixjQUFqQixFQUFpQyxFQUFDLGFBQWFHLFNBQWQsRUFBeUIsU0FBUyxHQUFsQyxFQUF1QyxVQUFVa0IsVUFBakQsRUFBakMsQ0FBakI7QUFDQUcsZUFBT0MsUUFBUCxDQUFnQkMsSUFBaEIsR0FBdUJILFVBQXZCO0FBQ0gsS0FKRDs7QUFNQXRDLE1BQUUsZUFBRixFQUFtQjBDLEtBQW5CLENBQXlCLFVBQVNDLEtBQVQsRUFBZTtBQUNwQyxZQUFHQSxNQUFNQyxPQUFOLElBQWlCLEVBQXBCLEVBQXVCO0FBQ25CNUMsY0FBRSxtQkFBRixFQUF1Qm1DLEtBQXZCO0FBQ0g7QUFDSixLQUpEO0FBS0gsQ0F4Q0QsRSIsImZpbGUiOiJ0cmFpdC9zZWFyY2guanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCcuL3NlYXJjaC9xdWlja1NlYXJjaC5qc3gnKVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9SZXNvdXJjZXMvY2xpZW50L2pzeC90cmFpdC9zZWFyY2guanN4IiwiLypcbiAqIGdsb2JhbCAkXG4gKiBnbG9iYWwgZGJ2ZXJzaW9uXG4gKi9cblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAvL2F1dG9jb21wbGV0ZSBmb3IgdHJhaXQgc2VhcmNoXG4gICAgJChcIiNzZWFyY2hfdHJhaXRcIikuYXV0b2NvbXBsZXRlKHtcbiAgICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgICAgIG15OiBcInJpZ2h0IHRvcFwiLCBhdDogXCJyaWdodCBib3R0b21cIlxuICAgICAgICB9LFxuICAgICAgICBzb3VyY2U6IGZ1bmN0aW9uIChyZXF1ZXN0LCByZXNwb25zZSkge1xuICAgICAgICAgICAgdmFyIHNlYXJjaCA9IHJlcXVlc3QudGVybTtcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiBSb3V0aW5nLmdlbmVyYXRlKCdhcGknLCB7J25hbWVzcGFjZSc6ICdsaXN0aW5nJywgJ2NsYXNzbmFtZSc6ICd0cmFpdHMnfSksXG4gICAgICAgICAgICAgICAgZGF0YToge3Rlcm06IHJlcXVlc3QudGVybSwgbGltaXQ6IDUwMCwgc2VhcmNoOiBzZWFyY2gsIGRidmVyc2lvbjogZGJ2ZXJzaW9ufSxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UoZGF0YS5tYXAoeCA9PiB7eC52YWx1ZSA9IHgubmFtZTsgcmV0dXJuIHg7fSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBtaW5MZW5ndGg6IDNcbiAgICB9KTtcblxuICAgICQoXCIjc2VhcmNoX3RyYWl0XCIpLmRhdGEoXCJ1aS1hdXRvY29tcGxldGVcIikuX3JlbmRlckl0ZW0gPSBmdW5jdGlvbiAodWwsIGl0ZW0pIHtcbiAgICAgICAgdmFyIGRldGFpbHMgPSBSb3V0aW5nLmdlbmVyYXRlKCd0cmFpdF9kZXRhaWxzJywgeydkYnZlcnNpb24nOiBkYnZlcnNpb24sICd0cmFpdF90eXBlX2lkJzogaXRlbS50cmFpdF90eXBlX2lkfSk7XG4gICAgICAgIHZhciBsaW5rID0gXCI8YSBocmVmPSdcIitkZXRhaWxzK1wiJz48c3BhbiBzdHlsZT0nZGlzcGxheTppbmxpbmUtYmxvY2s7IHdpZHRoOiAxMDAlOyBmb250LXN0eWxlOiBpdGFsaWM7Jz5cIiArIGl0ZW0ubmFtZSArIFwiPC9zcGFuPjwvYT5cIjtcbiAgICAgICAgdmFyIGxpID0gJChcIjxsaT5cIilcbiAgICAgICAgICAgICAgICAuYXBwZW5kKGxpbmspXG4gICAgICAgICAgICAgICAgLmFwcGVuZFRvKHVsKTtcbiAgICAgICAgcmV0dXJuIGxpO1xuICAgIH07XG5cbiAgICAkKFwiI2J0bl9zZWFyY2hfdHJhaXRcIikuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHNlYXJjaFRlcm0gPSAkKFwiI3NlYXJjaF90cmFpdFwiKS52YWwoKTtcbiAgICAgICAgdmFyIHJlc3VsdFBhZ2UgPSBSb3V0aW5nLmdlbmVyYXRlKCd0cmFpdF9yZXN1bHQnLCB7J2RidmVyc2lvbic6IGRidmVyc2lvbiwgJ2xpbWl0JzogNTAwLCAnc2VhcmNoJzogc2VhcmNoVGVybX0pO1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHJlc3VsdFBhZ2U7XG4gICAgfSk7XG5cbiAgICAkKFwiI3NlYXJjaF90cmFpdFwiKS5rZXl1cChmdW5jdGlvbihldmVudCl7XG4gICAgICAgIGlmKGV2ZW50LmtleUNvZGUgPT0gMTMpe1xuICAgICAgICAgICAgJChcIiNidG5fc2VhcmNoX3RyYWl0XCIpLmNsaWNrKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9SZXNvdXJjZXMvY2xpZW50L2pzeC90cmFpdC9zZWFyY2gvcXVpY2tTZWFyY2guanN4Il0sInNvdXJjZVJvb3QiOiIifQ==