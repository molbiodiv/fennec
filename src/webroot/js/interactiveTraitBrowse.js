var interactiveBrowse_habitat  = d3.select("#interactiveBrowse_habitat");
var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

//All interactive dots of habitat
var circle = interactiveBrowse_habitat.append("circle")
        .attr("cx", 100)
        .attr("cy", 700)
        .attr("r", 10)
        .attr("id", "sand, dune, desert")
        .style("opacity", 1)
        .style("fill", "#A90C0C")
        .on("mouseover", function(){
            add_Tooltip(d3.select(this).attr("id"));
        })
        .on("mouseout", function(){
            remove_Tooltip();
        });
        
var circle = interactiveBrowse_habitat.append("circle")
        .attr("cx", 400)
        .attr("cy", 525)
        .attr("r", 10)
        .attr("id", "marine habitat, brackish habitat")
        .style("opacity", 1)
        .style("fill", "#A90C0C")
        .on("mouseover", function(){
            add_Tooltip(d3.select(this).attr("id"));
        })
        .on("mouseout", function(){
            remove_Tooltip();
        });
        
var circle = interactiveBrowse_habitat.append("circle")
        .attr("cx", 800)
        .attr("cy", 470)
        .attr("r", 10)
        .attr("id", "freshwater habitat, lake habitat, river")
        .style("opacity", 1)
        .style("fill", "#A90C0C")
        .on("mouseover", function(){
            add_Tooltip(d3.select(this).attr("id"));
        })
        .on("mouseout", function(){
            remove_Tooltip();
        });
        
var circle = interactiveBrowse_habitat.append("circle")
        .attr("cx", 700)
        .attr("cy", 380)
        .attr("r", 10)
        .attr("id", "woodland")
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
        
var circle = interactiveBrowse_habitat.append("circle")
        .attr("cx", 750)
        .attr("cy", 680)
        .attr("r", 10)
        .attr("id", "grassland, meadow, prairie, savanna")
        .style("opacity", 1)
        .style("fill", "#A90C0C")
        .on("mouseover", function(){
            add_Tooltip(d3.select(this).attr("id"));
        })
        .on("mouseout", function(){
            remove_Tooltip();
        });
        
var circle = interactiveBrowse_habitat.append("circle")
        .attr("cx", 900)
        .attr("cy", 90)
        .attr("r", 10)
        .attr("id", "mountain, peak")
        .style("opacity", 1)
        .style("fill", "#A90C0C")
        .on("mouseover", function(){
            add_Tooltip(d3.select(this).attr("id"));
        })
        .on("mouseout", function(){
            remove_Tooltip();
        });
        
var circle = interactiveBrowse_habitat.append("circle")
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
        
var circle = interactiveBrowse_habitat.append("circle")
        .attr("cx", 600)
        .attr("cy", 175)
        .attr("r", 10)
        .attr("id", "plain, plateau")
        .style("opacity", 1)
        .style("fill", "#A90C0C")
        .on("mouseover", function(){
            add_Tooltip(d3.select(this).attr("id"));
        })
        .on("mouseout", function(){
            remove_Tooltip();
        });
        
var circle = interactiveBrowse_habitat.append("circle")
        .attr("cx", 200)
        .attr("cy", 125)
        .attr("r", 10)
        .attr("text", "geographical zone")
        .attr("type", "link")
        .attr("id", "zone")
        .style("opacity", 1)
        .style("fill", function(){
            return "#A90C0C";
        })
        .on("mouseover", function(){
            add_Tooltip(d3.select(this).attr("text"));
        })
        .on("mouseout", function(){
            remove_Tooltip();
        })
        .on("click", function(){
            displayPage(d3.select(this).attr("id"));
        });
        
var interactiveBrowse_woodland = d3.select("#interactiveBrowse_woodland");

var circle = interactiveBrowse_woodland.append("circle")
        .attr("cx", 850)
        .attr("cy", 470)
        .attr("r", 10)
        .attr("id", "plant")
        .attr("text", "physical description of plants")
        .style("opacity", 1)
        .style("fill", "#1c25da")
        .on("mouseover", function(){
            add_Tooltip(d3.select(this).attr("text"));
        })
        .on("mouseout", function(){
            remove_Tooltip();
        })
        .on("click", function(){
            displayPage(d3.select(this).attr("id"));
        });
        
var circle = interactiveBrowse_woodland.append("circle")
        .attr("cx", 560)
        .attr("cy", 700)
        .attr("r", 10)
        .attr("id", "mushroom cap shape, stipe")
        .style("opacity", 1)
        .style("fill", "#1c25da")
        .on("mouseover", function(){
            add_Tooltip(d3.select(this).attr("id"));
        })
        .on("mouseout", function(){
            remove_Tooltip();
        });
        
var circle = interactiveBrowse_woodland.append("circle")
        .attr("cx", 920)
        .attr("cy", 150)
        .attr("r", 10)
        .attr("id", "temperature tolerance")
        .style("opacity", 1)
        .style("fill", "#1c25da")
        .on("mouseover", function(){
            add_Tooltip(d3.select(this).attr("id"));
        })
        .on("mouseout", function(){
            remove_Tooltip();
        });
        
var circle = interactiveBrowse_woodland.append("circle")
        .attr("cx", 200)
        .attr("cy", 650)
        .attr("r", 10)
        .attr("id", "shade tolerance")
        .style("opacity", 1)
        .style("fill", "#1c25da")
        .on("mouseover", function(){
            add_Tooltip(d3.select(this).attr("id"));
        })
        .on("mouseout", function(){
            remove_Tooltip();
        });
        
var circle = interactiveBrowse_woodland.append("circle")
        .attr("cx", 800)
        .attr("cy", 600)
        .attr("r", 10)
        .attr("id", "behavior")
        .style("opacity", 1)
        .style("fill", "#1c25da")
        .on("mouseover", function(){
            add_Tooltip(d3.select(this).attr("id"));
        })
        .on("mouseout", function(){
            remove_Tooltip();
        });
        
var circle = interactiveBrowse_woodland.append("circle")
        .attr("cx", 220)
        .attr("cy", 300)
        .attr("r", 10)
        .attr("id", "wood density")
        .style("opacity", 1)
        .style("fill", "#1c25da")
        .on("mouseover", function(){
            add_Tooltip(d3.select(this).attr("id"));
        })
        .on("mouseout", function(){
            remove_Tooltip();
        });
        
var interactiveBrowse_geographicalZone = d3.select("#interactiveBrowse_geographicalZone");

var circle = interactiveBrowse_geographicalZone.append("circle")
        .attr("cx", 500)
        .attr("cy", 20)
        .attr("r", 10)
        .attr("id", "polar")
        .style("opacity", 1)
        .style("fill", "#fff")
        .on("mouseover", function(){
            add_Tooltip(d3.select(this).attr("id"));
        })
        .on("mouseout", function(){
            remove_Tooltip();
        });
        
var interactiveBrowse_plant = d3.select("#interactiveBrowse_plant");

var circle = interactiveBrowse_plant.append("circle")
        .attr("cx", 330)
        .attr("cy", 350)
        .attr("r", 10)
        .attr("id", "fruit type")
        .style("opacity", 1)
        .style("fill", "#052cff")
        .on("mouseover", function(){
            add_Tooltip(d3.select(this).attr("id"));
        })
        .on("mouseout", function(){
            remove_Tooltip();
        });
        
var circle = interactiveBrowse_plant.append("circle")
        .attr("cx", 500)
        .attr("cy", 420)
        .attr("r", 10)
        .attr("id", "fruit/seed color")
        .style("opacity", 1)
        .style("fill", "#052cff")
        .on("mouseover", function(){
            add_Tooltip(d3.select(this).attr("id"));
        })
        .on("mouseout", function(){
            remove_Tooltip();
        });
        
var circle = interactiveBrowse_plant.append("circle")
        .attr("cx", 850)
        .attr("cy", 160)
        .attr("r", 10)
        .attr("id", "leaf color")
        .style("opacity", 1)
        .style("fill", "#052cff")
        .on("mouseover", function(){
            add_Tooltip(d3.select(this).attr("id"));
        })
        .on("mouseout", function(){
            remove_Tooltip();
        });
        
var circle = interactiveBrowse_plant.append("circle")
        .attr("cx", 820)
        .attr("cy", 200)
        .attr("r", 10)
        .attr("id", "leaf shape")
        .style("opacity", 1)
        .style("fill", "#052cff")
        .on("mouseover", function(){
            add_Tooltip(d3.select(this).attr("id"));
        })
        .on("mouseout", function(){
            remove_Tooltip();
        });
        
var circle = interactiveBrowse_plant.append("circle")
        .attr("cx", 860)
        .attr("cy", 190)
        .attr("r", 10)
        .attr("id", "leaf area")
        .style("opacity", 1)
        .style("fill", "#052cff")
        .on("mouseover", function(){
            add_Tooltip(d3.select(this).attr("id"));
        })
        .on("mouseout", function(){
            remove_Tooltip();
        });
        
var circle = interactiveBrowse_plant.append("circle")
        .attr("cx", 100)
        .attr("cy", 720)
        .attr("r", 10)
        .attr("id", "rooting depth")
        .style("opacity", 1)
        .style("fill", "#052cff")
        .on("mouseover", function(){
            add_Tooltip(d3.select(this).attr("id"));
        })
        .on("mouseout", function(){
            remove_Tooltip();
        });
        
var circle = interactiveBrowse_plant.append("circle")
        .attr("cx", 380)
        .attr("cy", 30)
        .attr("r", 10)
        .attr("id", "plant height")
        .style("opacity", 1)
        .style("fill", "#052cff")
        .on("mouseover", function(){
            add_Tooltip(d3.select(this).attr("id"));
        })
        .on("mouseout", function(){
            remove_Tooltip();
        });
        
var circle = interactiveBrowse_plant.append("circle")
        .attr("cx", 880)
        .attr("cy", 450)
        .attr("r", 10)
        .attr("id", "flower color")
        .style("opacity", 1)
        .style("fill", "#052cff")
        .on("mouseover", function(){
            add_Tooltip(d3.select(this).attr("id"));
        })
        .on("mouseout", function(){
            remove_Tooltip();
        });
        
var circle = interactiveBrowse_plant.append("circle")
        .attr("cx", 870)
        .attr("cy", 620)
        .attr("r", 10)
        .attr("id", "plant growth habit")
        .style("opacity", 1)
        .style("fill", "#052cff")
        .on("mouseover", function(){
            add_Tooltip(d3.select(this).attr("id"));
        })
        .on("mouseout", function(){
            remove_Tooltip();
        });
            
function add_Tooltip(text){
    div.transition()
        .duration(10)
        .style("opacity", .9)
        .text(text)
        .style("left", (d3.event.pageX) + "px")     
        .style("top", (d3.event.pageY - 28) + "px"); 
}

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

function remove_Tooltip(){
    div.transition()
        .duration(10)
        .style("opacity", 0);
}

function displayPage(name){
    var resultPage =  WebRoot+"/trait/search/"+name;
    window.location.href = resultPage;
}
