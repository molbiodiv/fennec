var interactiveBrowse_start  = d3.select("#interactiveBrowse_start");
var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

var circle = interactiveBrowse_start.append("circle")
        .attr("cx", 100)
        .attr("cy", 700)
        .attr("r", 10)
        .attr("id", "desert")
        .style("opacity", 1)
        .style("fill", "#A90C0C")
        .on("mouseover", function(){
            add_Tooltip(d3.select(this).attr("id"));
        })
        .on("mouseout", function(){
            remove_Tooltip();
        });
        
var circle = interactiveBrowse_start.append("circle")
        .attr("cx", 400)
        .attr("cy", 525)
        .attr("r", 10)
        .attr("id", "salt water")
        .style("opacity", 1)
        .style("fill", "#A90C0C")
        .on("mouseover", function(){
            add_Tooltip(d3.select(this).attr("id"));
        })
        .on("mouseout", function(){
            remove_Tooltip();
        });
        
var circle = interactiveBrowse_start.append("circle")
        .attr("cx", 800)
        .attr("cy", 470)
        .attr("r", 10)
        .attr("id", "fresh water")
        .style("opacity", 1)
        .style("fill", "#A90C0C")
        .on("mouseover", function(){
            add_Tooltip(d3.select(this).attr("id"));
        })
        .on("mouseout", function(){
            remove_Tooltip();
        });
        
var circle = interactiveBrowse_start_start.append("circle")
        .attr("cx", 700)
        .attr("cy", 380)
        .attr("r", 10)
        .attr("id", "forest")
        .style("opacity", 1)
        .style("fill", "#A90C0C")
        .on("mouseover", function(){
            add_Tooltip(d3.select(this).attr("id"));
        })
        .on("mouseout", function(){
            remove_Tooltip();
        })
        .on("click", function(){
            displayPage(d3.select(this).attr("id"));
        });
        
var circle = interactiveBrowse_start.append("circle")
        .attr("cx", 750)
        .attr("cy", 680)
        .attr("r", 10)
        .attr("id", "grassland")
        .style("opacity", 1)
        .style("fill", "#A90C0C")
        .on("mouseover", function(){
            add_Tooltip(d3.select(this).attr("id"));
        })
        .on("mouseout", function(){
            remove_Tooltip();
        });
        
var circle = interactiveBrowse_start.append("circle")
        .attr("cx", 900)
        .attr("cy", 90)
        .attr("r", 10)
        .attr("id", "mountain")
        .style("opacity", 1)
        .style("fill", "#A90C0C")
        .on("mouseover", function(){
            add_Tooltip(d3.select(this).attr("id"));
        })
        .on("mouseout", function(){
            remove_Tooltip();
        });
        
var circle = interactiveBrowse_start.append("circle")
        .attr("cx", 300)
        .attr("cy", 220)
        .attr("r", 10)
        .attr("id", "coast")
        .style("opacity", 1)
        .style("fill", "#A90C0C")
        .on("mouseover", function(){
            add_Tooltip(d3.select(this).attr("id"));
        })
        .on("mouseout", function(){
            remove_Tooltip();
        });
        
var circle = interactiveBrowse_start.append("circle")
        .attr("cx", 250)
        .attr("cy", 50)
        .attr("r", 10)
        .attr("id", "sky")
        .style("opacity", 1)
        .style("fill", "#A90C0C")
        .on("mouseover", function(){
            add_Tooltip(d3.select(this).attr("id"));
        })
        .on("mouseout", function(){
            remove_Tooltip();
        });
        
var circle = interactiveBrowse_start.append("circle")
        .attr("cx", 600)
        .attr("cy", 175)
        .attr("r", 10)
        .attr("id", "snow and ice region")
        .style("opacity", 1)
        .style("fill", "#A90C0C")
        .on("mouseover", function(){
            add_Tooltip(d3.select(this).attr("id"));
        })
        .on("mouseout", function(){
            remove_Tooltip();
        });
            
function add_Tooltip(text){
    div.transition()
        .duration(200)
        .style("opacity", .9)
        .text(text)
        .style("left", (d3.event.pageX) + "px")     
        .style("top", (d3.event.pageY - 28) + "px"); 
}

function remove_Tooltip(){
    div.transition()
        .duration(200)
        .style("opacity", 0);
}

function displayPage(name){
    var resultPage =  WebRoot+"/trait/search/"+name;
    window.location.href = resultPage;
}