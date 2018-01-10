/*
 * global $
 * global dbversion
 */

$(document).ready(function(){
    //autocomplete for trait search
    $("#search_trait").autocomplete({
        position: {
            my: "right top", at: "right bottom"
        },
        source: function (request, response) {
            var search = request.term;
            $.ajax({
                url: Routing.generate('api_listing_traits', {'dbversion': dbversion, 'limit': 500, 'search': search}),
                dataType: "json",
                success: function (data) {
                    response(data.map(x => {x.value = x.type; return x;}));
                }
            });
        },
        minLength: 3
    });

    $("#search_trait").data("ui-autocomplete")._renderItem = function (ul, item) {
        var details = Routing.generate('trait_details', {'dbversion': dbversion, 'trait_type_id': item.traitTypeId});
        var link = "<a href='"+details+"'><span style='display:inline-block; width: 100%; font-style: italic;'>" + item.value + "</span></a>";
        var li = $("<li>")
                .append(link)
                .appendTo(ul);
        return li;
    };

    $("#btn_search_trait").click(function(){
        var searchTerm = $("#search_trait").val();
        var resultPage = Routing.generate('trait_result', {'dbversion': dbversion, 'limit': 500, 'search': searchTerm});
        window.location.href = resultPage;
    });

    $("#search_trait").keyup(function(event){
        if(event.keyCode == 13){
            $("#btn_search_trait").click();
        }
    });
});