/* global phinchPreviewPath */
const db = require('../../../../../../web/assets/Phinch/lib/db')
const biomPromise = require('./biom')

function adjustIframeHeight() {
    setTimeout(() => {
        $('#inspect-with-phinch-iframe').attr('height', $('#inspect-with-phinch-iframe').contents().height() + 20)
    }, 100)
}

$('document').ready(async () => {
    let biom = await biomPromise
    // db is the browser webstorage
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
        let biomToStore = {};
        biomToStore.name = biom.id;
        let biomString = biom.toString();
        biomToStore.size = biomString.length;
        biomToStore.data = biomString;
        let d = new Date();
        biomToStore.date = d.getUTCFullYear() + "-" + (d.getUTCMonth() + 1) + "-" + d.getUTCDate() + "T" + d.getUTCHours() + ":" + d.getUTCMinutes() + ":" + d.getUTCSeconds() + " UTC";
        server.biom.add(biomToStore).done(function (item) {
            $('#inspect-with-phinch-iframe').show();
            $('#inspect-with-phinch-iframe').attr('src', phinchPreviewPath);
        });
    });

    // Adjust size of iframe after loading of Phinch
    $('#inspect-with-phinch-iframe').on("load", function () {
        setTimeout(adjustIframeHeight, 1000);
    });

    $('#inspect-with-phinch-tab').on('click', adjustIframeHeight)
});