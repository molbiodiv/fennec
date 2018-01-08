webpackJsonp([5],{3:/*!*************************************************************!*\
  !*** multi ./app/Resources/client/jsx/organism/details.jsx ***!
  \*************************************************************/
/*! no static exports found */
/*! all exports used */
function(e,a,t){e.exports=t(/*! ./app/Resources/client/jsx/organism/details.jsx */"y8hE")},"O/VZ":/*!********************************************************************!*\
  !*** ./app/Resources/client/jsx/organism/details/appendTraits.jsx ***!
  \********************************************************************/
/*! no static exports found */
/*! all exports used */
function(e,a,t){(function(e,a){function t(a,t,i){e.ajax({url:Routing.generate("api",{namespace:"details",classname:"TraitEntries"}),data:{dbversion:dbversion,trait_entry_ids:t,trait_format:i},method:"GET",success:function(t){e.each(t,function(t,i){var s=i.value;null===i.value&&(s=i.value_definition);var n="";null!=i.unit&&(n=" $"+i.unit+"$");var c=e('<div class="trait-citation">').text(i.citation).css({"font-size":"11px"}),r=e('<a href="'+i.origin_url+'">').text(" origin");""!=i.origin_url&&c.append(r),a.append(e("<div>").text(s+n).append(c))})}})}a.appendTraitEntries=t}).call(a,t(/*! jquery */"7t+N"),t(/*! ./../../../../../../node_modules/webpack/buildin/global.js */"DuR2"))},qfj6:/*!***********************************************************!*\
  !*** ./app/Resources/client/jsx/organism/details/eol.jsx ***!
  \***********************************************************/
/*! no static exports found */
/*! all exports used */
function(e,a,t){(function(e){e("document").ready(function(){e.ajax({method:"GET",url:"http://eol.org/api/pages/1.0.json",data:{id:eol_id,batch:!1,images_per_page:3,images_page:1,videos_per_page:0,videos_page:1,sounds_per_page:0,sounds_page:1,maps_per_page:0,maps_page:1,texts_per_page:3,texts_page:1,iucn:!0,subjects:"overview",licenses:"cc-by|cc-by-nc|cc-by-sa|cc-by-nc-sa|pd",details:!0,common_names:!0,synonyms:!0,references:!0,taxonomy:!0,vetted:0,cache_ttl:60,language:"en"},success:function(a){console.log(a),e.each(a.dataObjects,function(t){if("http://purl.org/dc/dcmitype/StillImage"===a.dataObjects[t].dataType){var i=a.dataObjects[t].eolMediaURL,s=a.dataObjects[t].license,n=a.dataObjects[t].rights;void 0===n&&(n="(c)"+a.dataObjects[t].rightsHolder);var c=a.dataObjects[t].source,r=_.template('<a class="thumbnail" href="<%= href %>"><img src="<%= src %>"/></a><a href="<%= source %>"><div><%= rights %> <%= license %></div></a>')({src:i,href:i,license:s,rights:n,source:c});e("#organism-img-column").append(r)}if("http://purl.org/dc/dcmitype/Text"===a.dataObjects[t].dataType){var o=a.dataObjects[t].title,d=a.dataObjects[t].description,l=a.dataObjects[t].source,p=a.dataObjects[t].license,u=a.dataObjects[t].rights;void 0===u&&(u="(c)"+a.dataObjects[t].rightsHolder);var g=_.template('<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title"><%= title %></h3><a href="<%= href %>"><%= rights %> <%= license %></a></div><div class="panel-body"><%= body %></div></div>')({title:o,body:d,href:l,rights:u,license:p});e("#organism-txt-column").append(g)}}),e("#vernacularName").text(getBestVernacularNameEOL(a))},error:function(e,a,t){showMessageDialog(t,"danger")}}).always(function(){e("#loading-progress").empty()}),e("#toggleCitationButton").on("click",function(){e(".trait-citation").toggle()})})}).call(a,t(/*! jquery */"7t+N"))},y8hE:/*!*******************************************************!*\
  !*** ./app/Resources/client/jsx/organism/details.jsx ***!
  \*******************************************************/
/*! no static exports found */
/*! all exports used */
function(e,a,t){t(/*! ./details/appendTraits.jsx */"O/VZ"),t(/*! ./details/eol.jsx */"qfj6")}},[3]);