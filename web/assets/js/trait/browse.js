"use strict";

$('document').ready(function () {
    var interactiveBrowse_overview = d3.select("#interactiveBrowse_overview");

    // ecology
    interactiveBrowse_overview.append("rect").attr("x", 680).attr("y", 90).attr("width", 600).attr("height", 200).attr("id", "ecology").attr("text", "Search for traits related to ecology").style("opacity", 0.01).style("fill", "#fff").style("cursor", "pointer")
    //        .on("mouseover", function(){
    //            add_Tooltip(d3.select(this).attr("text"));
    //        })
    .on("mouseout", function () {
        remove_Tooltip();
    }).on("click", function () {
        displayPage(d3.select(this).attr("id"));
    });

    // humanEco
    interactiveBrowse_overview.append("rect").attr("x", 500).attr("y", 430).attr("width", 600).attr("height", 280).attr("id", "humanAndEcosystems").attr("text", "Search for traits related to the relevance to humans and ecosystems").style("opacity", 0.01).style("fill", "#fff").style("cursor", "pointer")
    //        .on("mouseover", function(){
    //            add_Tooltip(d3.select(this).attr("text"));
    //        })
    .on("mouseout", function () {
        remove_Tooltip();
    }).on("click", function () {
        displayPage(d3.select(this).attr("id"));
    });

    // behaviour
    interactiveBrowse_overview.append("rect").attr("x", 350).attr("y", 30).attr("width", 300).attr("height", 250).attr("id", "behaviour").attr("text", "Search for traits related to the relevance to behaviour and life history").style("opacity", 0.01).style("fill", "#fff").style("cursor", "pointer")
    //        .on("mouseover", function(){
    //            add_Tooltip(d3.select(this).attr("text"));
    //        })
    .on("mouseout", function () {
        remove_Tooltip();
    }).on("click", function () {
        displayPage(d3.select(this).attr("id"));
    });
});

function remove_Tooltip() {
    d3.select("traitBrowseTooltip").transition().duration(10).style("opacity", 0);
}

function displayPage(name) {
    var resultPage = Routing.generate('trait_browse', { 'dbversion': '1.0', 'search_level': name });
    window.location.href = resultPage;
}
"use strict";

$(document).ready(function () {
    d3.select("body").append("div").attr("class", "tooltip").attr("id", "traitBrowseTooltip").style("opacity", 0);

    var interactiveBrowse_behaviour = d3.select("#interactiveBrowse_behaviour");

    // bloomPeriod
    interactiveBrowse_behaviour.append("rect").attr("x", 320).attr("y", 400).attr("width", 120).attr("height", 80).attr("id", "bloom period").attr("type_cvterm_id", "438").style("opacity", 0.01).style("fill", "#fff").style("cursor", "pointer").on("click", function () {
        displayPage(d3.select(this).attr("type_cvterm_id"));
    });

    // lifeSpan
    interactiveBrowse_behaviour.append("rect").attr("x", 760).attr("y", 600).attr("width", 140).attr("height", 60).attr("id", "life span").attr("type_cvterm_id", "472").style("opacity", 0.01).style("fill", "#fff").style("cursor", "pointer").on("click", function () {
        displayPage(d3.select(this).attr("type_cvterm_id"));
    });

    // growthRate
    interactiveBrowse_behaviour.append("rect").attr("x", 350).attr("y", 600).attr("width", 160).attr("height", 40).attr("id", "growth rate").attr("type_cvterm_id", "450").style("opacity", 0.01).style("fill", "#fff").style("cursor", "pointer").on("click", function () {
        displayPage(d3.select(this).attr("type_cvterm_id"));
    });

    function displayPage(traitId) {
        var resultPage = WebRoot + "/" + DbVersion + "/trait/details/byId/" + traitId;
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
"use strict";

$(document).ready(function () {
    d3.select("body").append("div").attr("class", "tooltip").attr("id", "traitBrowseTooltip").style("opacity", 0);

    var interactiveBrowse_ecology = d3.select("#interactiveBrowse_ecology");

    // habitat
    interactiveBrowse_ecology.append("rect").attr("x", 370).attr("y", 260).attr("width", 120).attr("height", 50).attr("id", "habitat").attr("type_cvterm_id", "27").style("opacity", 0.01).style("fill", "#fff").style("cursor", "pointer").on("click", function () {
        displayPage(d3.select(this).attr("type_cvterm_id"));
    });

    // shadeTolerance
    interactiveBrowse_ecology.append("rect").attr("x", 860).attr("y", 660).attr("width", 120).attr("height", 50).attr("id", "shade tolerance").attr("type_cvterm_id", "504").style("opacity", 0.01).style("fill", "#fff").style("cursor", "pointer").on("click", function () {
        displayPage(d3.select(this).attr("type_cvterm_id"));
    });

    // elevation
    interactiveBrowse_ecology.append("rect").attr("x", 450).attr("y", 10).attr("width", 120).attr("height", 50).attr("id", "elevation").attr("type_cvterm_id", "102").style("opacity", 0.01).style("fill", "#fff").style("cursor", "pointer").on("click", function () {
        displayPage(d3.select(this).attr("type_cvterm_id"));
    });

    // waterDepth
    interactiveBrowse_ecology.append("rect").attr("x", 260).attr("y", 380).attr("width", 170).attr("height", 40).attr("id", "water depth").attr("type_cvterm_id", "17").style("opacity", 0.01).style("fill", "#fff").style("cursor", "pointer").on("click", function () {
        displayPage(d3.select(this).attr("type_cvterm_id"));
    });

    // lowTmpTolerance
    interactiveBrowse_ecology.append("rect").attr("x", 30).attr("y", 50).attr("width", 200).attr("height", 80).attr("id", "low temperature tolerance").attr("type_cvterm_id", "436").style("opacity", 0.01).style("fill", "#fff").style("cursor", "pointer").on("click", function () {
        displayPage(d3.select(this).attr("type_cvterm_id"));
    });

    // calcTolerance
    interactiveBrowse_ecology.append("rect").attr("x", 680).attr("y", 80).attr("width", 180).attr("height", 70).attr("id", "calcareous soil tolerance").attr("type_cvterm_id", "492").style("opacity", 0.01).style("fill", "#fff").style("cursor", "pointer").on("click", function () {
        displayPage(d3.select(this).attr("type_cvterm_id"));
    });

    // soilDepth
    interactiveBrowse_ecology.append("rect").attr("x", 450).attr("y", 615).attr("width", 150).attr("height", 50).attr("id", "soil depth").attr("type_cvterm_id", "435").style("opacity", 0.01).style("fill", "#fff").style("cursor", "pointer").on("click", function () {
        displayPage(d3.select(this).attr("type_cvterm_id"));
    });

    function displayPage(traitId) {
        var resultPage = WebRoot + "/" + DbVersion + "/trait/details/byId/" + traitId;
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
"use strict";

$(document).ready(function () {
    d3.select("body").append("div").attr("class", "tooltip").attr("id", "traitBrowseTooltip").style("opacity", 0);

    var interactiveBrowse_humanAndEcosystems = d3.select("#interactiveBrowse_humanAndEcosystems");

    // toxicity
    interactiveBrowse_humanAndEcosystems.append("rect").attr("x", 590).attr("y", 180).attr("width", 220).attr("height", 70).attr("id", "human/livestock toxicity").attr("type_cvterm_id", "480").style("opacity", 0.01).style("fill", "#fff").style("cursor", "pointer").on("click", function () {
        displayPage(d3.select(this).attr("type_cvterm_id"));
    });

    // plantPropMethod
    interactiveBrowse_humanAndEcosystems.append("rect").attr("x", 200).attr("y", 650).attr("width", 220).attr("height", 70).attr("id", "plant propagation method").attr("type_cvterm_id", "515").style("opacity", 0.01).style("fill", "#fff").style("cursor", "pointer").on("click", function () {
        displayPage(d3.select(this).attr("type_cvterm_id"));
    });

    // horticulture
    interactiveBrowse_humanAndEcosystems.append("rect").attr("x", 150).attr("y", 400).attr("width", 180).attr("height", 50).attr("id", "horticulture").attr("type_cvterm_id", "458").style("opacity", 0.01).style("fill", "#fff").style("cursor", "pointer").on("click", function () {
        displayPage(d3.select(this).attr("type_cvterm_id"));
    });

    // commercialAvailability
    interactiveBrowse_humanAndEcosystems.append("rect").attr("x", 250).attr("y", 60).attr("width", 180).attr("height", 70).attr("id", "commercial availability").attr("type_cvterm_id", "505").style("opacity", 0.01).style("fill", "#fff").style("cursor", "pointer").on("click", function () {
        displayPage(d3.select(this).attr("type_cvterm_id"));
    });

    // grazeAnimal
    interactiveBrowse_humanAndEcosystems.append("rect").attr("x", 820).attr("y", 540).attr("width", 160).attr("height", 80).attr("id", "graze animal palatability").attr("type_cvterm_id", "1263").style("opacity", 0.01).style("fill", "#fff").style("cursor", "pointer").on("click", function () {
        displayPage(d3.select(this).attr("type_cvterm_id"));
    });

    // grainType
    interactiveBrowse_humanAndEcosystems.append("rect").attr("x", 540).attr("y", 300).attr("width", 80).attr("height", 60).attr("id", "graze animal palatability").attr("type_cvterm_id", "528").style("opacity", 0.01).style("fill", "#fff").style("cursor", "pointer").on("click", function () {
        displayPage(d3.select(this).attr("type_cvterm_id"));
    });

    function displayPage(traitId) {
        var resultPage = WebRoot + "/" + DbVersion + "/trait/details/byId/" + traitId;
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