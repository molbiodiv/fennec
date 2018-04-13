export class TraitEntryFilter {
    fullData
    _filter

    constructor(fullData) {
        this.fullData = fullData
        this.filter = {
            providerBlacklist: [],
            userBlacklist: []
        }
    }

    get filter(){
        return this._filter
    }

    set filter(filter){
        this._filter = filter
    }

    applyFilter(){
        let filteredData = this.fullData
        if(this.filter.providerBlacklist.length > 0){
            filteredData = filteredData.map(traitType => {
                return {
                    traitType: traitType.traitType,
                    entries: traitType.entries.filter(e => !this.filter.providerBlacklist.includes(e.provider))
                }
            })
        }
        if(this.filter.userBlacklist.length > 0  && !this.filter.providerBlacklist.includes('userImport')){
            filteredData = filteredData.map(traitType => {
                return {
                    traitType: traitType.traitType,
                    entries: traitType.entries.filter(e => !this.filter.userBlacklist.includes(e.user))
                }
            })
        }
        filteredData = filteredData.filter(x => x.entries.length > 0)
        return filteredData
    }
}

// export globally
window.TraitEntryFilter = TraitEntryFilter;
