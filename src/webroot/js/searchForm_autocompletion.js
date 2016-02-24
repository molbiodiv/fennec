//autocomplete for organism search
 $("#search_organism").autocomplete({
    position: {
       my: "right top", at: "right bottom"
    },
    source: function (request, response) {
        var $search = request.term;
        $.ajax({
            url: $servicePath.concat("/ajax/listing/Organisms"),
            data: {term:  request.term, limit: 500, search: $search},
            dataType: "json",
            success: function (data) {
                response(data);
            }
        });
    },
    minLength: 4
});

$("#search_organism").data("ui-autocomplete")._renderItem = function (ul, item) {
    var li = $("<li>")
            .append("<a href='"+$servicePath+"/organismDetail' class='fancybox' data-fancybox-type='iframe'><span style='display:inline-block; width: 100%; font-style: italic;'>" + item.scientific_name + "</span><span style='color: #338C8C'>" + item.rank + "</span></a>")
            .appendTo(ul);
    return li;
};

