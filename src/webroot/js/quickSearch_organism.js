$(document).ready(function(){
    
    //autocomplete for organism search
     $("#search_organism").autocomplete({
        position: {
           my: "right top", at: "right bottom"
        },
        source: function (request, response) {
            var search = request.term;
            $.ajax({
                url: WebRoot.concat("/ajax/listing/Organisms"),
                data: {term:  request.term, limit: 500, search: search, dbversion: DbVersion},
                dataType: "json",
                success: function (data) {
                    response(data);
                }
            });
        },
        minLength: 3
    });

    $("#search_organism").data("ui-autocomplete")._renderItem = function (ul, item) {
        var li = $("<li>")
                .append("<a href='"+WebRoot+"/"+DbVersion+"/organism/details/byId/"+item.organism_id+"'><span style='display:inline-block; width: 100%; font-style: italic;'>" + item.scientific_name + "</span><span style='color: #338C8C'>" + item.rank + "</span></a>")
                .appendTo(ul);
        return li;
    };

    $("#btn_search_organism").click(function(){
        var searchTerm = $("#search_organism").val();
        var resultPage =  WebRoot+"/"+DbVersion+"/organism/results/"+searchTerm;
        window.location.href = resultPage;
    });
});

