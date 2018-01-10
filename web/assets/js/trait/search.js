webpackJsonp([6],{6:/*!*********************************************************!*\
  !*** multi ./app/Resources/client/jsx/trait/search.jsx ***!
  \*********************************************************/
/*! no static exports found */
/*! all exports used */
function(t,e,a){t.exports=a(/*! ./app/Resources/client/jsx/trait/search.jsx */"U3YH")},Q8uE:/*!***************************************************************!*\
  !*** ./app/Resources/client/jsx/trait/search/quickSearch.jsx ***!
  \***************************************************************/
/*! no static exports found */
/*! all exports used */
function(t,e,a){(function(t){t(document).ready(function(){t("#search_trait").autocomplete({position:{my:"right top",at:"right bottom"},source:function(e,a){var n=e.term;t.ajax({url:Routing.generate("api",{namespace:"listing",classname:"traits"}),data:{term:e.term,limit:500,search:n,dbversion:dbversion},dataType:"json",success:function(t){a(t.map(function(t){return t.value=t.name,t}))}})},minLength:3}),t("#search_trait").data("ui-autocomplete")._renderItem=function(e,a){var n=Routing.generate("trait_details",{dbversion:dbversion,trait_type_id:a.trait_type_id}),i="<a href='"+n+"'><span style='display:inline-block; width: 100%; font-style: italic;'>"+a.name+"</span></a>";return t("<li>").append(i).appendTo(e)},t("#btn_search_trait").click(function(){var e=t("#search_trait").val(),a=Routing.generate("trait_result",{dbversion:dbversion,limit:500,search:e});window.location.href=a}),t("#search_trait").keyup(function(e){13==e.keyCode&&t("#btn_search_trait").click()})})}).call(e,a(/*! jquery */"7t+N"))},U3YH:/*!***************************************************!*\
  !*** ./app/Resources/client/jsx/trait/search.jsx ***!
  \***************************************************/
/*! no static exports found */
/*! all exports used */
function(t,e,a){a(/*! ./search/quickSearch.jsx */"Q8uE")}},[6]);