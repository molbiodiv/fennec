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
        var details = Routing.generate('organism_details', { 'dbversion': dbversion, 'fennec_id': item.fennec_id });
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ 4:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./app/Resources/client/jsx/organism/search.jsx");


/***/ })

},[4]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvb3JnYW5pc20vc2VhcmNoLmpzeCIsIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvb3JnYW5pc20vc2VhcmNoL3F1aWNrU2VhcmNoLmpzeCJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiJCIsImRvY3VtZW50IiwicmVhZHkiLCJhdXRvY29tcGxldGUiLCJwb3NpdGlvbiIsIm15IiwiYXQiLCJzb3VyY2UiLCJyZXF1ZXN0IiwicmVzcG9uc2UiLCJzZWFyY2giLCJ0ZXJtIiwiYWpheCIsInVybCIsIlJvdXRpbmciLCJnZW5lcmF0ZSIsImRidmVyc2lvbiIsImRhdGFUeXBlIiwic3VjY2VzcyIsImRhdGEiLCJtYXAiLCJ4IiwidmFsdWUiLCJzY2llbnRpZmljTmFtZSIsIm1pbkxlbmd0aCIsIl9yZW5kZXJJdGVtIiwidWwiLCJpdGVtIiwiZGV0YWlscyIsImZlbm5lY19pZCIsImxpbmsiLCJsaSIsImFwcGVuZCIsImFwcGVuZFRvIiwiY2xpY2siLCJzZWFyY2hUZXJtIiwidmFsIiwicmVzdWx0UGFnZSIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsImtleXVwIiwiZXZlbnQiLCJrZXlDb2RlIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG1CQUFBQSxDQUFRLDREQUFSLEU7Ozs7Ozs7QUNBQSx5Q0FBQUMsRUFBRUMsUUFBRixFQUFZQyxLQUFaLENBQWtCLFlBQVU7QUFDeEI7QUFDQUYsTUFBRSxrQkFBRixFQUFzQkcsWUFBdEIsQ0FBbUM7QUFDL0JDLGtCQUFVO0FBQ05DLGdCQUFJLFdBREUsRUFDV0MsSUFBSTtBQURmLFNBRHFCO0FBSS9CQyxnQkFBUSxnQkFBVUMsT0FBVixFQUFtQkMsUUFBbkIsRUFBNkI7QUFDakMsZ0JBQUlDLFNBQVNGLFFBQVFHLElBQXJCO0FBQ0FYLGNBQUVZLElBQUYsQ0FBTztBQUNIQyxxQkFBS0MsUUFBUUMsUUFBUixDQUFpQix1QkFBakIsRUFBMEMsRUFBQyxhQUFhQyxTQUFkLEVBQXlCLFNBQVMsR0FBbEMsRUFBdUMsVUFBVU4sTUFBakQsRUFBMUMsQ0FERjtBQUVITywwQkFBVSxNQUZQO0FBR0hDLHlCQUFTLGlCQUFVQyxJQUFWLEVBQWdCO0FBQ3JCViw2QkFBU1UsS0FBS0MsR0FBTCxDQUFTLGFBQUs7QUFBQ0MsMEJBQUVDLEtBQUYsR0FBVUQsRUFBRUUsY0FBWixDQUE0QixPQUFPRixDQUFQO0FBQVUscUJBQXJELENBQVQ7QUFDSDtBQUxFLGFBQVA7QUFPSCxTQWI4QjtBQWMvQkcsbUJBQVc7QUFkb0IsS0FBbkM7O0FBaUJBeEIsTUFBRSxrQkFBRixFQUFzQm1CLElBQXRCLENBQTJCLGlCQUEzQixFQUE4Q00sV0FBOUMsR0FBNEQsVUFBVUMsRUFBVixFQUFjQyxJQUFkLEVBQW9CO0FBQ3hFLFlBQUlDLFVBQVVkLFFBQVFDLFFBQVIsQ0FBaUIsa0JBQWpCLEVBQXFDLEVBQUMsYUFBYUMsU0FBZCxFQUF5QixhQUFhVyxLQUFLRSxTQUEzQyxFQUFyQyxDQUFkO0FBQ0EsWUFBSUMsT0FBTyxjQUFZRixPQUFaLEdBQW9CLHlFQUFwQixHQUFnR0QsS0FBS0osY0FBckcsR0FBc0gsYUFBakk7QUFDSixZQUFJUSxLQUFLL0IsRUFBRSxNQUFGLEVBQ0FnQyxNQURBLENBQ09GLElBRFAsRUFFQUcsUUFGQSxDQUVTUCxFQUZULENBQVQ7QUFHQSxlQUFPSyxFQUFQO0FBQ0gsS0FQRDs7QUFTQS9CLE1BQUUsc0JBQUYsRUFBMEJrQyxLQUExQixDQUFnQyxZQUFVO0FBQ3RDLFlBQUlDLGFBQWFuQyxFQUFFLGtCQUFGLEVBQXNCb0MsR0FBdEIsRUFBakI7QUFDQSxZQUFJQyxhQUFhdkIsUUFBUUMsUUFBUixDQUFpQixpQkFBakIsRUFBb0MsRUFBQyxhQUFhQyxTQUFkLEVBQXlCLFNBQVMsR0FBbEMsRUFBdUMsVUFBVW1CLFVBQWpELEVBQXBDLENBQWpCO0FBQ0FHLGVBQU9DLFFBQVAsQ0FBZ0JDLElBQWhCLEdBQXVCSCxVQUF2QjtBQUNILEtBSkQ7O0FBTUFyQyxNQUFFLGtCQUFGLEVBQXNCeUMsS0FBdEIsQ0FBNEIsVUFBU0MsS0FBVCxFQUFlO0FBQ3ZDLFlBQUdBLE1BQU1DLE9BQU4sSUFBaUIsRUFBcEIsRUFBdUI7QUFDbkIzQyxjQUFFLHNCQUFGLEVBQTBCa0MsS0FBMUI7QUFDSDtBQUNKLEtBSkQ7QUFLSCxDQXZDRCxFIiwiZmlsZSI6Im9yZ2FuaXNtL3NlYXJjaC5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJy4vc2VhcmNoL3F1aWNrU2VhcmNoLmpzeCcpXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L29yZ2FuaXNtL3NlYXJjaC5qc3giLCIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgIC8vYXV0b2NvbXBsZXRlIGZvciBvcmdhbmlzbSBzZWFyY2hcbiAgICAkKFwiI3NlYXJjaF9vcmdhbmlzbVwiKS5hdXRvY29tcGxldGUoe1xuICAgICAgICBwb3NpdGlvbjoge1xuICAgICAgICAgICAgbXk6IFwicmlnaHQgdG9wXCIsIGF0OiBcInJpZ2h0IGJvdHRvbVwiXG4gICAgICAgIH0sXG4gICAgICAgIHNvdXJjZTogZnVuY3Rpb24gKHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gICAgICAgICAgICB2YXIgc2VhcmNoID0gcmVxdWVzdC50ZXJtO1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6IFJvdXRpbmcuZ2VuZXJhdGUoJ2FwaV9saXN0aW5nX29yZ2FuaXNtcycsIHsnZGJ2ZXJzaW9uJzogZGJ2ZXJzaW9uLCAnbGltaXQnOiA1MDAsICdzZWFyY2gnOiBzZWFyY2h9KSxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UoZGF0YS5tYXAoeCA9PiB7eC52YWx1ZSA9IHguc2NpZW50aWZpY05hbWU7IHJldHVybiB4O30pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgbWluTGVuZ3RoOiAzXG4gICAgfSk7XG5cbiAgICAkKFwiI3NlYXJjaF9vcmdhbmlzbVwiKS5kYXRhKFwidWktYXV0b2NvbXBsZXRlXCIpLl9yZW5kZXJJdGVtID0gZnVuY3Rpb24gKHVsLCBpdGVtKSB7XG4gICAgICAgICAgICB2YXIgZGV0YWlscyA9IFJvdXRpbmcuZ2VuZXJhdGUoJ29yZ2FuaXNtX2RldGFpbHMnLCB7J2RidmVyc2lvbic6IGRidmVyc2lvbiwgJ2Zlbm5lY19pZCc6IGl0ZW0uZmVubmVjX2lkfSk7XG4gICAgICAgICAgICB2YXIgbGluayA9IFwiPGEgaHJlZj0nXCIrZGV0YWlscytcIic+PHNwYW4gc3R5bGU9J2Rpc3BsYXk6aW5saW5lLWJsb2NrOyB3aWR0aDogMTAwJTsgZm9udC1zdHlsZTogaXRhbGljOyc+XCIgKyBpdGVtLnNjaWVudGlmaWNOYW1lICsgXCI8L3NwYW4+PC9hPlwiO1xuICAgICAgICB2YXIgbGkgPSAkKFwiPGxpPlwiKVxuICAgICAgICAgICAgICAgIC5hcHBlbmQobGluaylcbiAgICAgICAgICAgICAgICAuYXBwZW5kVG8odWwpO1xuICAgICAgICByZXR1cm4gbGk7XG4gICAgfTtcblxuICAgICQoXCIjYnRuX3NlYXJjaF9vcmdhbmlzbVwiKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICB2YXIgc2VhcmNoVGVybSA9ICQoXCIjc2VhcmNoX29yZ2FuaXNtXCIpLnZhbCgpO1xuICAgICAgICB2YXIgcmVzdWx0UGFnZSA9IFJvdXRpbmcuZ2VuZXJhdGUoJ29yZ2FuaXNtX3Jlc3VsdCcsIHsnZGJ2ZXJzaW9uJzogZGJ2ZXJzaW9uLCAnbGltaXQnOiA1MDAsICdzZWFyY2gnOiBzZWFyY2hUZXJtfSk7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcmVzdWx0UGFnZTtcbiAgICB9KTtcblxuICAgICQoXCIjc2VhcmNoX29yZ2FuaXNtXCIpLmtleXVwKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgaWYoZXZlbnQua2V5Q29kZSA9PSAxMyl7XG4gICAgICAgICAgICAkKFwiI2J0bl9zZWFyY2hfb3JnYW5pc21cIikuY2xpY2soKTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L29yZ2FuaXNtL3NlYXJjaC9xdWlja1NlYXJjaC5qc3giXSwic291cmNlUm9vdCI6IiJ9