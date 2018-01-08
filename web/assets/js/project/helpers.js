webpackJsonp([4],{"+yTn":/*!*****************************************************************************!*\
  !*** ./app/Resources/client/jsx/project/helpers/removeTraitFromProject.jsx ***!
  \*****************************************************************************/
/*! no static exports found */
/*! all exports used */
function(t,e,a){(function(e){function a(t,a,n,i,o,r){var c="columns"===n?a.columns:a.rows,s=!0,d=!1,u=void 0;try{for(var l,f=c[Symbol.iterator]();!(s=(l=f.next()).done);s=!0){var m=l.value;null!=m.metadata&&(delete m.metadata[t],null!=m.metadata.trait_citations&&delete m.metadata.trait_citations[t])}}catch(t){d=!0,u=t}finally{try{!s&&f.return&&f.return()}finally{if(d)throw u}}var g=Routing.generate("api",{namespace:"edit",classname:"updateProject"});e.ajax(g,{data:{dbversion:i,project_id:o,biom:a.toString()},method:"POST",success:r,error:function(t){return showMessageDialog(t,"danger")}})}t.exports=a}).call(e,a(/*! jquery */"7t+N"))},1:/*!************************************************************!*\
  !*** multi ./app/Resources/client/jsx/project/helpers.jsx ***!
  \************************************************************/
/*! no static exports found */
/*! all exports used */
function(t,e,a){t.exports=a(/*! ./app/Resources/client/jsx/project/helpers.jsx */"TERn")},TERn:/*!******************************************************!*\
  !*** ./app/Resources/client/jsx/project/helpers.jsx ***!
  \******************************************************/
/*! no static exports found */
/*! all exports used */
function(t,e,a){a(/*! ./helpers/addTraitToProject.jsx */"fAub"),a(/*! ./helpers/removeTraitFromProject.jsx */"+yTn")},fAub:/*!************************************************************************!*\
  !*** ./app/Resources/client/jsx/project/helpers/addTraitToProject.jsx ***!
  \************************************************************************/
/*! no static exports found */
/*! all exports used */
function(t,e,a){(function(e){function a(t,a,n,i,o,r,c,s){console.log(arguments);var d=i.getMetadata({dimension:o,attribute:["fennec",dbversion,"fennec_id"]}).map(function(t){return t in a?a[t]:null}),u=i.getMetadata({dimension:o,attribute:["fennec",dbversion,"fennec_id"]}).map(function(t){return t in n?n[t]:[]});i.addMetadata({dimension:o,attribute:t,values:d}),i.addMetadata({dimension:o,attribute:["trait_citations",t],values:u});var l=Routing.generate("api",{namespace:"edit",classname:"updateProject"});e.ajax(l,{data:{dbversion:r,project_id:c,biom:i.toString()},method:"POST",success:s,error:function(t){return showMessageDialog(t,"danger")}})}t.exports=a}).call(e,a(/*! jquery */"7t+N"))}},[1]);