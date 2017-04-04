function condenseCategoricalTraitValues(organismsByValue) {
    let valueByOrganism = {};
    for(let key of Object.keys(organismsByValue).sort()){
        let value = organismsByValue[key];
        for(let organism of value){
            if(organism in valueByOrganism){
                valueByOrganism[organism] += '/' + key;
            } else {
                valueByOrganism[organism] = key;
            }
        }
    }
    return valueByOrganism;
}

function condenseNumericalTraitValues(multipleValuesPerOrganism) {
    let singleValue = {};
    for(let key of Object.keys(multipleValuesPerOrganism)){
        if(multipleValuesPerOrganism[key].length > 0){
            singleValue[key] = multipleValuesPerOrganism[key].reduce((acc, val) => Number(acc)+Number(val))/multipleValuesPerOrganism[key].length;
        }
    }
    return singleValue;
}