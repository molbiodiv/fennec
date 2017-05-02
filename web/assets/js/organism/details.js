'use strict';

/**
 * Created by s216121 on 14.03.17.
 */

function appendTraitEntries(domElement, traitEntries, traitFormat) {
    $.ajax({
        url: Routing.generate('api', { 'namespace': 'details', 'classname': 'TraitEntries' }),
        data: {
            "dbversion": dbversion,
            "trait_entry_ids": traitEntries,
            "trait_format": traitFormat
        },
        method: "GET",
        success: function success(result) {
            $.each(result, function (key, value) {
                var realValue = value.value;
                if (value.value === null) {
                    realValue = value.value_definition;
                }
                if (value.unit != null) {
                    domElement.append($('<div>').text(realValue + " $" + value.unit + "$").append($('<div class="trait-citation">').text(value.citation).css({ 'font-size': '11px' })));
                } else {
                    domElement.append($('<div>').text(realValue).append($('<div class="trait-citation">').text(value.citation).css({ 'font-size': '11px' })));
                }
            });
        }
    });
}
'use strict';

/**
 * Created by s216121 on 14.03.17.
 */
$('document').ready(function () {
    var img_template = '<a class="thumbnail" href="<%= href %>"><img src="<%= src %>"/></a><a href="<%= source %>"><div>(c) <%= rightsHolder %> <%= license %></div></a>';
    $.ajax({
        method: "GET",
        url: "http://eol.org/api/pages/1.0.json",
        data: {
            id: eol_id,
            batch: false,
            images_per_page: 3,
            images_page: 1,
            videos_per_page: 0,
            videos_page: 1,
            sounds_per_page: 0,
            sounds_page: 1,
            maps_per_page: 0,
            maps_page: 1,
            texts_per_page: 3,
            texts_page: 1,
            iucn: true,
            subjects: "overview",
            licenses: "cc-by|cc-by-nc|cc-by-sa|cc-by-nc-sa|pd",
            details: true,
            common_names: true,
            synonyms: true,
            references: true,
            taxonomy: true,
            vetted: 0,
            cache_ttl: 60,
            language: "en"
        },
        success: function success(result) {
            console.log(result);
            var txtCounter = 1;
            $.each(result["dataObjects"], function (dob) {
                if (result["dataObjects"][dob]["dataType"] === "http://purl.org/dc/dcmitype/StillImage") {
                    var url = result["dataObjects"][dob]["eolMediaURL"];
                    var license = result["dataObjects"][dob]["license"];
                    var rightsHolder = result["dataObjects"][dob]["rightsHolder"];
                    var source = result["dataObjects"][dob]["source"];
                    var img_element = _.template(img_template)({ src: url, href: url, license: license, rightsHolder: rightsHolder, source: source });
                    $('#organism-img-column').append(img_element);
                }
                if (result["dataObjects"][dob]["dataType"] === "http://purl.org/dc/dcmitype/Text") {
                    $("#title" + txtCounter).text(result["dataObjects"][dob]["title"]);
                    $("#txt" + txtCounter).html(result["dataObjects"][dob]["description"]);
                    txtCounter++;
                }
            });
            $("#vernacularName").text(getBestVernacularNameEOL(result));
        },
        error: function error(jqXHR, textStatus, errorThrown) {
            showMessageDialog(errorThrown, 'danger');
        }
    }).always(function () {
        $('#loading-progress').empty();
    });
    $("#toggleCitationButton").on("click", function () {
        $(".trait-citation").toggle();
    });
});