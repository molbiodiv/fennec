$(document).ready(function(){
    //autocomplete for organism search
    $("#search_organism").autocomplete({
        position: {
            my: "right top", at: "right bottom"
        },
        source: function (request, response) {
            var search = request.term;
            $.ajax({
                url: Routing.generate('api_listing_organisms', {'dbversion': dbversion}),
                data: {limit: 500, search: search},
                dataType: "json",
                success: function (data) {
                    response(data.map(x => {x.value = x.scientificName; return x;}));
                }
            });
        },
        minLength: 3
    });

    $("#search_organism").data("ui-autocomplete")._renderItem = function (ul, item) {
            var details = Routing.generate('organism_details', {'dbversion': dbversion, 'fennec_id': item.fennec_id});
            var link = "<a href='"+details+"'><span style='display:inline-block; width: 100%; font-style: italic;'>" + item.scientificName + "</span></a>";
        var li = $("<li>")
                .append(link)
                .appendTo(ul);
        return li;
    };

    $("#btn_search_organism").click(function(){
        var searchTerm = $("#search_organism").val();
        var resultPage = Routing.generate('organism_result', {'dbversion': dbversion, 'limit': 500, 'search': searchTerm});
        window.location.href = resultPage;
    });

    $("#search_organism").keyup(function(event){
        if(event.keyCode == 13){
            $("#btn_search_organism").click();
        }
    });
});