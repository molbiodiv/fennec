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
    describe('condenseCategoricalTraitValues works properly', () => {
        let condenseCategoricalTraitValues = organismDetails.__get__('condenseCategoricalTraitValues');
        it('function is available', () => {
            assert.equal(typeof condenseCategoricalTraitValues, 'function');
        });
        it('function returns empty object if called with an empty object', () => {
            assert.deepEqual(condenseCategoricalTraitValues({}), {});
        });
        it('function returns trait by organism if already unique (single value)', () => {
            assert.deepEqual(condenseCategoricalTraitValues({
                "annual": [2888, 109884]
            }), {'2888': 'annual', '109884': 'annual'});
        });
        it('function returns trait by organism if already unique (multiple values)', () => {
            assert.deepEqual(condenseCategoricalTraitValues({
                "annual": [2888, 109884],
                "perennial": [46032, 6661, 25517]
            }), {'2888': 'annual', '109884': 'annual', '46032': 'perennial', '6661': 'perennial', '25517': 'perennial'});
        });
        it('function returns trait by organism if not unique (multiple values)', () => {
            assert.deepEqual(condenseCategoricalTraitValues({
                "annual": [2888, 6661, 109884],
                "perennial": [46032, 6661, 25517]
            }), {'2888': 'annual', '109884': 'annual', '46032': 'perennial', '6661': 'annual/perennial', '25517': 'perennial'});
        });
    });
    describe('condenseNumericalTraitValues works properly', () => {
        let condenseNumericalTraitValues = organismDetails.__get__('condenseNumericalTraitValues');
        it('function is available', () => {
            assert.equal(typeof condenseNumericalTraitValues, 'function');
        });
        it('function returns empty object if called with an empty object', () => {
            assert.deepEqual(condenseNumericalTraitValues({}), {});
        });
        it('function returns trait by organism if already unique (single value)', () => {
            assert.deepEqual(condenseNumericalTraitValues({
                2888: [2888.1],
                109884: [10.981]
            }), {'2888': 2888.1, '109884': 10.981});
        });
        it('function returns mean of trait by organism if not unique (multiple values)', () => {
            assert.deepEqual(condenseNumericalTraitValues({
                2888: [2888.1, 2888.1],
                109884: [10.981, 0, 10, 0],
                46032: [13.28, 11.21]
            }), {'2888': 2888.1, '109884': 5.24525, '46032': 12.245});
        });
    });
});