var interactiveBrowse_overview = d3.select("#interactiveBrowse_overview");

var ecology = interactiveBrowse_overview.append("rect")
        .attr("x", 680)
        .attr("y", 90)
        .attr("width", 600)
        .attr("height", 200)
        .attr("id", "ecology")
        .attr("text", "Search for traits related to ecology")
        .style("opacity", 0.01)
        .style("fill", "#fff")
        .style("cursor", "pointer")
//        .on("mouseover", function(){
//            add_Tooltip(d3.select(this).attr("text"));
//        })
        .on("mouseout", function(){
            remove_Tooltip();
        })
        .on("click", function(){
            displayPage(d3.select(this).attr("id"));
        });
        
var humanEco = interactiveBrowse_overview.append("rect")
        .attr("x", 500)
        .attr("y", 430)
        .attr("width", 600)
        .attr("height", 280)
        .attr("id", "humanAndEcosystems")
        .attr("text", "Search for traits related to the relevance to humans and ecosystems")
        .style("opacity", 0.01)
        .style("fill", "#fff")
        .style("cursor", "pointer")
//        .on("mouseover", function(){
//            add_Tooltip(d3.select(this).attr("text"));
//        })
        .on("mouseout", function(){
            remove_Tooltip();
        })
        .on("click", function(){
            displayPage(d3.select(this).attr("id"));
        });
        
var behaviour = interactiveBrowse_overview.append("rect")
        .attr("x", 350)
        .attr("y", 30)
        .attr("width", 300)
        .attr("height", 250)
        .attr("id", "behaviour")
        .attr("text", "Search for traits related to the relevance to behaviour and life history")
        .style("opacity", 0.01)
        .style("fill", "#fff")
        .style("cursor", "pointer")
//        .on("mouseover", function(){
//            add_Tooltip(d3.select(this).attr("text"));
//        })
        .on("mouseout", function(){
            remove_Tooltip();
        })
        .on("click", function(){
            displayPage(d3.select(this).attr("id"));
        });

function remove_Tooltip(){
    div.transition()
        .duration(10)
        .style("opacity", 0);
}

function displayPage(name){
    var resultPage =  WebRoot+"/"+DbVersion+"/trait/search/"+name;
    window.location.href = resultPage;
}
