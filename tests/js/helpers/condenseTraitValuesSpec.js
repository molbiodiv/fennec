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
            assert.deepEqual(condenseTraitValues({'1': {
                'trait_type': 'habitat',
                'trait_entry_ids': [1, 20, 36, 7],
                'fennec_ids': [13, 20, 5]
            }}), {'13': 'habitat', '20': 'habitat', '5': 'habitat'});
        });
        it('function returns trait by organism if already unique (multiple values)', () => {
            assert.deepEqual(condenseTraitValues({'1': {
                'trait_type': 'habitat',
                'trait_entry_ids': [1, 20, 36, 7],
                'fennec_ids': [13, 20, 5]
            }}), {'13': 'habitat', '20': 'habitat', '5': 'habitat'});
        });
        it('function returns trait by organism if not unique (multiple values)', () => {
            assert.deepEqual(condenseTraitValues({'1': {
                'trait_type': 'habitat',
                'trait_entry_ids': [1, 20, 36, 7],
                'fennec_ids': [13, 20, 5]
            }}), {'13': 'habitat', '20': 'habitat', '5': 'habitat'});
        });
    });
});