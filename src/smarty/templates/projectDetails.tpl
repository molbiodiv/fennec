{#extends file='layoutWithBars.tpl'#}
{#call_webservice path="details/Projects" data=["ids"=>[$internal_project_id], "dbversion"=>$DbVersion] assign='data'#}
{#call_webservice path="details/TraitsOfOrganisms" data=["organism_ids"=>[13,15,42,47757,200,12049,48569,83767,41617,55709], "dbversion"=>$DbVersion] assign='traits_of_project'#}
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
                <button class='btn' id='inspect-with-phinch-button'>Inspect with Phinch</button>
                <i data-toggle="tooltip" title="This is an experimental integration of phinch (see phinch.org).&#013;There is currently an unresolved license issue (see https://github.com/PitchInteractiveInc/Phinch/issues/56)" class="fa fa-question-circle"></i><br>
                <div style="height: 100%"><iframe id='inspect-with-phinch-iframe' width="100%" height="100%" style="border: none; display: none"></iframe></div>
                <script src="{#$WebRoot#}/Phinch/lib/db.js"></script>
                <script src="{#$WebRoot#}/js/helpers/biom.js"></script>
                <script type="text/javascript">
                    var biomString = '{#$data["projects"][$internal_project_id]#}';
                    var biomObject = JSON.parse(biomString);
                    var biom = new Biom(biomObject);
                    var otuTableData = biom.getOtuTable(100);
                    $('#projectDetails_otuTable').DataTable({
                        data: otuTableData.data,
                        columns: otuTableData.columns,
                        deferRender: true,
                        scrollX: true
                    });
                    $('#inspect-with-phinch-button').click(function(){
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
                                $('#inspect-with-phinch-iframe').attr('src','{#$WebRoot#}/Phinch/preview.html');
                                $('#inspect-with-phinch-iframe').show();
                            });
                        });
                    });

                    $('#inspect-with-phinch-iframe').on("load", function(){
                        setTimeout(function(){
                            console.log($('#inspect-with-phinch-iframe').contents().height());
                            $('#inspect-with-phinch-iframe').attr('height', $('#inspect-with-phinch-iframe').contents().height()+20);
                        }, 1000);
                    });
                </script>
            </div>
            <div role="tabpanel" class="tab-pane" id="traits" style="margin-top: 10px">
                <table id="trait-table" class="table trait-table trait-table-striped table-bordered" width="100%" cellspacing="0">
                    <thead>
                        <tr><th>trait</th><th>count</th><th>range</th></tr>
                    </thead>
                </table>
                <script type="text/javascript">
                    var traits = [];
                    {#foreach key=id item=trait from=$traits_of_project#}
                        var thisTrait = {
                            id: '{#$id#}',
                            trait: '{#$trait['cvterm']#}',
                            count: '{#$trait['trait_entry_ids']|@count#}',
                            range: '{#math equation="x/y*percent" x=$trait['organism_ids']|@count y=6 percent=100#}'
                        };
                        traits.push(thisTrait);
                    {#/foreach#}
                </script>
                <script src="{#$WebRoot#}/js/traitsOfProjectTable.js"></script>
            </div>
        </div>
    </div>
    {#/if#}
{#/block#}