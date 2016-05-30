/**
 * Creates an object of type Biom for showing the projects data using data tables
 * @constructor
 * @param {Object} biomObject - JSON object containing the biom file of a project 
 * @throws Will throw an error if the biomObject does not contain a project id
 * @example 
 * // initializes a Biom object 
 * var biom = new Biom(biom)
 */

Biom = function(biomObject){
    var biom = {};
    if (biomObject.id === undefined){
        throw 'There is no project id';
    } else {
        biom.id = biomObject.id;
    }
    return biom;
};