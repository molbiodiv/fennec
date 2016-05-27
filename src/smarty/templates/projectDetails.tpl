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
                biomToStore.name = "bla";
                biomToStore.size = 1000;
                biomToStore.data = '{#$data["projects"][$internal_project_id]#}';
                d = new Date();
                biomToStore.date = d.getUTCFullYear() + "-" + (d.getUTCMonth() + 1) + "-" + d.getUTCDate() + "T" + d.getUTCHours() + ":" + d.getUTCMinutes() + ":" + d.getUTCSeconds() + " UTC";
                console.log(server);
                if (JSON.parse(biomToStore.data).format.indexOf("Biological Observation Matrix") !== -1) {
                  server.biom.add(biomToStore).done(function(item) {
                    // _this.currentData = item;
                    return setTimeout("window.location.href = '{#$WebRoot#}/Phinch/preview.html'", 2000);
                  });
                } else {
                    console.log("Not a biom file");
                }
            });
        });
    </script>
    {#/if#}
{#/block#}