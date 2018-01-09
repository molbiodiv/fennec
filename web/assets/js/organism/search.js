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
                url: Routing.generate('api_listing_organisms', { 'dbversion': dbversion }),
                data: { limit: 500, search: search },
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvb3JnYW5pc20vc2VhcmNoLmpzeCIsIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvb3JnYW5pc20vc2VhcmNoL3F1aWNrU2VhcmNoLmpzeCJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiJCIsImRvY3VtZW50IiwicmVhZHkiLCJhdXRvY29tcGxldGUiLCJwb3NpdGlvbiIsIm15IiwiYXQiLCJzb3VyY2UiLCJyZXF1ZXN0IiwicmVzcG9uc2UiLCJzZWFyY2giLCJ0ZXJtIiwiYWpheCIsInVybCIsIlJvdXRpbmciLCJnZW5lcmF0ZSIsImRidmVyc2lvbiIsImRhdGEiLCJsaW1pdCIsImRhdGFUeXBlIiwic3VjY2VzcyIsIm1hcCIsIngiLCJ2YWx1ZSIsInNjaWVudGlmaWNOYW1lIiwibWluTGVuZ3RoIiwiX3JlbmRlckl0ZW0iLCJ1bCIsIml0ZW0iLCJkZXRhaWxzIiwiZmVubmVjX2lkIiwibGluayIsImxpIiwiYXBwZW5kIiwiYXBwZW5kVG8iLCJjbGljayIsInNlYXJjaFRlcm0iLCJ2YWwiLCJyZXN1bHRQYWdlIiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwia2V5dXAiLCJldmVudCIsImtleUNvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsbUJBQUFBLENBQVEsNERBQVIsRTs7Ozs7OztBQ0FBLHlDQUFBQyxFQUFFQyxRQUFGLEVBQVlDLEtBQVosQ0FBa0IsWUFBVTtBQUN4QjtBQUNBRixNQUFFLGtCQUFGLEVBQXNCRyxZQUF0QixDQUFtQztBQUMvQkMsa0JBQVU7QUFDTkMsZ0JBQUksV0FERSxFQUNXQyxJQUFJO0FBRGYsU0FEcUI7QUFJL0JDLGdCQUFRLGdCQUFVQyxPQUFWLEVBQW1CQyxRQUFuQixFQUE2QjtBQUNqQyxnQkFBSUMsU0FBU0YsUUFBUUcsSUFBckI7QUFDQVgsY0FBRVksSUFBRixDQUFPO0FBQ0hDLHFCQUFLQyxRQUFRQyxRQUFSLENBQWlCLHVCQUFqQixFQUEwQyxFQUFDLGFBQWFDLFNBQWQsRUFBMUMsQ0FERjtBQUVIQyxzQkFBTSxFQUFDQyxPQUFPLEdBQVIsRUFBYVIsUUFBUUEsTUFBckIsRUFGSDtBQUdIUywwQkFBVSxNQUhQO0FBSUhDLHlCQUFTLGlCQUFVSCxJQUFWLEVBQWdCO0FBQ3JCUiw2QkFBU1EsS0FBS0ksR0FBTCxDQUFTLGFBQUs7QUFBQ0MsMEJBQUVDLEtBQUYsR0FBVUQsRUFBRUUsY0FBWixDQUE0QixPQUFPRixDQUFQO0FBQVUscUJBQXJELENBQVQ7QUFDSDtBQU5FLGFBQVA7QUFRSCxTQWQ4QjtBQWUvQkcsbUJBQVc7QUFmb0IsS0FBbkM7O0FBa0JBekIsTUFBRSxrQkFBRixFQUFzQmlCLElBQXRCLENBQTJCLGlCQUEzQixFQUE4Q1MsV0FBOUMsR0FBNEQsVUFBVUMsRUFBVixFQUFjQyxJQUFkLEVBQW9CO0FBQ3hFLFlBQUlDLFVBQVVmLFFBQVFDLFFBQVIsQ0FBaUIsa0JBQWpCLEVBQXFDLEVBQUMsYUFBYUMsU0FBZCxFQUF5QixhQUFhWSxLQUFLRSxTQUEzQyxFQUFyQyxDQUFkO0FBQ0EsWUFBSUMsT0FBTyxjQUFZRixPQUFaLEdBQW9CLHlFQUFwQixHQUFnR0QsS0FBS0osY0FBckcsR0FBc0gsYUFBakk7QUFDSixZQUFJUSxLQUFLaEMsRUFBRSxNQUFGLEVBQ0FpQyxNQURBLENBQ09GLElBRFAsRUFFQUcsUUFGQSxDQUVTUCxFQUZULENBQVQ7QUFHQSxlQUFPSyxFQUFQO0FBQ0gsS0FQRDs7QUFTQWhDLE1BQUUsc0JBQUYsRUFBMEJtQyxLQUExQixDQUFnQyxZQUFVO0FBQ3RDLFlBQUlDLGFBQWFwQyxFQUFFLGtCQUFGLEVBQXNCcUMsR0FBdEIsRUFBakI7QUFDQSxZQUFJQyxhQUFheEIsUUFBUUMsUUFBUixDQUFpQixpQkFBakIsRUFBb0MsRUFBQyxhQUFhQyxTQUFkLEVBQXlCLFNBQVMsR0FBbEMsRUFBdUMsVUFBVW9CLFVBQWpELEVBQXBDLENBQWpCO0FBQ0FHLGVBQU9DLFFBQVAsQ0FBZ0JDLElBQWhCLEdBQXVCSCxVQUF2QjtBQUNILEtBSkQ7O0FBTUF0QyxNQUFFLGtCQUFGLEVBQXNCMEMsS0FBdEIsQ0FBNEIsVUFBU0MsS0FBVCxFQUFlO0FBQ3ZDLFlBQUdBLE1BQU1DLE9BQU4sSUFBaUIsRUFBcEIsRUFBdUI7QUFDbkI1QyxjQUFFLHNCQUFGLEVBQTBCbUMsS0FBMUI7QUFDSDtBQUNKLEtBSkQ7QUFLSCxDQXhDRCxFIiwiZmlsZSI6Im9yZ2FuaXNtL3NlYXJjaC5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJy4vc2VhcmNoL3F1aWNrU2VhcmNoLmpzeCcpXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L29yZ2FuaXNtL3NlYXJjaC5qc3giLCIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgIC8vYXV0b2NvbXBsZXRlIGZvciBvcmdhbmlzbSBzZWFyY2hcbiAgICAkKFwiI3NlYXJjaF9vcmdhbmlzbVwiKS5hdXRvY29tcGxldGUoe1xuICAgICAgICBwb3NpdGlvbjoge1xuICAgICAgICAgICAgbXk6IFwicmlnaHQgdG9wXCIsIGF0OiBcInJpZ2h0IGJvdHRvbVwiXG4gICAgICAgIH0sXG4gICAgICAgIHNvdXJjZTogZnVuY3Rpb24gKHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gICAgICAgICAgICB2YXIgc2VhcmNoID0gcmVxdWVzdC50ZXJtO1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6IFJvdXRpbmcuZ2VuZXJhdGUoJ2FwaV9saXN0aW5nX29yZ2FuaXNtcycsIHsnZGJ2ZXJzaW9uJzogZGJ2ZXJzaW9ufSksXG4gICAgICAgICAgICAgICAgZGF0YToge2xpbWl0OiA1MDAsIHNlYXJjaDogc2VhcmNofSxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UoZGF0YS5tYXAoeCA9PiB7eC52YWx1ZSA9IHguc2NpZW50aWZpY05hbWU7IHJldHVybiB4O30pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgbWluTGVuZ3RoOiAzXG4gICAgfSk7XG5cbiAgICAkKFwiI3NlYXJjaF9vcmdhbmlzbVwiKS5kYXRhKFwidWktYXV0b2NvbXBsZXRlXCIpLl9yZW5kZXJJdGVtID0gZnVuY3Rpb24gKHVsLCBpdGVtKSB7XG4gICAgICAgICAgICB2YXIgZGV0YWlscyA9IFJvdXRpbmcuZ2VuZXJhdGUoJ29yZ2FuaXNtX2RldGFpbHMnLCB7J2RidmVyc2lvbic6IGRidmVyc2lvbiwgJ2Zlbm5lY19pZCc6IGl0ZW0uZmVubmVjX2lkfSk7XG4gICAgICAgICAgICB2YXIgbGluayA9IFwiPGEgaHJlZj0nXCIrZGV0YWlscytcIic+PHNwYW4gc3R5bGU9J2Rpc3BsYXk6aW5saW5lLWJsb2NrOyB3aWR0aDogMTAwJTsgZm9udC1zdHlsZTogaXRhbGljOyc+XCIgKyBpdGVtLnNjaWVudGlmaWNOYW1lICsgXCI8L3NwYW4+PC9hPlwiO1xuICAgICAgICB2YXIgbGkgPSAkKFwiPGxpPlwiKVxuICAgICAgICAgICAgICAgIC5hcHBlbmQobGluaylcbiAgICAgICAgICAgICAgICAuYXBwZW5kVG8odWwpO1xuICAgICAgICByZXR1cm4gbGk7XG4gICAgfTtcblxuICAgICQoXCIjYnRuX3NlYXJjaF9vcmdhbmlzbVwiKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICB2YXIgc2VhcmNoVGVybSA9ICQoXCIjc2VhcmNoX29yZ2FuaXNtXCIpLnZhbCgpO1xuICAgICAgICB2YXIgcmVzdWx0UGFnZSA9IFJvdXRpbmcuZ2VuZXJhdGUoJ29yZ2FuaXNtX3Jlc3VsdCcsIHsnZGJ2ZXJzaW9uJzogZGJ2ZXJzaW9uLCAnbGltaXQnOiA1MDAsICdzZWFyY2gnOiBzZWFyY2hUZXJtfSk7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcmVzdWx0UGFnZTtcbiAgICB9KTtcblxuICAgICQoXCIjc2VhcmNoX29yZ2FuaXNtXCIpLmtleXVwKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgaWYoZXZlbnQua2V5Q29kZSA9PSAxMyl7XG4gICAgICAgICAgICAkKFwiI2J0bl9zZWFyY2hfb3JnYW5pc21cIikuY2xpY2soKTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L29yZ2FuaXNtL3NlYXJjaC9xdWlja1NlYXJjaC5qc3giXSwic291cmNlUm9vdCI6IiJ9