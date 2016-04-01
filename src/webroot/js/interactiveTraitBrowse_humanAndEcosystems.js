$(document).ready(function(){
    var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

    var interactiveBrowse_humanAndEcosystems = d3.select("#interactiveBrowse_humanAndEcosystems");

    var toxicity = interactiveBrowse_humanAndEcosystems.append("rect")
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
            
    var plantPropMethod = interactiveBrowse_humanAndEcosystems.append("rect")
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

    function displayPage(traitId){
        var resultPage =  WebRoot+"/trait/details/byId/"+traitId;
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
