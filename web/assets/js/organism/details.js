webpackJsonp([5],{

/***/ "./app/Resources/client/jsx/organism/details.jsx":
/*!*******************************************************!*\
  !*** ./app/Resources/client/jsx/organism/details.jsx ***!
  \*******************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./details/appendTraits.jsx */ "./app/Resources/client/jsx/organism/details/appendTraits.jsx");
__webpack_require__(/*! ./details/eol.jsx */ "./app/Resources/client/jsx/organism/details/eol.jsx");

/***/ }),

/***/ "./app/Resources/client/jsx/organism/details/appendTraits.jsx":
/*!********************************************************************!*\
  !*** ./app/Resources/client/jsx/organism/details/appendTraits.jsx ***!
  \********************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($, global) {/**
 * Created by s216121 on 14.03.17.
 */

function appendTraitEntries(domElement, traitEntries, traitFormat) {
    $.ajax({
        url: Routing.generate('api_details_trait_entries', { 'dbversion': dbversion }),
        data: {
            "trait_entry_ids": traitEntries,
            "trait_format": traitFormat
        },
        method: "GET",
        success: function success(result) {
            $.each(result, function (key, value) {
                var realValue = value.valueName;
                if (value.valueName === null) {
                    realValue = value.valueDefinition;
                }
                var unitString = "";
                if (value.unit != null) {
                    unitString = " $" + value.unit + "$";
                }
                var traitCitationDiv = $('<div class="trait-citation">').text(value.citation).css({ 'font-size': '11px' });
                var originUrl = $('<a href="' + value.originUrl + '">').text(" origin");
                if (value.originUrl != "") {
                    traitCitationDiv.append(originUrl);
                }
                domElement.append($('<div>').text(realValue + unitString).append(traitCitationDiv));
            });
        }
    });
}

// export function globally
global.appendTraitEntries = appendTraitEntries;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"), __webpack_require__(/*! ./../../../../../../node_modules/webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./app/Resources/client/jsx/organism/details/eol.jsx":
/*!***********************************************************!*\
  !*** ./app/Resources/client/jsx/organism/details/eol.jsx ***!
  \***********************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {/**
 * Created by s216121 on 14.03.17.
 */
$('document').ready(function () {
    var img_template = '<a class="thumbnail" href="<%= href %>"><img src="<%= src %>"/></a><a href="<%= source %>"><div><%= rights %> <%= license %></div></a>';
    var txt_template = '<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title"><%= title %></h3><a href="<%= href %>"><%= rights %> <%= license %></a></div><div class="panel-body"><%= body %></div></div>';
    $.ajax({
        method: "GET",
        url: "http://eol.org/api/pages/1.0.json",
        data: {
            id: eol_id,
            batch: false,
            images_per_page: 3,
            images_page: 1,
            videos_per_page: 0,
            videos_page: 1,
            sounds_per_page: 0,
            sounds_page: 1,
            maps_per_page: 0,
            maps_page: 1,
            texts_per_page: 3,
            texts_page: 1,
            iucn: true,
            subjects: "overview",
            licenses: "cc-by|cc-by-nc|cc-by-sa|cc-by-nc-sa|pd",
            details: true,
            common_names: true,
            synonyms: true,
            references: true,
            taxonomy: true,
            vetted: 0,
            cache_ttl: 60,
            language: "en"
        },
        success: function success(result) {
            console.log(result);
            $.each(result["dataObjects"], function (dob) {
                if (result["dataObjects"][dob]["dataType"] === "http://purl.org/dc/dcmitype/StillImage") {
                    var url = result["dataObjects"][dob]["eolMediaURL"];
                    var license = result["dataObjects"][dob]["license"];
                    var rights = result["dataObjects"][dob]["rights"];
                    if (typeof rights === 'undefined') {
                        rights = "(c)" + result["dataObjects"][dob]["rightsHolder"];
                    }
                    var source = result["dataObjects"][dob]["source"];
                    var img_element = _.template(img_template)({ src: url, href: url, license: license, rights: rights, source: source });
                    $('#organism-img-column').append(img_element);
                }
                if (result["dataObjects"][dob]["dataType"] === "http://purl.org/dc/dcmitype/Text") {
                    var title = result["dataObjects"][dob]["title"];
                    var body = result["dataObjects"][dob]["description"];
                    var _url = result["dataObjects"][dob]["source"];
                    var _license = result["dataObjects"][dob]["license"];
                    var _rights = result["dataObjects"][dob]["rights"];
                    if (typeof _rights === 'undefined') {
                        _rights = "(c)" + result["dataObjects"][dob]["rightsHolder"];
                    }
                    var txt_element = _.template(txt_template)({ title: title, body: body, href: _url, rights: _rights, license: _license });
                    $('#organism-txt-column').append(txt_element);
                }
            });
            $("#vernacularName").text(getBestVernacularNameEOL(result));
        },
        error: function error(jqXHR, textStatus, errorThrown) {
            showMessageDialog(errorThrown, 'danger');
        }
    }).always(function () {
        $('#loading-progress').empty();
    });
    $("#toggleCitationButton").on("click", function () {
        $(".trait-citation").toggle();
    });
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ 3:
/*!*************************************************************!*\
  !*** multi ./app/Resources/client/jsx/organism/details.jsx ***!
  \*************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./app/Resources/client/jsx/organism/details.jsx */"./app/Resources/client/jsx/organism/details.jsx");


/***/ })

},[3]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvb3JnYW5pc20vZGV0YWlscy5qc3giLCJ3ZWJwYWNrOi8vLy4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L29yZ2FuaXNtL2RldGFpbHMvYXBwZW5kVHJhaXRzLmpzeCIsIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvb3JnYW5pc20vZGV0YWlscy9lb2wuanN4Il0sIm5hbWVzIjpbInJlcXVpcmUiLCJhcHBlbmRUcmFpdEVudHJpZXMiLCJkb21FbGVtZW50IiwidHJhaXRFbnRyaWVzIiwidHJhaXRGb3JtYXQiLCIkIiwiYWpheCIsInVybCIsIlJvdXRpbmciLCJnZW5lcmF0ZSIsImRidmVyc2lvbiIsImRhdGEiLCJtZXRob2QiLCJzdWNjZXNzIiwicmVzdWx0IiwiZWFjaCIsImtleSIsInZhbHVlIiwicmVhbFZhbHVlIiwidmFsdWVOYW1lIiwidmFsdWVEZWZpbml0aW9uIiwidW5pdFN0cmluZyIsInVuaXQiLCJ0cmFpdENpdGF0aW9uRGl2IiwidGV4dCIsImNpdGF0aW9uIiwiY3NzIiwib3JpZ2luVXJsIiwiYXBwZW5kIiwiZ2xvYmFsIiwicmVhZHkiLCJpbWdfdGVtcGxhdGUiLCJ0eHRfdGVtcGxhdGUiLCJpZCIsImVvbF9pZCIsImJhdGNoIiwiaW1hZ2VzX3Blcl9wYWdlIiwiaW1hZ2VzX3BhZ2UiLCJ2aWRlb3NfcGVyX3BhZ2UiLCJ2aWRlb3NfcGFnZSIsInNvdW5kc19wZXJfcGFnZSIsInNvdW5kc19wYWdlIiwibWFwc19wZXJfcGFnZSIsIm1hcHNfcGFnZSIsInRleHRzX3Blcl9wYWdlIiwidGV4dHNfcGFnZSIsIml1Y24iLCJzdWJqZWN0cyIsImxpY2Vuc2VzIiwiZGV0YWlscyIsImNvbW1vbl9uYW1lcyIsInN5bm9ueW1zIiwicmVmZXJlbmNlcyIsInRheG9ub215IiwidmV0dGVkIiwiY2FjaGVfdHRsIiwibGFuZ3VhZ2UiLCJjb25zb2xlIiwibG9nIiwiZG9iIiwibGljZW5zZSIsInJpZ2h0cyIsInNvdXJjZSIsImltZ19lbGVtZW50IiwiXyIsInRlbXBsYXRlIiwic3JjIiwiaHJlZiIsInRpdGxlIiwiYm9keSIsInR4dF9lbGVtZW50IiwiZ2V0QmVzdFZlcm5hY3VsYXJOYW1lRU9MIiwiZXJyb3IiLCJqcVhIUiIsInRleHRTdGF0dXMiLCJlcnJvclRocm93biIsInNob3dNZXNzYWdlRGlhbG9nIiwiYWx3YXlzIiwiZW1wdHkiLCJvbiIsInRvZ2dsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLG1CQUFBQSxDQUFRLGdHQUFSO0FBQ0EsbUJBQUFBLENBQVEsOEVBQVIsRTs7Ozs7Ozs7Ozs7O0FDREE7Ozs7QUFJQSxTQUFTQyxrQkFBVCxDQUE0QkMsVUFBNUIsRUFBd0NDLFlBQXhDLEVBQXNEQyxXQUF0RCxFQUFrRTtBQUM5REMsTUFBRUMsSUFBRixDQUFPO0FBQ0hDLGFBQUtDLFFBQVFDLFFBQVIsQ0FBaUIsMkJBQWpCLEVBQThDLEVBQUMsYUFBYUMsU0FBZCxFQUE5QyxDQURGO0FBRUhDLGNBQU07QUFDRiwrQkFBbUJSLFlBRGpCO0FBRUYsNEJBQWdCQztBQUZkLFNBRkg7QUFNSFEsZ0JBQVEsS0FOTDtBQU9IQyxpQkFBUyxpQkFBU0MsTUFBVCxFQUFnQjtBQUNyQlQsY0FBRVUsSUFBRixDQUFPRCxNQUFQLEVBQWUsVUFBVUUsR0FBVixFQUFlQyxLQUFmLEVBQXNCO0FBQ2pDLG9CQUFJQyxZQUFZRCxNQUFNRSxTQUF0QjtBQUNBLG9CQUFHRixNQUFNRSxTQUFOLEtBQW9CLElBQXZCLEVBQTRCO0FBQ3hCRCxnQ0FBWUQsTUFBTUcsZUFBbEI7QUFDSDtBQUNELG9CQUFJQyxhQUFhLEVBQWpCO0FBQ0Esb0JBQUdKLE1BQU1LLElBQU4sSUFBYyxJQUFqQixFQUFzQjtBQUNsQkQsaUNBQWEsT0FBTUosTUFBTUssSUFBWixHQUFrQixHQUEvQjtBQUNIO0FBQ0Qsb0JBQUlDLG1CQUFtQmxCLEVBQUUsOEJBQUYsRUFBa0NtQixJQUFsQyxDQUF1Q1AsTUFB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QUE5QixFQUF1QyxZQUFVO0FBQzdDMUUsVUFBRSxpQkFBRixFQUFxQjJFLE1BQXJCO0FBQ0gsS0FGRDtBQUdILENBckVELEUiLCJmaWxlIjoib3JnYW5pc20vZGV0YWlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJy4vZGV0YWlscy9hcHBlbmRUcmFpdHMuanN4JylcbnJlcXVpcmUoJy4vZGV0YWlscy9lb2wuanN4JylcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvb3JnYW5pc20vZGV0YWlscy5qc3giLCIvKipcbiAqIENyZWF0ZWQgYnkgczIxNjEyMSBvbiAxNC4wMy4xNy5cbiAqL1xuXG5mdW5jdGlvbiBhcHBlbmRUcmFpdEVudHJpZXMoZG9tRWxlbWVudCwgdHJhaXRFbnRyaWVzLCB0cmFpdEZvcm1hdCl7XG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiBSb3V0aW5nLmdlbmVyYXRlKCdhcGlfZGV0YWlsc190cmFpdF9lbnRyaWVzJywgeydkYnZlcnNpb24nOiBkYnZlcnNpb259KSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgXCJ0cmFpdF9lbnRyeV9pZHNcIjogdHJhaXRFbnRyaWVzLFxuICAgICAgICAgICAgXCJ0cmFpdF9mb3JtYXRcIjogdHJhaXRGb3JtYXRcbiAgICAgICAgfSxcbiAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAgICAgJC5lYWNoKHJlc3VsdCwgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVhbFZhbHVlID0gdmFsdWUudmFsdWVOYW1lO1xuICAgICAgICAgICAgICAgIGlmKHZhbHVlLnZhbHVlTmFtZSA9PT0gbnVsbCl7XG4gICAgICAgICAgICAgICAgICAgIHJlYWxWYWx1ZSA9IHZhbHVlLnZhbHVlRGVmaW5pdGlvbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IHVuaXRTdHJpbmcgPSBcIlwiXG4gICAgICAgICAgICAgICAgaWYodmFsdWUudW5pdCAhPSBudWxsKXtcbiAgICAgICAgICAgICAgICAgICAgdW5pdFN0cmluZyA9IFwiICRcIisgdmFsdWUudW5pdCArXCIkXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IHRyYWl0Q2l0YXRpb25EaXYgPSAkKCc8ZGl2IGNsYXNzPVwidHJhaXQtY2l0YXRpb25cIj4nKS50ZXh0KHZhbHVlLmNpdGF0aW9uKS5jc3Moeydmb250LXNpemUnOiAnMTFweCd9KVxuICAgICAgICAgICAgICAgIGxldCBvcmlnaW5VcmwgPSAkKGA8YSBocmVmPVwiJHt2YWx1ZS5vcmlnaW5Vcmx9XCI+YCkudGV4dChcIiBvcmlnaW5cIilcbiAgICAgICAgICAgICAgICBpZih2YWx1ZS5vcmlnaW5VcmwgIT0gXCJcIil7XG4gICAgICAgICAgICAgICAgICAgIHRyYWl0Q2l0YXRpb25EaXYuYXBwZW5kKG9yaWdpblVybClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZG9tRWxlbWVudC5hcHBlbmQoJCgnPGRpdj4nKS50ZXh0KHJlYWxWYWx1ZSt1bml0U3RyaW5nKS5hcHBlbmQodHJhaXRDaXRhdGlvbkRpdikpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuLy8gZXhwb3J0IGZ1bmN0aW9uIGdsb2JhbGx5XG5nbG9iYWwuYXBwZW5kVHJhaXRFbnRyaWVzID0gYXBwZW5kVHJhaXRFbnRyaWVzO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC9SZXNvdXJjZXMvY2xpZW50L2pzeC9vcmdhbmlzbS9kZXRhaWxzL2FwcGVuZFRyYWl0cy5qc3giLCIvKipcbiAqIENyZWF0ZWQgYnkgczIxNjEyMSBvbiAxNC4wMy4xNy5cbiAqL1xuJCgnZG9jdW1lbnQnKS5yZWFkeShmdW5jdGlvbigpe1xuICAgIGxldCBpbWdfdGVtcGxhdGUgPSAnPGEgY2xhc3M9XCJ0aHVtYm5haWxcIiBocmVmPVwiPCU9IGhyZWYgJT5cIj48aW1nIHNyYz1cIjwlPSBzcmMgJT5cIi8+PC9hPjxhIGhyZWY9XCI8JT0gc291cmNlICU+XCI+PGRpdj48JT0gcmlnaHRzICU+IDwlPSBsaWNlbnNlICU+PC9kaXY+PC9hPic7XG4gICAgbGV0IHR4dF90ZW1wbGF0ZSA9ICc8ZGl2IGNsYXNzPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiPjxkaXYgY2xhc3M9XCJwYW5lbC1oZWFkaW5nXCI+PGgzIGNsYXNzPVwicGFuZWwtdGl0bGVcIj48JT0gdGl0bGUgJT48L2gzPjxhIGhyZWY9XCI8JT0gaHJlZiAlPlwiPjwlPSByaWdodHMgJT4gPCU9IGxpY2Vuc2UgJT48L2E+PC9kaXY+PGRpdiBjbGFzcz1cInBhbmVsLWJvZHlcIj48JT0gYm9keSAlPjwvZGl2PjwvZGl2Pic7XG4gICAgJC5hamF4KHtcbiAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICB1cmw6IFwiaHR0cDovL2VvbC5vcmcvYXBpL3BhZ2VzLzEuMC5qc29uXCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGlkOiBlb2xfaWQsXG4gICAgICAgICAgICBiYXRjaDogZmFsc2UsXG4gICAgICAgICAgICBpbWFnZXNfcGVyX3BhZ2U6IDMsXG4gICAgICAgICAgICBpbWFnZXNfcGFnZTogMSxcbiAgICAgICAgICAgIHZpZGVvc19wZXJfcGFnZTogMCxcbiAgICAgICAgICAgIHZpZGVvc19wYWdlOiAxLFxuICAgICAgICAgICAgc291bmRzX3Blcl9wYWdlOiAwLFxuICAgICAgICAgICAgc291bmRzX3BhZ2U6IDEsXG4gICAgICAgICAgICBtYXBzX3Blcl9wYWdlOiAwLFxuICAgICAgICAgICAgbWFwc19wYWdlOiAxLFxuICAgICAgICAgICAgdGV4dHNfcGVyX3BhZ2U6IDMsXG4gICAgICAgICAgICB0ZXh0c19wYWdlOiAxLFxuICAgICAgICAgICAgaXVjbjogdHJ1ZSxcbiAgICAgICAgICAgIHN1YmplY3RzOiBcIm92ZXJ2aWV3XCIsXG4gICAgICAgICAgICBsaWNlbnNlczogXCJjYy1ieXxjYy1ieS1uY3xjYy1ieS1zYXxjYy1ieS1uYy1zYXxwZFwiLFxuICAgICAgICAgICAgZGV0YWlsczogdHJ1ZSxcbiAgICAgICAgICAgIGNvbW1vbl9uYW1lczogdHJ1ZSxcbiAgICAgICAgICAgIHN5bm9ueW1zOiB0cnVlLFxuICAgICAgICAgICAgcmVmZXJlbmNlczogdHJ1ZSxcbiAgICAgICAgICAgIHRheG9ub215OiB0cnVlLFxuICAgICAgICAgICAgdmV0dGVkOiAwLFxuICAgICAgICAgICAgY2FjaGVfdHRsOiA2MCxcbiAgICAgICAgICAgIGxhbmd1YWdlOiBcImVuXCJcbiAgICAgICAgfSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICAgICAgICAkLmVhY2gocmVzdWx0W1wiZGF0YU9iamVjdHNcIl0sIGZ1bmN0aW9uIChkb2IpIHtcbiAgICAgICAgICAgICAgICBpZihyZXN1bHRbXCJkYXRhT2JqZWN0c1wiXVtkb2JdW1wiZGF0YVR5cGVcIl0gPT09IFwiaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2VcIil7XG4gICAgICAgICAgICAgICAgICAgIGxldCB1cmwgPSByZXN1bHRbXCJkYXRhT2JqZWN0c1wiXVtkb2JdW1wiZW9sTWVkaWFVUkxcIl07XG4gICAgICAgICAgICAgICAgICAgIGxldCBsaWNlbnNlID0gcmVzdWx0W1wiZGF0YU9iamVjdHNcIl1bZG9iXVtcImxpY2Vuc2VcIl07XG4gICAgICAgICAgICAgICAgICAgIGxldCByaWdodHMgPSByZXN1bHRbXCJkYXRhT2JqZWN0c1wiXVtkb2JdW1wicmlnaHRzXCJdO1xuICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YgcmlnaHRzID09PSAndW5kZWZpbmVkJyl7XG4gICAgICAgICAgICAgICAgICAgICAgICByaWdodHMgPSBcIihjKVwiK3Jlc3VsdFtcImRhdGFPYmplY3RzXCJdW2RvYl1bXCJyaWdodHNIb2xkZXJcIl07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGV0IHNvdXJjZSA9IHJlc3VsdFtcImRhdGFPYmplY3RzXCJdW2RvYl1bXCJzb3VyY2VcIl07XG4gICAgICAgICAgICAgICAgICAgIGxldCBpbWdfZWxlbWVudCA9IF8udGVtcGxhdGUoaW1nX3RlbXBsYXRlKSh7c3JjOiB1cmwsIGhyZWY6IHVybCwgbGljZW5zZTogbGljZW5zZSwgcmlnaHRzOiByaWdodHMsIHNvdXJjZTogc291cmNlfSk7XG4gICAgICAgICAgICAgICAgICAgICQoJyNvcmdhbmlzbS1pbWctY29sdW1uJykuYXBwZW5kKGltZ19lbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYocmVzdWx0W1wiZGF0YU9iamVjdHNcIl1bZG9iXVtcImRhdGFUeXBlXCJdID09PSBcImh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9UZXh0XCIpe1xuICAgICAgICAgICAgICAgICAgICBsZXQgdGl0bGUgPSByZXN1bHRbXCJkYXRhT2JqZWN0c1wiXVtkb2JdW1widGl0bGVcIl07XG4gICAgICAgICAgICAgICAgICAgIGxldCBib2R5ID0gcmVzdWx0W1wiZGF0YU9iamVjdHNcIl1bZG9iXVtcImRlc2NyaXB0aW9uXCJdO1xuICAgICAgICAgICAgICAgICAgICBsZXQgdXJsID0gcmVzdWx0W1wiZGF0YU9iamVjdHNcIl1bZG9iXVtcInNvdXJjZVwiXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxpY2Vuc2UgPSByZXN1bHRbXCJkYXRhT2JqZWN0c1wiXVtkb2JdW1wibGljZW5zZVwiXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJpZ2h0cyA9IHJlc3VsdFtcImRhdGFPYmplY3RzXCJdW2RvYl1bXCJyaWdodHNcIl07XG4gICAgICAgICAgICAgICAgICAgIGlmKHR5cGVvZiByaWdodHMgPT09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0cyA9IFwiKGMpXCIrcmVzdWx0W1wiZGF0YU9iamVjdHNcIl1bZG9iXVtcInJpZ2h0c0hvbGRlclwiXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsZXQgdHh0X2VsZW1lbnQgPSBfLnRlbXBsYXRlKHR4dF90ZW1wbGF0ZSkoe3RpdGxlOiB0aXRsZSwgYm9keTogYm9keSwgaHJlZjogdXJsLCByaWdodHM6IHJpZ2h0cywgbGljZW5zZTogbGljZW5zZX0pO1xuICAgICAgICAgICAgICAgICAgICAkKCcjb3JnYW5pc20tdHh0LWNvbHVtbicpLmFwcGVuZCh0eHRfZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKFwiI3Zlcm5hY3VsYXJOYW1lXCIpLnRleHQoZ2V0QmVzdFZlcm5hY3VsYXJOYW1lRU9MKHJlc3VsdCkpO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikge1xuICAgICAgICAgICAgc2hvd01lc3NhZ2VEaWFsb2coZXJyb3JUaHJvd24sICdkYW5nZXInKTtcbiAgICAgICAgfVxuICAgIH0pLmFsd2F5cyhmdW5jdGlvbigpe1xuICAgICAgICAkKCcjbG9hZGluZy1wcm9ncmVzcycpLmVtcHR5KCk7XG4gICAgfSk7XG4gICAgJChcIiN0b2dnbGVDaXRhdGlvbkJ1dHRvblwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgICQoXCIudHJhaXQtY2l0YXRpb25cIikudG9nZ2xlKCk7XG4gICAgfSlcbn0pO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L29yZ2FuaXNtL2RldGFpbHMvZW9sLmpzeCJdLCJzb3VyY2VSb290IjoiIn0=