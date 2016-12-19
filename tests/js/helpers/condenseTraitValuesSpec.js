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

let organismDetails = rewire("../../../app/Resources/client/jsx/helpers/condenseTraitValues.jsx");

describe('helpers/condenseTraitValues', () => {
    describe('condenseTraitValues works properly', () => {
        let condenseTraitValues = organismDetails.__get__('condenseTraitValues');
        it('function is available', () => {
            assert.equal(typeof condenseTraitValues, 'function');
        });
        it('function returns empty array if called with an empty array', () => {
            assert.deepEqual(condenseTraitValues([]), []);
        });
    });
});