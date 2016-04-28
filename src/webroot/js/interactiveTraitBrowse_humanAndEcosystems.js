$(document).ready(function(){
    d3.select("body").append("div")
            .attr("class", "tooltip")
            .attr("id", "traitBrowseTooltip")
            .style("opacity", 0);

    var interactiveBrowse_humanAndEcosystems = d3.select("#interactiveBrowse_humanAndEcosystems");

    // toxicity
    interactiveBrowse_humanAndEcosystems.append("rect")
            .attr("x", 590)
            .attr("y", 180)
            .attr("width", 220)
            .attr("height", 70)
            .attr("id", "human/livestock toxicity")
            .attr("type_cvterm_id", "480")
            .style("opacity", 0.01)
            .style("fill", "#fff")
            .style("cursor", "pointer")
            .on("click", function(){
                displayPage(d3.select(this).attr("type_cvterm_id"));
            });
            
    // plantPropMethod
    interactiveBrowse_humanAndEcosystems.append("rect")
            .attr("x", 200)
            .attr("y", 650)
            .attr("width", 220)
            .attr("height", 70)
            .attr("id", "plant propagation method")
            .attr("type_cvterm_id", "515")
            .style("opacity", 0.01)
            .style("fill", "#fff")
            .style("cursor", "pointer")
            .on("click", function(){
                displayPage(d3.select(this).attr("type_cvterm_id"));
            });
            
    // horticulture
    interactiveBrowse_humanAndEcosystems.append("rect")
            .attr("x", 150)
            .attr("y", 400)
            .attr("width", 180)
            .attr("height", 50)
            .attr("id", "horticulture")
            .attr("type_cvterm_id", "458")
            .style("opacity", 0.01)
            .style("fill", "#fff")
            .style("cursor", "pointer")
            .on("click", function(){
                displayPage(d3.select(this).attr("type_cvterm_id"));
            });
            
    // commercialAvailability
    interactiveBrowse_humanAndEcosystems.append("rect")
            .attr("x", 250)
            .attr("y", 60)
            .attr("width", 180)
            .attr("height", 70)
            .attr("id", "commercial availability")
            .attr("type_cvterm_id", "505")
            .style("opacity", 0.01)
            .style("fill", "#fff")
            .style("cursor", "pointer")
            .on("click", function(){
                displayPage(d3.select(this).attr("type_cvterm_id"));
            });
            
    // grazeAnimal
    interactiveBrowse_humanAndEcosystems.append("rect")
            .attr("x", 820)
            .attr("y", 540)
            .attr("width", 160)
            .attr("height", 80)
            .attr("id", "graze animal palatability")
            .attr("type_cvterm_id", "1263")
            .style("opacity", 0.01)
            .style("fill", "#fff")
            .style("cursor", "pointer")
            .on("click", function(){
                displayPage(d3.select(this).attr("type_cvterm_id"));
            });
            
    // grainType
    interactiveBrowse_humanAndEcosystems.append("rect")
            .attr("x", 540)
            .attr("y", 300)
            .attr("width", 80)
            .attr("height", 60)
            .attr("id", "graze animal palatability")
            .attr("type_cvterm_id", "528")
            .style("opacity", 0.01)
            .style("fill", "#fff")
            .style("cursor", "pointer")
            .on("click", function(){
                displayPage(d3.select(this).attr("type_cvterm_id"));
            });

    function displayPage(traitId){
        var resultPage =  WebRoot+"/"+DbVersion+"/trait/details/byId/"+traitId;
        $.fancybox.open({
           type: 'iframe',
           href: resultPage,
           minWidth: 1000,
            maxWidth: 1000,
            maxHeight: 800,
            minHeight: 800
        });
    }
});
