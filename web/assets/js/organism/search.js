webpackJsonp([7],{

/***/ "./app/Resources/client/jsx/organism/search.jsx":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("./app/Resources/client/jsx/organism/search/quickSearch.jsx");

/***/ }),

/***/ "./app/Resources/client/jsx/organism/search/quickSearch.jsx":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {$(document).ready(function () {
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ 4:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./app/Resources/client/jsx/organism/search.jsx");


/***/ })

},[4]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvb3JnYW5pc20vc2VhcmNoLmpzeCIsIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvb3JnYW5pc20vc2VhcmNoL3F1aWNrU2VhcmNoLmpzeCJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiJCIsImRvY3VtZW50IiwicmVhZHkiLCJhdXRvY29tcGxldGUiLCJwb3NpdGlvbiIsIm15IiwiYXQiLCJzb3VyY2UiLCJyZXF1ZXN0IiwicmVzcG9uc2UiLCJzZWFyY2giLCJ0ZXJtIiwiYWpheCIsInVybCIsIlJvdXRpbmciLCJnZW5lcmF0ZSIsImRhdGEiLCJsaW1pdCIsImRidmVyc2lvbiIsImRhdGFUeXBlIiwic3VjY2VzcyIsIm1hcCIsIngiLCJ2YWx1ZSIsInNjaWVudGlmaWNfbmFtZSIsIm1pbkxlbmd0aCIsIl9yZW5kZXJJdGVtIiwidWwiLCJpdGVtIiwiZGV0YWlscyIsImZlbm5lY19pZCIsImxpbmsiLCJsaSIsImFwcGVuZCIsImFwcGVuZFRvIiwiY2xpY2siLCJzZWFyY2hUZXJtIiwidmFsIiwicmVzdWx0UGFnZSIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsImtleXVwIiwiZXZlbnQiLCJrZXlDb2RlIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG1CQUFBQSxDQUFRLDREQUFSLEU7Ozs7Ozs7QUNBQSx5Q0FBQUMsRUFBRUMsUUFBRixFQUFZQyxLQUFaLENBQWtCLFlBQVU7QUFDeEI7QUFDQUYsTUFBRSxrQkFBRixFQUFzQkcsWUFBdEIsQ0FBbUM7QUFDL0JDLGtCQUFVO0FBQ05DLGdCQUFJLFdBREUsRUFDV0MsSUFBSTtBQURmLFNBRHFCO0FBSS9CQyxnQkFBUSxVQUFVQyxPQUFWLEVBQW1CQyxRQUFuQixFQUE2QjtBQUNqQyxnQkFBSUMsU0FBU0YsUUFBUUcsSUFBckI7QUFDQVgsY0FBRVksSUFBRixDQUFPO0FBQ0hDLHFCQUFLQyxRQUFRQyxRQUFSLENBQWlCLEtBQWpCLEVBQXdCLEVBQUMsYUFBYSxTQUFkLEVBQXlCLGFBQWEsV0FBdEMsRUFBeEIsQ0FERjtBQUVIQyxzQkFBTSxFQUFDTCxNQUFPSCxRQUFRRyxJQUFoQixFQUFzQk0sT0FBTyxHQUE3QixFQUFrQ1AsUUFBUUEsTUFBMUMsRUFBa0RRLFdBQVdBLFNBQTdELEVBRkg7QUFHSEMsMEJBQVUsTUFIUDtBQUlIQyx5QkFBUyxVQUFVSixJQUFWLEVBQWdCO0FBQ3JCUCw2QkFBU08sS0FBS0ssR0FBTCxDQUFTQyxLQUFLO0FBQUNBLDBCQUFFQyxLQUFGLEdBQVVELEVBQUVFLGVBQVosQ0FBNkIsT0FBT0YsQ0FBUDtBQUFVLHFCQUF0RCxDQUFUO0FBQ0g7QUFORSxhQUFQO0FBUUgsU0FkOEI7QUFlL0JHLG1CQUFXO0FBZm9CLEtBQW5DOztBQWtCQXpCLE1BQUUsa0JBQUYsRUFBc0JnQixJQUF0QixDQUEyQixpQkFBM0IsRUFBOENVLFdBQTlDLEdBQTRELFVBQVVDLEVBQVYsRUFBY0MsSUFBZCxFQUFvQjtBQUN4RSxZQUFJQyxVQUFVZixRQUFRQyxRQUFSLENBQWlCLGtCQUFqQixFQUFxQyxFQUFDLGFBQWFHLFNBQWQsRUFBeUIsYUFBYVUsS0FBS0UsU0FBM0MsRUFBckMsQ0FBZDtBQUNBLFlBQUlDLE9BQU8sY0FBWUYsT0FBWixHQUFvQix5RUFBcEIsR0FBZ0dELEtBQUtKLGVBQXJHLEdBQXVILGFBQWxJO0FBQ0osWUFBSVEsS0FBS2hDLEVBQUUsTUFBRixFQUNBaUMsTUFEQSxDQUNPRixJQURQLEVBRUFHLFFBRkEsQ0FFU1AsRUFGVCxDQUFUO0FBR0EsZUFBT0ssRUFBUDtBQUNILEtBUEQ7O0FBU0FoQyxNQUFFLHNCQUFGLEVBQTBCbUMsS0FBMUIsQ0FBZ0MsWUFBVTtBQUN0QyxZQUFJQyxhQUFhcEMsRUFBRSxrQkFBRixFQUFzQnFDLEdBQXRCLEVBQWpCO0FBQ0EsWUFBSUMsYUFBYXhCLFFBQVFDLFFBQVIsQ0FBaUIsaUJBQWpCLEVBQW9DLEVBQUMsYUFBYUcsU0FBZCxFQUF5QixTQUFTLEdBQWxDLEVBQXVDLFVBQVVrQixVQUFqRCxFQUFwQyxDQUFqQjtBQUNBRyxlQUFPQyxRQUFQLENBQWdCQyxJQUFoQixHQUF1QkgsVUFBdkI7QUFDSCxLQUpEOztBQU1BdEMsTUFBRSxrQkFBRixFQUFzQjBDLEtBQXRCLENBQTRCLFVBQVNDLEtBQVQsRUFBZTtBQUN2QyxZQUFHQSxNQUFNQyxPQUFOLElBQWlCLEVBQXBCLEVBQXVCO0FBQ25CNUMsY0FBRSxzQkFBRixFQUEwQm1DLEtBQTFCO0FBQ0g7QUFDSixLQUpEO0FBS0gsQ0F4Q0QsRSIsImZpbGUiOiJvcmdhbmlzbS9zZWFyY2guanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCcuL3NlYXJjaC9xdWlja1NlYXJjaC5qc3gnKVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9SZXNvdXJjZXMvY2xpZW50L2pzeC9vcmdhbmlzbS9zZWFyY2guanN4IiwiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAvL2F1dG9jb21wbGV0ZSBmb3Igb3JnYW5pc20gc2VhcmNoXG4gICAgJChcIiNzZWFyY2hfb3JnYW5pc21cIikuYXV0b2NvbXBsZXRlKHtcbiAgICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgICAgIG15OiBcInJpZ2h0IHRvcFwiLCBhdDogXCJyaWdodCBib3R0b21cIlxuICAgICAgICB9LFxuICAgICAgICBzb3VyY2U6IGZ1bmN0aW9uIChyZXF1ZXN0LCByZXNwb25zZSkge1xuICAgICAgICAgICAgdmFyIHNlYXJjaCA9IHJlcXVlc3QudGVybTtcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiBSb3V0aW5nLmdlbmVyYXRlKCdhcGknLCB7J25hbWVzcGFjZSc6ICdsaXN0aW5nJywgJ2NsYXNzbmFtZSc6ICdvcmdhbmlzbXMnfSksXG4gICAgICAgICAgICAgICAgZGF0YToge3Rlcm06ICByZXF1ZXN0LnRlcm0sIGxpbWl0OiA1MDAsIHNlYXJjaDogc2VhcmNoLCBkYnZlcnNpb246IGRidmVyc2lvbn0sXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlKGRhdGEubWFwKHggPT4ge3gudmFsdWUgPSB4LnNjaWVudGlmaWNfbmFtZTsgcmV0dXJuIHg7fSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBtaW5MZW5ndGg6IDNcbiAgICB9KTtcblxuICAgICQoXCIjc2VhcmNoX29yZ2FuaXNtXCIpLmRhdGEoXCJ1aS1hdXRvY29tcGxldGVcIikuX3JlbmRlckl0ZW0gPSBmdW5jdGlvbiAodWwsIGl0ZW0pIHtcbiAgICAgICAgICAgIHZhciBkZXRhaWxzID0gUm91dGluZy5nZW5lcmF0ZSgnb3JnYW5pc21fZGV0YWlscycsIHsnZGJ2ZXJzaW9uJzogZGJ2ZXJzaW9uLCAnZmVubmVjX2lkJzogaXRlbS5mZW5uZWNfaWR9KTtcbiAgICAgICAgICAgIHZhciBsaW5rID0gXCI8YSBocmVmPSdcIitkZXRhaWxzK1wiJz48c3BhbiBzdHlsZT0nZGlzcGxheTppbmxpbmUtYmxvY2s7IHdpZHRoOiAxMDAlOyBmb250LXN0eWxlOiBpdGFsaWM7Jz5cIiArIGl0ZW0uc2NpZW50aWZpY19uYW1lICsgXCI8L3NwYW4+PC9hPlwiO1xuICAgICAgICB2YXIgbGkgPSAkKFwiPGxpPlwiKVxuICAgICAgICAgICAgICAgIC5hcHBlbmQobGluaylcbiAgICAgICAgICAgICAgICAuYXBwZW5kVG8odWwpO1xuICAgICAgICByZXR1cm4gbGk7XG4gICAgfTtcblxuICAgICQoXCIjYnRuX3NlYXJjaF9vcmdhbmlzbVwiKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICB2YXIgc2VhcmNoVGVybSA9ICQoXCIjc2VhcmNoX29yZ2FuaXNtXCIpLnZhbCgpO1xuICAgICAgICB2YXIgcmVzdWx0UGFnZSA9IFJvdXRpbmcuZ2VuZXJhdGUoJ29yZ2FuaXNtX3Jlc3VsdCcsIHsnZGJ2ZXJzaW9uJzogZGJ2ZXJzaW9uLCAnbGltaXQnOiA1MDAsICdzZWFyY2gnOiBzZWFyY2hUZXJtfSk7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcmVzdWx0UGFnZTtcbiAgICB9KTtcblxuICAgICQoXCIjc2VhcmNoX29yZ2FuaXNtXCIpLmtleXVwKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgaWYoZXZlbnQua2V5Q29kZSA9PSAxMyl7XG4gICAgICAgICAgICAkKFwiI2J0bl9zZWFyY2hfb3JnYW5pc21cIikuY2xpY2soKTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L29yZ2FuaXNtL3NlYXJjaC9xdWlja1NlYXJjaC5qc3giXSwic291cmNlUm9vdCI6IiJ9