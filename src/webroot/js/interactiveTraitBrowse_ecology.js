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
            .style("opacity", 0.01)
            .style("fill", "#fff")
            .style("cursor", "pointer")
            .on("click", function(){
                displayPage(d3.select(this).attr("id"));
            });

    function displayPage(traitId){
        var resultPage =  WebRoot+"/trait/details/byId"+traitId;
        window.location.href = resultPage;
    }
});
