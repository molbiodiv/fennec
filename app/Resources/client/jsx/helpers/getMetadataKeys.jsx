let _ = require('lodash');

function getMetadataKeys(biom, dimension='columns'){
    let elements = _.cloneDeep(dimension === 'columns' ? biom.columns : biom.rows)
    if(typeof elements === 'undefined'){
        return [];
    }
    let keys = elements.map(element => element.metadata === null ? [] : Object.keys(element.metadata))
    let uniqKeys = keys.reduce((acc, val) => _.uniq(acc.concat(val)), [])
    return uniqKeys.sort((a,b) => a.toUpperCase().localeCompare(b.toUpperCase()))
}