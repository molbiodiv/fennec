$(document).ready(function(){
    var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

    var interactiveBrowse_behaviour = d3.select("#interactiveBrowse_behaviour");

    var bloomPeriod = interactiveBrowse_behaviour.append("rect")
            .attr("x", 320)
            .attr("y", 400)
            .attr("width", 120)
            .attr("height", 80)
            .attr("id", "bloom period")
            .attr("type_cvterm_id", "438")
            .style("opacity", 0.01)
            .style("fill", "#fff")
            .style("cursor", "pointer")
            .on("click", function(){
                displayPage(d3.select(this).attr("type_cvterm_id"));
            });
            
    var lifeSpan = interactiveBrowse_behaviour.append("rect")
            .attr("x", 760)
            .attr("y", 600)
            .attr("width", 140)
            .attr("height", 60)
            .attr("id", "life span")
            .attr("type_cvterm_id", "472")
            .style("opacity", 0.01)
            .style("fill", "#fff")
            .style("cursor", "pointer")
            .on("click", function(){
                displayPage(d3.select(this).attr("type_cvterm_id"));
            });
            
    var growthRate = interactiveBrowse_behaviour.append("rect")
            .attr("x", 350)
            .attr("y", 600)
            .attr("width", 160)
            .attr("height", 40)
            .attr("id", "growth rate")
            .attr("type_cvterm_id", "450")
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
