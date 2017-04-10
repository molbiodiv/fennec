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

let getMetadataKeysFile = rewire("../../../app/Resources/client/jsx/helpers/getMetadataKeys.jsx");

describe('helpers/getMetadataKeys', () => {
    describe('getMetadataKeys works properly', () => {
        let getMetadataKeys = getMetadataKeysFile.__get__('getMetadataKeys');
        it('function is available', () => {
            assert.equal(typeof getMetadataKeys, 'function');
        });
        it('function returns empty array if biom object is empty', () => {
            assert.deepEqual(getMetadataKeys({}, 'columns'), []);
        });
        let biom = {
                columns: [
                    {id: 'S1', metadata: {beeSpecies: 'bla'}},
                    {id: 'S2', metadata: {phinchID: 'blub'}}
                ],
                rows: [
                    {id: 'OTU1', metadata: {taxonomy: 'k__;p__'}},
                    {id: 'OTU2', metadata: {'Plant Habit': 'tree'}}
                ]
            }
        it('function returns metadata keys for columns', () => {
            assert.deepEqual(getMetadataKeys(biom, 'columns'), ['beeSpecies', 'phinchID']);
        });
        it('function returns metadata keys for rows', () => {
            assert.deepEqual(getMetadataKeys(biom, 'rows'), ['taxonomy', 'Plant Habit']);
        });
    });
});