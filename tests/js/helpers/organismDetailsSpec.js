// chai is an assertion library
let chai = require('chai');

// @see http://chaijs.com/api/assert/
let assert = chai.assert;

// register alternative styles
// @see http://chaijs.com/api/bdd/
chai.expect();
chai.should();

// fs for reading test files
let fs = require('fs');
let rewire = require("rewire");

// fake window as empty object
global.window = {};

let organismDetails = rewire("../../../app/Resources/client/jsx/helpers/organismDetails.js");

describe('helpers/organismDetails', () => {
    describe('getBestVernacularNameEOL works properly', () => {
        let getBestVernacularNameEOL = organismDetails.__get__('getBestVernacularNameEOL');
        it('function is available', () => {
            assert.equal(typeof getBestVernacularNameEOL, 'function');
        });
        it('function returns empty string if neither scientificName nor vernacularNames are given', () => {
            assert.equal(getBestVernacularNameEOL({}), '');
        });
        it('function returns scientificName if no vernacularNames are given', () => {
            assert.equal(getBestVernacularNameEOL({scientificName: 'My Sciname'}), 'My Sciname');
        });
        it('function returns english vernacularName if present', () => {
            assert.equal(getBestVernacularNameEOL({scientificName: 'My Sciname', vernacularNames: [
                {language: 'de', vernacularName: 'Deutscher Name'},
                {language: 'en', vernacularName: 'English Name'}
            ]}), 'English Name');
        });
        it('function returns eolPreferred english vernacularName if present', () => {
            assert.equal(getBestVernacularNameEOL({scientificName: 'My Sciname', vernacularNames: [
                {language: 'de', vernacularName: 'Deutscher Name'},
                {language: 'en', vernacularName: 'English Name'},
                {language: 'en', vernacularName: 'English Preferred Name', eol_preferred: true},
                {language: 'en', vernacularName: 'Another English Name'}
            ]}), 'English Preferred Name');
        });
    });
});