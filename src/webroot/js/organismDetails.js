getBestName = function(result){
    var bestName = "";
    if(typeof result["scientificName"] !== "undefined"){
        bestName = result["scientificName"];
    }
    if(typeof result["vernacularNames"] !== "undefined" && result["vernacularNames"].length > 0){
        var preferred = false;
        result["vernacularNames"].forEach(function(value){
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
}