'use strict';

$(document).ready(function () {
    $('#otu_project').DataTable();
});
$(document).ready(function () {
    $('#otu_community').DataTable();
});
$(document).ready(function () {
    $('#metadata_project').DataTable();
});
$(document).ready(function () {
    $('#metadata_community').DataTable();
});
"use strict";

/* exported drawHistogram */
/* exported drawPieChart */
/* exported drawMap */
function drawHistogram() {
    var cvterm_id = $("#cvterm_id").val();
    $.ajax({
        url: WebRoot.concat("/ajax/details/Traits"),
        data: { type_cvterm_id: cvterm_id,
            dbversion: DbVersion },
        dataType: "json",
        success: function success(data) {
            if (data.value_type === 'value') {
                var name = data.name;

                $.each(data.value, function (key, value) {
                    d3.select("#histogram").append("div").attr("id", key);
                    var plot_data = [{
                        x: value,
                        type: 'histogram',
                        marker: {
                            color: "#78a00b"
                        },
                        opacity: 0.9
                    }];
                    var layout = {
                        xaxis: {
                            title: name + ' in ' + key
                        },
                        yaxis: {
                            title: "frequency"
                        }
                    };
                    Plotly.newPlot(key, plot_data, layout);
                });
            }
        }
    });
}

function drawPieChart(data) {
    var values = [];
    var labels = [];
    $.each(data, function (key, value) {
        values.push(value);
        labels.push(key);
    });
    var plot = [{
        values: values,
        labels: labels,
        type: 'pie'
    }];
    var layout = {
        height: 700,
        width: 800
    };
    Plotly.newPlot('pieChart', plot, layout);
}

function drawMap() {
    var cvterm_id = $("#cvterm_id").val();
    $.ajax({
        url: WebRoot.concat("/ajax/details/Traits"),
        data: { type_cvterm_id: cvterm_id,
            dbversion: DbVersion },
        dataType: "json",
        success: function success(data) {
            //this function is only called when you expected changes of geographicDistribution.csv
            //As an enhancement the function  should be called every time when data is displayed as a map
            //and the csv file is updated by this function
            //            generateCSV(data);
            Plotly.d3.csv(WebRoot.concat("/geographicDistribution.csv"), function (err, rows) {
                function unpack(rows, key) {
                    return rows.map(function (row) {
                        return row[key];
                    });
                }

                var plot = [{
                    type: 'choropleth',
                    locationmode: 'country names',
                    locations: unpack(rows, 'labels'),
                    z: unpack(rows, 'frequency'),
                    text: unpack(rows, 'labels'),
                    autocolorscale: false,
                    colorscale: [[0, "rgb(224, 224, 224)"], [1, "rgb(120, 160, 11)"]]
                }];

                var layout = {
                    title: data.name,
                    geo: {
                        projection: {
                            type: 'orthographic'
                        },
                        bgcolor: "rgb(255, 255, 255)",
                        showocean: true,
                        showland: false,
                        showlakes: true,
                        showrivers: true,
                        showcountries: false,
                        oceancolor: "rgba(51, 153, 255, 0.30)",
                        lakecolor: "rgb(34, 144, 255)"
                    },
                    height: 700,
                    width: 1000
                };
                /* global map */
                Plotly.plot(map, plot, layout, { showLink: false });
            });
        }
    });
}
'use strict';

/*jshint unused:false*/
// This is the underscore.js template, compiled once and called from showMessageDialog later
var dialogTemplate = '<div class="alert <%= type %> alert-dismissable" role="alert" style="margin-top: 10px;">';
dialogTemplate += '<button type="button" class="close" data-dismiss="alert" aria-label="Close">';
dialogTemplate += '<span aria-hidden="true">&times;</span>';
dialogTemplate += '</button>';
dialogTemplate += '<%= message %>';
dialogTemplate += '</div>';
dialogTemplate = _.template(dialogTemplate);

/**
 * This function appends a bootstrap dialog to the message area with the given message and type
 * @param {type} message - The text that should be shown in the dialog
 * @param {type} type - The type (color) of the dialog. Possible values: alert-success, alert-warning, alert-danger, alert-info (default)
 * @returns {void}
 */
function showMessageDialog(message, type) {
    var knownTypes = ['alert-success', 'alert-warning', 'alert-danger', 'alert-info'];
    if (knownTypes.indexOf(type) === -1) {
        var shortTypes = ['success', 'warning', 'danger', 'info'];
        if (shortTypes.indexOf(type) === -1) {
            type = 'alert-info';
        } else {
            type = "alert-" + type;
        }
    }
    $('#global-message-area').append(dialogTemplate({ type: type, message: message }));
}