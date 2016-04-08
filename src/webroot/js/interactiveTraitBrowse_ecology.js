$(document).ready(function(){
    var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

    var interactiveBrowse_ecology = d3.select("#interactiveBrowse_ecology");

    var habitat = interactiveBrowse_ecology.append("rect")
            .attr("x", 370)
            .attr("y", 260)
            .attr("width", 120)
            .attr("height", 50)
            .attr("id", "habitat")
            .attr("type_cvterm_id", "27")
            .style("opacity", 0.01)
            .style("fill", "#fff")
            .style("cursor", "pointer")
            .on("click", function(){
                displayPage(d3.select(this).attr("type_cvterm_id"));
            });
            
    var shadeTolerance = interactiveBrowse_ecology.append("rect")
            .attr("x", 860)
            .attr("y", 660)
            .attr("width", 120)
            .attr("height", 50)
            .attr("id", "shade tolerance")
            .attr("type_cvterm_id", "504")
            .style("opacity", 0.01)
            .style("fill", "#fff")
            .style("cursor", "pointer")
            .on("click", function(){
                displayPage(d3.select(this).attr("type_cvterm_id"));
            });
            
    var elevation = interactiveBrowse_ecology.append("rect")
            .attr("x", 450)
            .attr("y", 10)
            .attr("width", 120)
            .attr("height", 50)
            .attr("id", "elevation")
            .attr("type_cvterm_id", "102")
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
