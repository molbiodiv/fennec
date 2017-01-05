function condenseTraitValues(organismsByValue) {
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