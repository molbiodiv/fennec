export class TraitEntryFilter {
    fullData
    filter = {
        provider: [],
        user: []
    }

    constructor(fullData) {
        this.fullData = fullData
    }

    filter(){
       let filteredData = this.fullData
        if(this.filter.provider.length > 0){
           filteredData = filteredData.filter()
        }
       return filteredData
    }

}