{#extends file='layoutWithBars.tpl'#}
{#call_webservice path="details/Projects" data=["ids"=>[$internal_project_id], "dbversion"=>$DbVersion] assign='data'#}
{#block name='content'#}
    {#if isset($data['error'])#}
    <h3>Error: {#$data['error']#}</h3>
    {#elseif count($data['projects'])<1#}
    <h3>Error: This project could not be found for the current user.</h3>
    {#else#}
    <button class='btn' id='inspect-with-phinch-button'>Inspect with Phinch</button>
    <script src="{#$WebRoot#}/Phinch/lib/jquery-1.10.1.min.js"></script>
    <script src="{#$WebRoot#}/Phinch/lib/jquery-ui-1.10.3.custom.min.js"></script>
    <script src="{#$WebRoot#}/Phinch/lib/indexedDB.polyfill.js"></script>
    <script src="{#$WebRoot#}/Phinch/lib/db.js"></script>
    <script src="{#$WebRoot#}/Phinch/lib/FileSaver.js"></script>
    <script src="{#$WebRoot#}/Phinch/lib/moment.min.js"></script>
    <script src="{#$WebRoot#}/Phinch/lib/d3.v3.min.js"></script>
    <script src="{#$WebRoot#}/Phinch/lib/jquery.dataTables.min.js"></script>

    <script src="{#$WebRoot#}/Phinch/scripts/filter.js"></script>
    <script src="{#$WebRoot#}/Phinch/scripts/init.js"></script>
    <script type="text/javascript">
        var biomString = '{#$data["projects"][$internal_project_id]#}';
        var biomObject = JSON.parse(biomString);
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
                    return setTimeout("window.location.href = '{#$WebRoot#}/Phinch/preview.html'", 2000);
                });
            });
        });
    </script>
    {#/if#}
{#/block#}