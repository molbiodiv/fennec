/**
 * Created by s216121 on 14.03.17.
 */
$('document').ready(function(){
    let img_template = '<a class="thumbnail" href="<%= href %>"><img src="<%= src %>"/></a><a href="<%= source %>"><div><%= rights %> <%= license %></div></a>';
    let txt_template = '<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title"><%= title %></h3><a href="<%= href %>"><%= rights %> <%= license %></a></div><div class="panel-body"><%= body %></div></div>';
    $.ajax({
        method: "GET",
        url: "https://eol.org/api/pages/1.0.json",
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
        success: function(result){
            console.log(result);
            $.each(result["dataObjects"], function (dob) {
                if(result["dataObjects"][dob]["dataType"] === "http://purl.org/dc/dcmitype/StillImage"){
                    let url = result["dataObjects"][dob]["eolMediaURL"];
                    let license = result["dataObjects"][dob]["license"];
                    let rights = result["dataObjects"][dob]["rights"];
                    if(typeof rights === 'undefined'){
                        rights = "(c)"+result["dataObjects"][dob]["rightsHolder"];
                    }
                    let source = result["dataObjects"][dob]["source"];
                    let img_element = _.template(img_template)({src: url, href: url, license: license, rights: rights, source: source});
                    $('#organism-img-column').append(img_element);
                }
                if(result["dataObjects"][dob]["dataType"] === "http://purl.org/dc/dcmitype/Text"){
                    let title = result["dataObjects"][dob]["title"];
                    let body = result["dataObjects"][dob]["description"];
                    let url = result["dataObjects"][dob]["source"];
                    let license = result["dataObjects"][dob]["license"];
                    let rights = result["dataObjects"][dob]["rights"];
                    if(typeof rights === 'undefined'){
                        rights = "(c)"+result["dataObjects"][dob]["rightsHolder"];
                    }
                    let txt_element = _.template(txt_template)({title: title, body: body, href: url, rights: rights, license: license});
                    $('#organism-txt-column').append(txt_element);
                }
            });
            $("#vernacularName").text(getBestVernacularNameEOL(result));
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showMessageDialog(errorThrown, 'danger');
        }
    }).always(function(){
        $('#loading-progress').empty();
    });
    $("#toggleCitationButton").on("click", function(){
        $(".trait-citation").toggle();
    })
});
