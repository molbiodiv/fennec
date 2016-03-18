{#call_webservice path="listing/Details" data=["id"=>$organismId] assign='data'#}
{#call_webservice path="listing/Taxonomy" data=["id"=>$organismId] assign='taxonomy'#}
<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="background-color: #076565; margin-bottom: 10px; border-radius: 5px; ">
    <h1 class="page-header" style="color: #fff;">{#$data['scientific_name']#}</h1>
</div>
<div class="col-md-12">
    <div>
        <ul class="nav nav-tabs" role="tablist">
            <li role="presentation" class="active"><a class="organism-link" href="#overview" role="tab" data-toggle="tab">Overview</a></li>
            <li role="presentation"><a class="organism-link" href="#detail" aria-controls="detail" role="tab" data-toggle="tab">Detail</a></li>
            <li role="presentation"><a class="organism-link" href="#traits" aria-controls="traits" role="tab" data-toggle="tab">Traits</a></li>
            <li role="presentation"><a class="organism-link" href="#taxonomy" aria-controls="taxonomy" role="tab" data-toggle="tab">Taxonomy</a></li>
            <li role="presentation"><a class="organism-link" href="#community" aria-controls="community" role="tab" data-toggle="tab">Community</a></li>
            <li role="presentation"><a class="organism-link" href="#literature" aria-controls="literature" role="tab" data-toggle="tab">Literature</a></li>
        </ul>

        <div class="tab-content">
            <div role="tabpanel" class="tab-pane active" id="overview">
                <h2 id="vernacularName"></h2>
                <div class="col-md-4" style="margin-top: 10px;" id="organism-img-column">
                </div>
                <div class="col-md-6">
                    <h4 id="title1"></h4>
                    <div id="txt1"></div>
                    <h4 id="title2"></h4>
                    <div id="txt2"></div>
                    <h4 id="title3"></h4>
                    <div id="txt3"></div>
                </div>
            </div>
            <div role="tabpanel" class="tab-pane" id="detail"></div>
            <div role="tabpanel" class="tab-pane" id="traits">
            <h4 class="page-header">Characteristics</h4>
                <div class="col-md-6 text-left" style="font-weight: bold">
                    metabolic rate
                </div> 
                <div class="col-md-6 text-right">
                    467.97 mL/hr O2
                </div>
                <div class="col-md-6 text-left" style="font-weight: bold; margin-top: 5px;">
                    body length (VT)
                </div> 
                <div class="col-md-6 text-right" style="margin-top: 5px;">
                    111.7 mm newborn animal<br>
                    374.23 mm adult
                </div>
                <div class="col-md-6 text-left" style="font-weight: bold; margin-top: 5px;">
                    habitat
                </div> 
                <div class="col-md-6 text-right" style="margin-top: 5px;">
                    arid<br>
                    coast<br>
                    desert<br>
                    more
                </div>
            </div>
            <div role="tabpanel" class="tab-pane" id="taxonomy">
                <h4 class="page-header">Lineage</h4>
                {#foreach $taxonomy['lineage'] as $organism#}
                    {#$organism#}
                {#/foreach#}
            </div>
            <div role="tabpanel" class="tab-pane" id="community"></div>
            <div role="tabpanel" class="tab-pane" id="literature"></div>
        </div>
    </div>
</div>

{#if isset($data.eol_accession) and !empty($data.eol_accession)#}
<script type="text/javascript">
    var eol_id = {#$data.eol_accession#};
    var img_template = '<a class="thumbnail" href="<%= href %>"><img src="<%= src %>"/></a><a href="<%= source %>"><div>(c) <%= rightsHolder %> <%= license %></div></a>'
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
        success: function(result){
            console.log(result);
            var txtCounter = 1;
            for(dob in result["dataObjects"]){
                if(result["dataObjects"][dob]["dataType"] === "http://purl.org/dc/dcmitype/StillImage"){
                    var url = result["dataObjects"][dob]["eolMediaURL"];
                    var license = result["dataObjects"][dob]["license"];
                    var rightsHolder = result["dataObjects"][dob]["rightsHolder"];
                    var source = result["dataObjects"][dob]["source"];
                    var img_element = _.template(img_template)({src: url, href: url, license: license, rightsHolder: rightsHolder, source: source});
                    $('#organism-img-column').append(img_element);
                }
                if(result["dataObjects"][dob]["dataType"] === "http://purl.org/dc/dcmitype/Text"){
                    $("#title"+txtCounter).text(result["dataObjects"][dob]["title"]);
                    $("#txt"+txtCounter).html(result["dataObjects"][dob]["description"]);
                    txtCounter++;
                }
            }
            $("#vernacularName").text(result["vernacularNames"][0]["vernacularName"]);
        }
    });
</script>
{#/if#}