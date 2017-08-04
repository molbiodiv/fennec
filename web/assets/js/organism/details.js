webpackJsonp([5],{

/***/ "./app/Resources/client/jsx/organism/details.jsx":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("./app/Resources/client/jsx/organism/details/appendTraits.jsx");
__webpack_require__("./app/Resources/client/jsx/organism/details/eol.jsx");

/***/ }),

/***/ "./app/Resources/client/jsx/organism/details/appendTraits.jsx":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($, global) {/**
 * Created by s216121 on 14.03.17.
 */

function appendTraitEntries(domElement, traitEntries, traitFormat) {
    $.ajax({
        url: Routing.generate('api', { 'namespace': 'details', 'classname': 'TraitEntries' }),
        data: {
            "dbversion": dbversion,
            "trait_entry_ids": traitEntries,
            "trait_format": traitFormat
        },
        method: "GET",
        success: function (result) {
            $.each(result, function (key, value) {
                var realValue = value.value;
                if (value.value === null) {
                    realValue = value.value_definition;
                }
                let unitString = "";
                if (value.unit != null) {
                    unitString = " $" + value.unit + "$";
                }
                let traitCitationDiv = $('<div class="trait-citation">').text(value.citation).css({ 'font-size': '11px' });
                let originUrl = $(`<a href="${value.origin_url}">`).text(" origin");
                if (value.origin_url != "") {
                    traitCitationDiv.append(originUrl);
                }
                domElement.append($('<div>').text(realValue + unitString).append(traitCitationDiv));
            });
        }
    });
}

// export function globally
global.appendTraitEntries = appendTraitEntries;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js"), __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./app/Resources/client/jsx/organism/details/eol.jsx":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {/**
 * Created by s216121 on 14.03.17.
 */
$('document').ready(function () {
    let img_template = '<a class="thumbnail" href="<%= href %>"><img src="<%= src %>"/></a><a href="<%= source %>"><div><%= rights %> <%= license %></div></a>';
    let txt_template = '<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title"><%= title %></h3><a href="<%= href %>"><%= rights %> <%= license %></a></div><div class="panel-body"><%= body %></div></div>';
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
        success: function (result) {
            console.log(result);
            $.each(result["dataObjects"], function (dob) {
                if (result["dataObjects"][dob]["dataType"] === "http://purl.org/dc/dcmitype/StillImage") {
                    let url = result["dataObjects"][dob]["eolMediaURL"];
                    let license = result["dataObjects"][dob]["license"];
                    let rights = result["dataObjects"][dob]["rights"];
                    if (typeof rights === 'undefined') {
                        rights = "(c)" + result["dataObjects"][dob]["rightsHolder"];
                    }
                    let source = result["dataObjects"][dob]["source"];
                    let img_element = _.template(img_template)({ src: url, href: url, license: license, rights: rights, source: source });
                    $('#organism-img-column').append(img_element);
                }
                if (result["dataObjects"][dob]["dataType"] === "http://purl.org/dc/dcmitype/Text") {
                    let title = result["dataObjects"][dob]["title"];
                    let body = result["dataObjects"][dob]["description"];
                    let url = result["dataObjects"][dob]["source"];
                    let license = result["dataObjects"][dob]["license"];
                    let rights = result["dataObjects"][dob]["rights"];
                    if (typeof rights === 'undefined') {
                        rights = "(c)" + result["dataObjects"][dob]["rightsHolder"];
                    }
                    let txt_element = _.template(txt_template)({ title: title, body: body, href: url, rights: rights, license: license });
                    $('#organism-txt-column').append(txt_element);
                }
            });
            $("#vernacularName").text(getBestVernacularNameEOL(result));
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showMessageDialog(errorThrown, 'danger');
        }
    }).always(function () {
        $('#loading-progress').empty();
    });
    $("#toggleCitationButton").on("click", function () {
        $(".trait-citation").toggle();
    });
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ 3:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./app/Resources/client/jsx/organism/details.jsx");


/***/ })

},[3]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvb3JnYW5pc20vZGV0YWlscy5qc3giLCJ3ZWJwYWNrOi8vLy4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L29yZ2FuaXNtL2RldGFpbHMvYXBwZW5kVHJhaXRzLmpzeCIsIndlYnBhY2s6Ly8vLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvb3JnYW5pc20vZGV0YWlscy9lb2wuanN4Il0sIm5hbWVzIjpbInJlcXVpcmUiLCJhcHBlbmRUcmFpdEVudHJpZXMiLCJkb21FbGVtZW50IiwidHJhaXRFbnRyaWVzIiwidHJhaXRGb3JtYXQiLCIkIiwiYWpheCIsInVybCIsIlJvdXRpbmciLCJnZW5lcmF0ZSIsImRhdGEiLCJkYnZlcnNpb24iLCJtZXRob2QiLCJzdWNjZXNzIiwicmVzdWx0IiwiZWFjaCIsImtleSIsInZhbHVlIiwicmVhbFZhbHVlIiwidmFsdWVfZGVmaW5pdGlvbiIsInVuaXRTdHJpbmciLCJ1bml0IiwidHJhaXRDaXRhdGlvbkRpdiIsInRleHQiLCJjaXRhdGlvbiIsImNzcyIsIm9yaWdpblVybCIsIm9yaWdpbl91cmwiLCJhcHBlbmQiLCJnbG9iYWwiLCJyZWFkeSIsImltZ190ZW1wbGF0ZSIsInR4dF90ZW1wbGF0ZSIsImlkIiwiZW9sX2lkIiwiYmF0Y2giLCJpbWFnZXNfcGVyX3BhZ2UiLCJpbWFnZXNfcGFnZSIsInZpZGVvc19wZXJfcGFnZSIsInZpZGVvc19wYWdlIiwic291bmRzX3Blcl9wYWdlIiwic291bmRzX3BhZ2UiLCJtYXBzX3Blcl9wYWdlIiwibWFwc19wYWdlIiwidGV4dHNfcGVyX3BhZ2UiLCJ0ZXh0c19wYWdlIiwiaXVjbiIsInN1YmplY3RzIiwibGljZW5zZXMiLCJkZXRhaWxzIiwiY29tbW9uX25hbWVzIiwic3lub255bXMiLCJyZWZlcmVuY2VzIiwidGF4b25vbXkiLCJ2ZXR0ZWQiLCJjYWNoZV90dGwiLCJsYW5ndWFnZSIsImNvbnNvbGUiLCJsb2ciLCJkb2IiLCJsaWNlbnNlIiwicmlnaHRzIiwic291cmNlIiwiaW1nX2VsZW1lbnQiLCJfIiwidGVtcGxhdGUiLCJzcmMiLCJocmVmIiwidGl0bGUiLCJib2R5IiwidHh0X2VsZW1lbnQiLCJnZXRCZXN0VmVybmFjdWxhck5hbWVFT0wiLCJlcnJvciIsImpxWEhSIiwidGV4dFN0YXR1cyIsImVycm9yVGhyb3duIiwic2hvd01lc3NhZ2VEaWFsb2ciLCJhbHdheXMiLCJlbXB0eSIsIm9uIiwidG9nZ2xlIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG1CQUFBQSxDQUFRLDhEQUFSO0FBQ0EsbUJBQUFBLENBQVEscURBQVIsRTs7Ozs7OztBQ0RBOzs7O0FBSUEsU0FBU0Msa0JBQVQsQ0FBNEJDLFVBQTVCLEVBQXdDQyxZQUF4QyxFQUFzREMsV0FBdEQsRUFBa0U7QUFDOURDLE1BQUVDLElBQUYsQ0FBTztBQUNIQyxhQUFLQyxRQUFRQyxRQUFSLENBQWlCLEtBQWpCLEVBQXdCLEVBQUMsYUFBYSxTQUFkLEVBQXlCLGFBQWEsY0FBdEMsRUFBeEIsQ0FERjtBQUVIQyxjQUFNO0FBQ0YseUJBQWFDLFNBRFg7QUFFRiwrQkFBbUJSLFlBRmpCO0FBR0YsNEJBQWdCQztBQUhkLFNBRkg7QUFPSFEsZ0JBQVEsS0FQTDtBQVFIQyxpQkFBUyxVQUFTQyxNQUFULEVBQWdCO0FBQ3JCVCxjQUFFVSxJQUFGLENBQU9ELE1BQVAsRUFBZSxVQUFVRSxHQUFWLEVBQWVDLEtBQWYsRUFBc0I7QUFDakMsb0JBQUlDLFlBQVlELE1BQU1BLEtBQXRCO0FBQ0Esb0JBQUdBLE1BQU1BLEtBQU4sS0FBZ0IsSUFBbkIsRUFBd0I7QUFDcEJDLGdDQUFZRCxNQUFNRSxnQkFBbEI7QUFDSDtBQUNELG9CQUFJQyxhQUFhLEVBQWpCO0FBQ0Esb0JBQUdILE1BQU1JLElBQU4sSUFBYyxJQUFqQixFQUFzQjtBQUNsQkQsaUNBQWEsT0FBTUgsTUFBTUksSUFBWixHQUFrQixHQUEvQjtBQUNIO0FBQ0Qsb0JBQUlDLG1CQUFtQmpCLEVBQUUsOEJBQUYs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dUJBQUYsRUFBMkIwRSxFQUEzQixDQUE4QixPQUE5QixFQUF1QyxZQUFVO0FBQzdDMUUsVUFBRSxpQkFBRixFQUFxQjJFLE1BQXJCO0FBQ0gsS0FGRDtBQUdILENBckVELEUiLCJmaWxlIjoib3JnYW5pc20vZGV0YWlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJy4vZGV0YWlscy9hcHBlbmRUcmFpdHMuanN4JylcbnJlcXVpcmUoJy4vZGV0YWlscy9lb2wuanN4JylcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvb3JnYW5pc20vZGV0YWlscy5qc3giLCIvKipcbiAqIENyZWF0ZWQgYnkgczIxNjEyMSBvbiAxNC4wMy4xNy5cbiAqL1xuXG5mdW5jdGlvbiBhcHBlbmRUcmFpdEVudHJpZXMoZG9tRWxlbWVudCwgdHJhaXRFbnRyaWVzLCB0cmFpdEZvcm1hdCl7XG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiBSb3V0aW5nLmdlbmVyYXRlKCdhcGknLCB7J25hbWVzcGFjZSc6ICdkZXRhaWxzJywgJ2NsYXNzbmFtZSc6ICdUcmFpdEVudHJpZXMnfSksXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIFwiZGJ2ZXJzaW9uXCI6IGRidmVyc2lvbixcbiAgICAgICAgICAgIFwidHJhaXRfZW50cnlfaWRzXCI6IHRyYWl0RW50cmllcyxcbiAgICAgICAgICAgIFwidHJhaXRfZm9ybWF0XCI6IHRyYWl0Rm9ybWF0XG4gICAgICAgIH0sXG4gICAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgICAgICAgICQuZWFjaChyZXN1bHQsIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlYWxWYWx1ZSA9IHZhbHVlLnZhbHVlO1xuICAgICAgICAgICAgICAgIGlmKHZhbHVlLnZhbHVlID09PSBudWxsKXtcbiAgICAgICAgICAgICAgICAgICAgcmVhbFZhbHVlID0gdmFsdWUudmFsdWVfZGVmaW5pdGlvbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IHVuaXRTdHJpbmcgPSBcIlwiXG4gICAgICAgICAgICAgICAgaWYodmFsdWUudW5pdCAhPSBudWxsKXtcbiAgICAgICAgICAgICAgICAgICAgdW5pdFN0cmluZyA9IFwiICRcIisgdmFsdWUudW5pdCArXCIkXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IHRyYWl0Q2l0YXRpb25EaXYgPSAkKCc8ZGl2IGNsYXNzPVwidHJhaXQtY2l0YXRpb25cIj4nKS50ZXh0KHZhbHVlLmNpdGF0aW9uKS5jc3Moeydmb250LXNpemUnOiAnMTFweCd9KVxuICAgICAgICAgICAgICAgIGxldCBvcmlnaW5VcmwgPSAkKGA8YSBocmVmPVwiJHt2YWx1ZS5vcmlnaW5fdXJsfVwiPmApLnRleHQoXCIgb3JpZ2luXCIpXG4gICAgICAgICAgICAgICAgaWYodmFsdWUub3JpZ2luX3VybCAhPSBcIlwiKXtcbiAgICAgICAgICAgICAgICAgICAgdHJhaXRDaXRhdGlvbkRpdi5hcHBlbmQob3JpZ2luVXJsKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkb21FbGVtZW50LmFwcGVuZCgkKCc8ZGl2PicpLnRleHQocmVhbFZhbHVlK3VuaXRTdHJpbmcpLmFwcGVuZCh0cmFpdENpdGF0aW9uRGl2KSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG4vLyBleHBvcnQgZnVuY3Rpb24gZ2xvYmFsbHlcbmdsb2JhbC5hcHBlbmRUcmFpdEVudHJpZXMgPSBhcHBlbmRUcmFpdEVudHJpZXM7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXBwL1Jlc291cmNlcy9jbGllbnQvanN4L29yZ2FuaXNtL2RldGFpbHMvYXBwZW5kVHJhaXRzLmpzeCIsIi8qKlxuICogQ3JlYXRlZCBieSBzMjE2MTIxIG9uIDE0LjAzLjE3LlxuICovXG4kKCdkb2N1bWVudCcpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgbGV0IGltZ190ZW1wbGF0ZSA9ICc8YSBjbGFzcz1cInRodW1ibmFpbFwiIGhyZWY9XCI8JT0gaHJlZiAlPlwiPjxpbWcgc3JjPVwiPCU9IHNyYyAlPlwiLz48L2E+PGEgaHJlZj1cIjwlPSBzb3VyY2UgJT5cIj48ZGl2PjwlPSByaWdodHMgJT4gPCU9IGxpY2Vuc2UgJT48L2Rpdj48L2E+JztcbiAgICBsZXQgdHh0X3RlbXBsYXRlID0gJzxkaXYgY2xhc3M9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCI+PGRpdiBjbGFzcz1cInBhbmVsLWhlYWRpbmdcIj48aDMgY2xhc3M9XCJwYW5lbC10aXRsZVwiPjwlPSB0aXRsZSAlPjwvaDM+PGEgaHJlZj1cIjwlPSBocmVmICU+XCI+PCU9IHJpZ2h0cyAlPiA8JT0gbGljZW5zZSAlPjwvYT48L2Rpdj48ZGl2IGNsYXNzPVwicGFuZWwtYm9keVwiPjwlPSBib2R5ICU+PC9kaXY+PC9kaXY+JztcbiAgICAkLmFqYXgoe1xuICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICAgIHVybDogXCJodHRwOi8vZW9sLm9yZy9hcGkvcGFnZXMvMS4wLmpzb25cIixcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgaWQ6IGVvbF9pZCxcbiAgICAgICAgICAgIGJhdGNoOiBmYWxzZSxcbiAgICAgICAgICAgIGltYWdlc19wZXJfcGFnZTogMyxcbiAgICAgICAgICAgIGltYWdlc19wYWdlOiAxLFxuICAgICAgICAgICAgdmlkZW9zX3Blcl9wYWdlOiAwLFxuICAgICAgICAgICAgdmlkZW9zX3BhZ2U6IDEsXG4gICAgICAgICAgICBzb3VuZHNfcGVyX3BhZ2U6IDAsXG4gICAgICAgICAgICBzb3VuZHNfcGFnZTogMSxcbiAgICAgICAgICAgIG1hcHNfcGVyX3BhZ2U6IDAsXG4gICAgICAgICAgICBtYXBzX3BhZ2U6IDEsXG4gICAgICAgICAgICB0ZXh0c19wZXJfcGFnZTogMyxcbiAgICAgICAgICAgIHRleHRzX3BhZ2U6IDEsXG4gICAgICAgICAgICBpdWNuOiB0cnVlLFxuICAgICAgICAgICAgc3ViamVjdHM6IFwib3ZlcnZpZXdcIixcbiAgICAgICAgICAgIGxpY2Vuc2VzOiBcImNjLWJ5fGNjLWJ5LW5jfGNjLWJ5LXNhfGNjLWJ5LW5jLXNhfHBkXCIsXG4gICAgICAgICAgICBkZXRhaWxzOiB0cnVlLFxuICAgICAgICAgICAgY29tbW9uX25hbWVzOiB0cnVlLFxuICAgICAgICAgICAgc3lub255bXM6IHRydWUsXG4gICAgICAgICAgICByZWZlcmVuY2VzOiB0cnVlLFxuICAgICAgICAgICAgdGF4b25vbXk6IHRydWUsXG4gICAgICAgICAgICB2ZXR0ZWQ6IDAsXG4gICAgICAgICAgICBjYWNoZV90dGw6IDYwLFxuICAgICAgICAgICAgbGFuZ3VhZ2U6IFwiZW5cIlxuICAgICAgICB9LFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcbiAgICAgICAgICAgICQuZWFjaChyZXN1bHRbXCJkYXRhT2JqZWN0c1wiXSwgZnVuY3Rpb24gKGRvYikge1xuICAgICAgICAgICAgICAgIGlmKHJlc3VsdFtcImRhdGFPYmplY3RzXCJdW2RvYl1bXCJkYXRhVHlwZVwiXSA9PT0gXCJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZVwiKXtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHVybCA9IHJlc3VsdFtcImRhdGFPYmplY3RzXCJdW2RvYl1bXCJlb2xNZWRpYVVSTFwiXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxpY2Vuc2UgPSByZXN1bHRbXCJkYXRhT2JqZWN0c1wiXVtkb2JdW1wibGljZW5zZVwiXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJpZ2h0cyA9IHJlc3VsdFtcImRhdGFPYmplY3RzXCJdW2RvYl1bXCJyaWdodHNcIl07XG4gICAgICAgICAgICAgICAgICAgIGlmKHR5cGVvZiByaWdodHMgPT09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0cyA9IFwiKGMpXCIrcmVzdWx0W1wiZGF0YU9iamVjdHNcIl1bZG9iXVtcInJpZ2h0c0hvbGRlclwiXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsZXQgc291cmNlID0gcmVzdWx0W1wiZGF0YU9iamVjdHNcIl1bZG9iXVtcInNvdXJjZVwiXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGltZ19lbGVtZW50ID0gXy50ZW1wbGF0ZShpbWdfdGVtcGxhdGUpKHtzcmM6IHVybCwgaHJlZjogdXJsLCBsaWNlbnNlOiBsaWNlbnNlLCByaWdodHM6IHJpZ2h0cywgc291cmNlOiBzb3VyY2V9KTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI29yZ2FuaXNtLWltZy1jb2x1bW4nKS5hcHBlbmQoaW1nX2VsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZihyZXN1bHRbXCJkYXRhT2JqZWN0c1wiXVtkb2JdW1wiZGF0YVR5cGVcIl0gPT09IFwiaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1RleHRcIil7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0aXRsZSA9IHJlc3VsdFtcImRhdGFPYmplY3RzXCJdW2RvYl1bXCJ0aXRsZVwiXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJvZHkgPSByZXN1bHRbXCJkYXRhT2JqZWN0c1wiXVtkb2JdW1wiZGVzY3JpcHRpb25cIl07XG4gICAgICAgICAgICAgICAgICAgIGxldCB1cmwgPSByZXN1bHRbXCJkYXRhT2JqZWN0c1wiXVtkb2JdW1wic291cmNlXCJdO1xuICAgICAgICAgICAgICAgICAgICBsZXQgbGljZW5zZSA9IHJlc3VsdFtcImRhdGFPYmplY3RzXCJdW2RvYl1bXCJsaWNlbnNlXCJdO1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmlnaHRzID0gcmVzdWx0W1wiZGF0YU9iamVjdHNcIl1bZG9iXVtcInJpZ2h0c1wiXTtcbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mIHJpZ2h0cyA9PT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHRzID0gXCIoYylcIityZXN1bHRbXCJkYXRhT2JqZWN0c1wiXVtkb2JdW1wicmlnaHRzSG9sZGVyXCJdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxldCB0eHRfZWxlbWVudCA9IF8udGVtcGxhdGUodHh0X3RlbXBsYXRlKSh7dGl0bGU6IHRpdGxlLCBib2R5OiBib2R5LCBocmVmOiB1cmwsIHJpZ2h0czogcmlnaHRzLCBsaWNlbnNlOiBsaWNlbnNlfSk7XG4gICAgICAgICAgICAgICAgICAgICQoJyNvcmdhbmlzbS10eHQtY29sdW1uJykuYXBwZW5kKHR4dF9lbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoXCIjdmVybmFjdWxhck5hbWVcIikudGV4dChnZXRCZXN0VmVybmFjdWxhck5hbWVFT0wocmVzdWx0KSk7XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiBmdW5jdGlvbiAoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSB7XG4gICAgICAgICAgICBzaG93TWVzc2FnZURpYWxvZyhlcnJvclRocm93biwgJ2RhbmdlcicpO1xuICAgICAgICB9XG4gICAgfSkuYWx3YXlzKGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJyNsb2FkaW5nLXByb2dyZXNzJykuZW1wdHkoKTtcbiAgICB9KTtcbiAgICAkKFwiI3RvZ2dsZUNpdGF0aW9uQnV0dG9uXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgJChcIi50cmFpdC1jaXRhdGlvblwiKS50b2dnbGUoKTtcbiAgICB9KVxufSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hcHAvUmVzb3VyY2VzL2NsaWVudC9qc3gvb3JnYW5pc20vZGV0YWlscy9lb2wuanN4Il0sInNvdXJjZVJvb3QiOiIifQ==