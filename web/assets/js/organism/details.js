webpackJsonp([5],{3:/*!*************************************************************!*\
  !*** multi ./app/Resources/client/jsx/organism/details.jsx ***!
  \*************************************************************/
/*! no static exports found */
/*! all exports used */
function(e,t,a){e.exports=a(/*! ./app/Resources/client/jsx/organism/details.jsx */"y8hE")},"O/VZ":/*!********************************************************************!*\
  !*** ./app/Resources/client/jsx/organism/details/appendTraits.jsx ***!
  \********************************************************************/
/*! no static exports found */
/*! all exports used */
function(e,t,a){(function(e,t){function a(t,a,i){e.ajax({url:Routing.generate("api_details_trait_entries",{dbversion:dbversion}),data:{trait_entry_ids:a,trait_format:i},method:"GET",success:function(a){e.each(a,function(a,i){var s=i.value;null===i.value&&(s=i.value_definition);var n="";null!=i.unit&&(n=" $"+i.unit+"$");var c=e('<div class="trait-citation">').text(i.citation).css({"font-size":"11px"}),r=e('<a href="'+i.origin_url+'">').text(" origin");""!=i.origin_url&&c.append(r),t.append(e("<div>").text(s+n).append(c))})}})}t.appendTraitEntries=a}).call(t,a(/*! jquery */"7t+N"),a(/*! ./../../../../../../node_modules/webpack/buildin/global.js */"DuR2"))},qfj6:/*!***********************************************************!*\
  !*** ./app/Resources/client/jsx/organism/details/eol.jsx ***!
  \***********************************************************/
/*! no static exports found */
/*! all exports used */
function(e,t,a){(function(e){e("document").ready(function(){e.ajax({method:"GET",url:"http://eol.org/api/pages/1.0.json",data:{id:eol_id,batch:!1,images_per_page:3,images_page:1,videos_per_page:0,videos_page:1,sounds_per_page:0,sounds_page:1,maps_per_page:0,maps_page:1,texts_per_page:3,texts_page:1,iucn:!0,subjects:"overview",licenses:"cc-by|cc-by-nc|cc-by-sa|cc-by-nc-sa|pd",details:!0,common_names:!0,synonyms:!0,references:!0,taxonomy:!0,vetted:0,cache_ttl:60,language:"en"},success:function(t){console.log(t),e.each(t.dataObjects,function(a){if("http://purl.org/dc/dcmitype/StillImage"===t.dataObjects[a].dataType){var i=t.dataObjects[a].eolMediaURL,s=t.dataObjects[a].license,n=t.dataObjects[a].rights;void 0===n&&(n="(c)"+t.dataObjects[a].rightsHolder);var c=t.dataObjects[a].source,r=_.template('<a class="thumbnail" href="<%= href %>"><img src="<%= src %>"/></a><a href="<%= source %>"><div><%= rights %> <%= license %></div></a>')({src:i,href:i,license:s,rights:n,source:c});e("#organism-img-column").append(r)}if("http://purl.org/dc/dcmitype/Text"===t.dataObjects[a].dataType){var o=t.dataObjects[a].title,d=t.dataObjects[a].description,l=t.dataObjects[a].source,p=t.dataObjects[a].license,u=t.dataObjects[a].rights;void 0===u&&(u="(c)"+t.dataObjects[a].rightsHolder);var g=_.template('<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title"><%= title %></h3><a href="<%= href %>"><%= rights %> <%= license %></a></div><div class="panel-body"><%= body %></div></div>')({title:o,body:d,href:l,rights:u,license:p});e("#organism-txt-column").append(g)}}),e("#vernacularName").text(getBestVernacularNameEOL(t))},error:function(e,t,a){showMessageDialog(a,"danger")}}).always(function(){e("#loading-progress").empty()}),e("#toggleCitationButton").on("click",function(){e(".trait-citation").toggle()})})}).call(t,a(/*! jquery */"7t+N"))},y8hE:/*!*******************************************************!*\
  !*** ./app/Resources/client/jsx/organism/details.jsx ***!
  \*******************************************************/
/*! no static exports found */
/*! all exports used */
function(e,t,a){a(/*! ./details/appendTraits.jsx */"O/VZ"),a(/*! ./details/eol.jsx */"qfj6")}},[3]);