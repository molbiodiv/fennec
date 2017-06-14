"use strict";

/*
 * global $
 * global dbversion
 */

$(document).ready(function () {
    //autocomplete for trait search
    $("#search_trait").autocomplete({
        position: {
            my: "right top", at: "right bottom"
        },
        source: function source(request, response) {
            var search = request.term;
            $.ajax({
                url: Routing.generate('api', { 'namespace': 'listing', 'classname': 'traits' }),
                data: { term: request.term, limit: 500, search: search, dbversion: dbversion },
                dataType: "json",
                success: function success(data) {
                    response(data.map(function (x) {
                        x.value = x.name;return x;
                    }));
                }
            });
        },
        minLength: 3
    });

    $("#search_trait").data("ui-autocomplete")._renderItem = function (ul, item) {
        var details = Routing.generate('trait_details', { 'dbversion': dbversion, 'trait_type_id': item.trait_type_id });
        var link = "<a href='" + details + "'><span style='display:inline-block; width: 100%; font-style: italic;'>" + item.name + "</span></a>";
        var li = $("<li>").append(link).appendTo(ul);
        return li;
    };

    $("#btn_search_trait").click(function () {
        var searchTerm = $("#search_trait").val();
        var resultPage = Routing.generate('trait_result', { 'dbversion': dbversion, 'limit': 500, 'search': searchTerm });
        window.location.href = resultPage;
    });

    $("#search_trait").keyup(function (event) {
        if (event.keyCode == 13) {
            $("#btn_search_trait").click();
        }
    });

    $(document).ready(function () {
        $('#search_trait').on('autocompletechange change', function () {
            console.log("bla");
            $('#search_trait').val(this.value);
        }).change();
    });
});