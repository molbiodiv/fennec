/* global db */
/* global biom */
/* global phinchPreviewPath */
$('document').ready(() => {
    // Set action for click on inspect with Phinch
    // db is the browser webstorage
    $('#inspect-with-phinch-button').click(function () {
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
        }).done(function (server) {
            var biomToStore = {};
            biomToStore.name = biom.id;
            biom.write().then(biomString => {
                biomToStore.size = biomString.length;
                biomToStore.data = biomString;
                let d = new Date();
                biomToStore.date = d.getUTCFullYear() + "-" + (d.getUTCMonth() + 1) + "-" + d.getUTCDate() + "T" + d.getUTCHours() + ":" + d.getUTCMinutes() + ":" + d.getUTCSeconds() + " UTC";
                server.biom.add(biomToStore).done(function (item) {
                    $('#inspect-with-phinch-iframe').show();
                    $('#inspect-with-phinch-iframe').attr('src', phinchPreviewPath);
                });
            });
        });
    });

    // Adjust size of iframe after loading of Phinch
    $('#inspect-with-phinch-iframe').on("load", function () {
        setTimeout(function () {
            $('#inspect-with-phinch-iframe').attr('height', $('#inspect-with-phinch-iframe').contents().height() + 20);
        }, 1000);
    });
});