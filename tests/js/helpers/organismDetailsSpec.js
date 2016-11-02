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

let organismDetails = rewire("../../../app/Resources/client/jsx/helpers/organismDetails.js");

describe('helpers/organismDetails', () => {
    describe('getBestVernacularNameEOL works properly', () => {
        let getBestVernacularNameEOL = organismDetails.__get__('getBestVernacularNameEOL');
        it('function is available', () => {
            assert.equal(typeof getBestVernacularNameEOL, 'function');
        });
    });
});