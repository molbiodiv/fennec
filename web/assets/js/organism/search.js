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
        source: function source(request, response) {
            var search = request.term;
            $.ajax({
                url: Routing.generate('api', { 'namespace': 'listing', 'classname': 'organisms' }),
                data: { term: request.term, limit: 500, search: search, dbversion: dbversion },
                dataType: "json",
                success: function success(data) {
                    response(data.map(function (x) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvb3JnYW5pc20vc2VhcmNoLmpzeCIsIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvb3JnYW5pc20vc2VhcmNoL3F1aWNrU2VhcmNoLmpzeCJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiJCIsImRvY3VtZW50IiwicmVhZHkiLCJhdXRvY29tcGxldGUiLCJwb3NpdGlvbiIsIm15IiwiYXQiLCJzb3VyY2UiLCJyZXF1ZXN0IiwicmVzcG9uc2UiLCJzZWFyY2giLCJ0ZXJtIiwiYWpheCIsInVybCIsIlJvdXRpbmciLCJnZW5lcmF0ZSIsImRhdGEiLCJsaW1pdCIsImRidmVyc2lvbiIsImRhdGFUeXBlIiwic3VjY2VzcyIsIm1hcCIsIngiLCJ2YWx1ZSIsInNjaWVudGlmaWNfbmFtZSIsIm1pbkxlbmd0aCIsIl9yZW5kZXJJdGVtIiwidWwiLCJpdGVtIiwiZGV0YWlscyIsImZlbm5lY19pZCIsImxpbmsiLCJsaSIsImFwcGVuZCIsImFwcGVuZFRvIiwiY2xpY2siLCJzZWFyY2hUZXJtIiwidmFsIiwicmVzdWx0UGFnZSIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsImtleXVwIiwiZXZlbnQiLCJrZXlDb2RlIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG1CQUFBQSxDQUFRLDREQUFSLEU7Ozs7Ozs7QUNBQSx5Q0FBQUMsRUFBRUMsUUFBRixFQUFZQyxLQUFaLENBQWtCLFlBQVU7QUFDeEI7QUFDQUYsTUFBRSxrQkFBRixFQUFzQkcsWUFBdEIsQ0FBbUM7QUFDL0JDLGtCQUFVO0FBQ05DLGdCQUFJLFdBREUsRUFDV0MsSUFBSTtBQURmLFNBRHFCO0FBSS9CQyxnQkFBUSxnQkFBVUMsT0FBVixFQUFtQkMsUUFBbkIsRUFBNkI7QUFDakMsZ0JBQUlDLFNBQVNGLFFBQVFHLElBQXJCO0FBQ0FYLGNBQUVZLElBQUYsQ0FBTztBQUNIQyxxQkFBS0MsUUFBUUMsUUFBUixDQUFpQixLQUFqQixFQUF3QixFQUFDLGFBQWEsU0FBZCxFQUF5QixhQUFhLFdBQXRDLEVBQXhCLENBREY7QUFFSEMsc0JBQU0sRUFBQ0wsTUFBT0gsUUFBUUcsSUFBaEIsRUFBc0JNLE9BQU8sR0FBN0IsRUFBa0NQLFFBQVFBLE1BQTFDLEVBQWtEUSxXQUFXQSxTQUE3RCxFQUZIO0FBR0hDLDBCQUFVLE1BSFA7QUFJSEMseUJBQVMsaUJBQVVKLElBQVYsRUFBZ0I7QUFDckJQLDZCQUFTTyxLQUFLSyxHQUFMLENBQVMsYUFBSztBQUFDQywwQkFBRUMsS0FBRixHQUFVRCxFQUFFRSxlQUFaLENBQTZCLE9BQU9GLENBQVA7QUFBVSxxQkFBdEQsQ0FBVDtBQUNIO0FBTkUsYUFBUDtBQVFILFNBZDhCO0FBZS9CRyxtQkFBVztBQWZvQixLQUFuQzs7QUFrQkF6QixNQUFFLGtCQUFGLEVBQXNCZ0IsSUFBdEIsQ0FBMkIsaUJBQTNCLEVBQThDVSxXQUE5QyxHQUE0RCxVQUFVQyxFQUFWLEVBQWNDLElBQWQsRUFBb0I7QUFDeEUsWUFBSUMsVUFBVWYsUUFBUUMsUUFBUixDQUFpQixrQkFBakIsRUFBcUMsRUFBQyxhQUFhRyxTQUFkLEVBQXlCLGFBQWFVLEtBQUtFLFNBQTNDLEVBQXJDLENBQWQ7QUFDQSxZQUFJQyxPQUFPLGNBQVlGLE9BQVosR0FBb0IseUVBQXBCLEdBQWdHRCxLQUFLSixlQUFyRyxHQUF1SCxhQUFsSTtBQUNKLFlBQUlRLEtBQUtoQyxFQUFFLE1BQUYsRUFDQWlDLE1BREEsQ0FDT0YsSUFEUCxFQUVBRyxRQUZBLENBRVNQLEVBRlQsQ0FBVDtBQUdBLGVBQU9LLEVBQVA7QUFDSCxLQVBEOztBQVNBaEMsTUFBRSxzQkFBRixFQUEwQm1DLEtBQTFCLENBQWdDLFlBQVU7QUFDdEMsWUFBSUMsYUFBYXBDLEVBQUUsa0JBQUYsRUFBc0JxQyxHQUF0QixFQUFqQjtBQUNBLFlBQUlDLGFBQWF4QixRQUFRQyxRQUFSLENBQWlCLGlCQUFqQixFQUFvQyxFQUFDLGFBQWFHLFNBQWQsRUFBeUIsU0FBUyxHQUFsQyxFQUF1QyxVQUFVa0IsVUFBakQsRUFBcEMsQ0FBakI7QUFDQUcsZUFBT0MsUUFBUCxDQUFnQkMsSUFBaEIsR0FBdUJILFVBQXZCO0FBQ0gsS0FKRDs7QUFNQXRDLE1BQUUsa0JBQUYsRUFBc0IwQyxLQUF0QixDQUE0QixVQUFTQyxLQUFULEVBQWU7QUFDdkMsWUFBR0EsTUFBTUMsT0FBTixJQUFpQixFQUFwQixFQUF1QjtBQUNuQjVDLGNBQUUsc0JBQUYsRUFBMEJtQyxLQUExQjtBQUNIO0FBQ0osS0FKRDtBQUtILENBeENELEUiLCJmaWxlIjoib3JnYW5pc20vc2VhcmNoLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnLi9zZWFyY2gvcXVpY2tTZWFyY2guanN4JylcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvb3JnYW5pc20vc2VhcmNoLmpzeCIsIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgLy9hdXRvY29tcGxldGUgZm9yIG9yZ2FuaXNtIHNlYXJjaFxuICAgICQoXCIjc2VhcmNoX29yZ2FuaXNtXCIpLmF1dG9jb21wbGV0ZSh7XG4gICAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgICAgICBteTogXCJyaWdodCB0b3BcIiwgYXQ6IFwicmlnaHQgYm90dG9tXCJcbiAgICAgICAgfSxcbiAgICAgICAgc291cmNlOiBmdW5jdGlvbiAocmVxdWVzdCwgcmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHZhciBzZWFyY2ggPSByZXF1ZXN0LnRlcm07XG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogUm91dGluZy5nZW5lcmF0ZSgnYXBpJywgeyduYW1lc3BhY2UnOiAnbGlzdGluZycsICdjbGFzc25hbWUnOiAnb3JnYW5pc21zJ30pLFxuICAgICAgICAgICAgICAgIGRhdGE6IHt0ZXJtOiAgcmVxdWVzdC50ZXJtLCBsaW1pdDogNTAwLCBzZWFyY2g6IHNlYXJjaCwgZGJ2ZXJzaW9uOiBkYnZlcnNpb259LFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICByZXNwb25zZShkYXRhLm1hcCh4ID0+IHt4LnZhbHVlID0geC5zY2llbnRpZmljX25hbWU7IHJldHVybiB4O30pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgbWluTGVuZ3RoOiAzXG4gICAgfSk7XG5cbiAgICAkKFwiI3NlYXJjaF9vcmdhbmlzbVwiKS5kYXRhKFwidWktYXV0b2NvbXBsZXRlXCIpLl9yZW5kZXJJdGVtID0gZnVuY3Rpb24gKHVsLCBpdGVtKSB7XG4gICAgICAgICAgICB2YXIgZGV0YWlscyA9IFJvdXRpbmcuZ2VuZXJhdGUoJ29yZ2FuaXNtX2RldGFpbHMnLCB7J2RidmVyc2lvbic6IGRidmVyc2lvbiwgJ2Zlbm5lY19pZCc6IGl0ZW0uZmVubmVjX2lkfSk7XG4gICAgICAgICAgICB2YXIgbGluayA9IFwiPGEgaHJlZj0nXCIrZGV0YWlscytcIic+PHNwYW4gc3R5bGU9J2Rpc3BsYXk6aW5saW5lLWJsb2NrOyB3aWR0aDogMTAwJTsgZm9udC1zdHlsZTogaXRhbGljOyc+XCIgKyBpdGVtLnNjaWVudGlmaWNfbmFtZSArIFwiPC9zcGFuPjwvYT5cIjtcbiAgICAgICAgdmFyIGxpID0gJChcIjxsaT5cIilcbiAgICAgICAgICAgICAgICAuYXBwZW5kKGxpbmspXG4gICAgICAgICAgICAgICAgLmFwcGVuZFRvKHVsKTtcbiAgICAgICAgcmV0dXJuIGxpO1xuICAgIH07XG5cbiAgICAkKFwiI2J0bl9zZWFyY2hfb3JnYW5pc21cIikuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHNlYXJjaFRlcm0gPSAkKFwiI3NlYXJjaF9vcmdhbmlzbVwiKS52YWwoKTtcbiAgICAgICAgdmFyIHJlc3VsdFBhZ2UgPSBSb3V0aW5nLmdlbmVyYXRlKCdvcmdhbmlzbV9yZXN1bHQnLCB7J2RidmVyc2lvbic6IGRidmVyc2lvbiwgJ2xpbWl0JzogNTAwLCAnc2VhcmNoJzogc2VhcmNoVGVybX0pO1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHJlc3VsdFBhZ2U7XG4gICAgfSk7XG5cbiAgICAkKFwiI3NlYXJjaF9vcmdhbmlzbVwiKS5rZXl1cChmdW5jdGlvbihldmVudCl7XG4gICAgICAgIGlmKGV2ZW50LmtleUNvZGUgPT0gMTMpe1xuICAgICAgICAgICAgJChcIiNidG5fc2VhcmNoX29yZ2FuaXNtXCIpLmNsaWNrKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9SZXNvdXJjZXMvY2xpZW50L2pzeC9vcmdhbmlzbS9zZWFyY2gvcXVpY2tTZWFyY2guanN4Il0sInNvdXJjZVJvb3QiOiIifQ==