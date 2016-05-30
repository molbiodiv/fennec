/**
 * Creates an object of type Biom for showing the projects data using data tables
 * @constructor
 * @param {Object} biomObject - JSON object containing the biom file of a project 
 * @throws Will throw an error if the biomObject does not contain a id
 * @example 
 * // initializes a Biom object 
 * var biom = new Biom(biom)
 */

Biom = function(biomObject){
    var biom = {};
    if (biomObject.id === undefined){
        throw 'There is no id';
    } else {
        biom.id = biomObject.id;
    }
    if (biomObject.format === undefined){
        throw 'There is no name and version of current biom format';
    } else {
        biom.format = biomObject.format;
    }
    if (biomObject.format_url === undefined){
        throw 'There is no URL providing format details';
    } else {
        biom.format_url = biomObject.format_url;
    }
    if (biomObject.type === undefined){
        throw 'There is no table type';
    } else {
        biom.type = biomObject.type;
    }
    if (biomObject.generated_by === undefined){
        throw 'There is no package and revision  that built the table';
    } else {
        biom.generated_by = biomObject.generated_by;
    }
    if (biomObject.date === undefined){
        throw 'There is no date the table was built';
    } else {
        biom.date = biomObject.date;
    }
    if (biomObject.rows === undefined){
        throw 'There are no rows describing the object';
    } else {
        biom.rows = biomObject.rows;
    }
    if (biomObject.columns === undefined){
        throw 'There are no columns describing the object';
    } else {
        biom.columns = biomObject.columns;
    }
    if (biomObject.matrix_type === undefined){
        throw 'There is no type of matrix data representation';
    } else {
        biom.matrix_type = biomObject.matrix_type;
    }
    if (biomObject.matrix_element_type === undefined){
        throw 'There is no value type in matrix';
    } else {
        biom.matrix_element_type = biomObject.matrix_element_type;
    }
    if (biomObject.shape === undefined){
        throw 'There is no shape information';
    } else {
        biom.shape = biomObject.shape;
    }
    if (biomObject.data === undefined){
        throw 'There is no data';
    } else {
        biom.data = biomObject.data;
    }
    return biom;
};