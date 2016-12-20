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
        it('function returns empty object if called with an empty object', () => {
            assert.deepEqual(condenseTraitValues({}), {});
        });
        it('function returns trait by organism if already unique (single value)', () => {
            assert.deepEqual(condenseTraitValues({
                "annual": [2888, 109884]
            }), {'2888': 'annual', '109884': 'annual'});
        });
        it('function returns trait by organism if already unique (multiple values)', () => {
            assert.deepEqual(condenseTraitValues({
                "annual": [2888, 109884],
                "perennial": [46032, 6661, 25517]
            }), {'2888': 'annual', '109884': 'annual', '46032': 'perennial', '6661': 'perennial', '25517': 'perennial'});
        });
        it('function returns trait by organism if not unique (multiple values)', () => {
            assert.deepEqual(condenseTraitValues({
                "annual": [2888, 6661, 109884],
                "perennial": [46032, 6661, 25517]
            }), {'2888': 'annual', '109884': 'annual', '46032': 'perennial', '6661': 'annual/perennial', '25517': 'perennial'});
        });
    });
});