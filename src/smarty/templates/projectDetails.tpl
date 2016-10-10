{#extends file='layoutWithBars.tpl'#}
{#call_webservice path="details/Projects" data=["ids"=>[$internal_project_id], "dbversion"=>$DbVersion] assign='data'#}
{#block name='content'#}
    {#if isset($data['error'])#}
    <h3>Error: {#$data['error']#}</h3>
    {#elseif count($data['projects'])<1#}
    <h3>Error: This project could not be found for the current user.</h3>
    {#else#}
    <h3>OTU Table <i data-toggle="tooltip" title="This table is truncated and contains just 100 random OTUs for performance reasons" class="fa fa-question-circle"></i></h3>
    <div>
        <ul class="nav nav-tabs" role="tablist">
            <li role="presentation" class="active"><a class="project-link" href="#overview" role="tab" data-toggle="tab">Overview</a></li>
            <li role="presentation"><a class="project-link" href="#traits" aria-controls="traits" role="tab" data-toggle="tab">Traits</a></li>
        </ul>
        <div class="tab-content">
            <div role="tabpanel" class="tab-pane active" id="overview" style="margin-top: 10px">
                <table id="projectDetails_otuTable" class="table project-table project-table-striped table-bordered" width="100%" cellspacing="0"></table>
                <button class='btn' id="inspect-with-blackbird-button">Inspect with Blackbird</button>
                <i data-toggle="tooltip" title="This is an experimental integration of Blackbird (see blackbird.iimog.org)." class="fa fa-question-circle"></i><br>
                <div style="height: 100%"><iframe id='inspect-with-blackbird-iframe' width="100%" height="100%" style="border: none; display: none"></iframe></div>
                <script src="{#$WebRoot#}/Blackbird/lib/db.js"></script>
                <script src="{#$WebRoot#}/js/helpers/biom.js"></script>
                <script type="text/javascript">
                    var Biom = require('biojs-io-biom').Biom;
                    var biomString = '{#$data["projects"][$internal_project_id]#}';
                    var biomObject = JSON.parse(biomString);
                    var organism_ids = biomObject.rows.filter(function (element) {
                        return typeof element['metadata'] !== 'undefined' && !isNaN(element['metadata']['fennec_organism_id']);
                    }).map(function(element) {
                        return element['metadata']['fennec_organism_id'];
                    });
                    var biom = new Biom(biomObject);
                    var otuTableData = getOtuTable(biom, 100);
                    $('#projectDetails_otuTable').DataTable({
                        data: otuTableData.data,
                        columns: otuTableData.columns,
                        deferRender: true,
                        scrollX: true
                    });
                    $('#inspect-with-blackbird-button').click(function(){
                        db.open({
                            server: "BiomData",
                            version: 1,
                            schema: {
                                "biom": {
                                    key: {
                                        keyPath: 'id',
                                        autoIncrement: true
                                    }
                                }
                            }
                        }).done(function(server) {
                            biomToStore = {};
                            biomToStore.name = biomObject.id;
                            if(!biomObject.columns[0].hasOwnProperty('metadata') ||
                                    biomObject.columns[0].metadata === null ||
                                    !biomObject.columns[0].metadata.hasOwnProperty('phinchID')){
                                for(i=0; i<biomObject.columns.length; i++){
                                    if(!biomObject.columns[i].hasOwnProperty('metadata') || biomObject.columns[i].metadata === null){
                                        biomObject.columns[i].metadata = [];
                                    }
                                    biomObject.columns[i].metadata.phinchID = i;
                                }
                                biomString = JSON.stringify(biomObject);
                            }
                            biomToStore.size = biomString.length;
                            biomToStore.data = biomString;
                            d = new Date();
                            biomToStore.date = d.getUTCFullYear() + "-" + (d.getUTCMonth() + 1) + "-" + d.getUTCDate() + "T" + d.getUTCHours() + ":" + d.getUTCMinutes() + ":" + d.getUTCSeconds() + " UTC";
                            server.biom.add(biomToStore).done(function(item) {
                                $('#inspect-with-blackbird-iframe').attr('src','{#$WebRoot#}/Blackbird/preview.html');
                                $('#inspect-with-blackbird-iframe').show();
                            });
                        });
                    });

                    $('#inspect-with-blackbird-iframe').on("load", function(){
                        setTimeout(function(){
                            console.log($('#inspect-with-blackbird-iframe').contents().height());
                            $('#inspect-with-blackbird-iframe').attr('height', $('#inspect-with-blackbird-iframe').contents().height()+20);
                        }, 1000);
                    });
                </script>
            </div>
            <div role="tabpanel" class="tab-pane" id="traits" style="margin-top: 10px">
                <table id="trait-table" class="table trait-table trait-table-striped table-bordered" width="100%" cellspacing="0">
                    <thead>
                        <tr><th>trait</th><th>count</th><th>range</th><th>actions</th></tr>
                    </thead>
                </table>
                <script type="text/javascript">
                    var traits = [];
                    $.ajax( ServicePath + '/details/TraitsOfOrganisms', {
                        data: {
                            "dbversion": DbVersion,
                            "organism_ids": organism_ids
                        },
                        method: "post",
                        success: function(data){
                            $.each(data, function(key, value) {
                                var thisTrait = {
                                    id: key,
                                    trait: value['trait_type'],
                                    count: value['trait_entry_ids'].length,
                                    range: 100*value['organism_ids'].length/organism_ids.length
                                };
                                traits.push(thisTrait);
                            });
                            initTraitsOfProjectTable({#$internal_project_id#});
                        }
                    });
                </script>
                <script src="{#$WebRoot#}/js/traitsOfProjectTable.js"></script>
            </div>
        </div>
    </div>
    {#/if#}
{#/block#}