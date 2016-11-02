/* global db */
/* global biom */
/* global blackbirdPreviewPath */
$('document').ready(() => {
    // Set action for click on inspect with Blackbird
    // db is the browser webstorage
    $('#inspect-with-blackbird-button').click(function () {
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
                    $('#inspect-with-blackbird-iframe').show();
                    $('#inspect-with-blackbird-iframe').attr('src', blackbirdPreviewPath);
                });
            });
        });
    });

    // Adjust size of iframe after loading of Blackbird
    $('#inspect-with-blackbird-iframe').on("load", function () {
        setTimeout(function () {
            $('#inspect-with-blackbird-iframe').attr('height', $('#inspect-with-blackbird-iframe').contents().height() + 20);
        }, 1000);
    });
});