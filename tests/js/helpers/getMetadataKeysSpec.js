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

let getMetadataKeys = rewire("../../../app/Resources/client/jsx/helpers/getMetadataKeys.jsx");

describe('helpers/getMetadataKeys', () => {
    describe('getMetadataKeys works properly', () => {
        let getMetadataKeys = getMetadataKeys.__get__('getMetadataKeys');
        it('function is available', () => {
            assert.equal(typeof getMetadataKeys, 'function');
        });
        it('function returns empty array if biom object is empty', () => {
            assert.equal(getMetadataKeys({}, 'columns'), []);
        });
    });
});