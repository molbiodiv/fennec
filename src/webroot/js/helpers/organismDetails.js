/**
 * Selects the best vernacularName from the object returned by the eol pages API.
 * It only considers english names (language: en) and preferes those with eol_preferred: true.
 * The scientificName is used as fallback.
 * @param eolObject {Object} object returned by the eol pages API
 * @returns {String} bestName
 */
getBestVernacularNameEOL = function(eolObject){
    var bestName = "";
    if(typeof eolObject["scientificName"] !== "undefined"){
        bestName = eolObject["scientificName"];
    }
    if(typeof eolObject["vernacularNames"] !== "undefined" && eolObject["vernacularNames"].length > 0){
        var preferred = false;
        eolObject["vernacularNames"].forEach(function(value){
            if(value.language === "en"){
                if(typeof value["eol_preferred"] !== "undefined" && value["eol_preferred"]){
                    preferred = true;
                    bestName = value.vernacularName;
                }
                else if(!preferred){
                    bestName = value.vernacularName;
                }
            }
        });
    }
    return bestName;
};