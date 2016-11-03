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
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global ReactDOM */

// This is the react template,called from showMessageDialog later
function MessageDialog(props) {
    return React.createElement(
        "div",
        { className: "alert alert-dismissable " + props.type, role: "alert" },
        React.createElement(
            "button",
            { type: "button", className: "close", "aria-label": "Close", onClick: function onClick() {
                    removeMessageDialog(props.id);
                } },
            React.createElement(
                "span",
                { "aria-hidden": "true" },
                "\xD7"
            )
        ),
        props.message
    );
}

var MessageArea = function (_React$Component) {
    _inherits(MessageArea, _React$Component);

    function MessageArea() {
        _classCallCheck(this, MessageArea);

        return _possibleConstructorReturn(this, (MessageArea.__proto__ || Object.getPrototypeOf(MessageArea)).apply(this, arguments));
    }

    _createClass(MessageArea, [{
        key: "render",
        value: function render() {
            var messageDialogs = this.props.messages.map(function (element) {
                return React.createElement(MessageDialog, { type: element.type, message: element.message, key: element.key, id: element.key });
            });
            return React.createElement(
                "div",
                null,
                messageDialogs
            );
        }
    }]);

    return MessageArea;
}(React.Component);

/**
 * This function generates consecutive uids starting from 0
 */


var uid = function () {
    var id = 0;
    return function () {
        return id++;
    };
}();

var messages = [];

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
    messages.push({ message: message, type: type, key: uid() });
    updateMessageDialogs();
}

function removeMessageDialog(key) {
    messages = messages.filter(function (message) {
        return message.key !== key;
    });
    updateMessageDialogs();
}

function updateMessageDialogs() {
    ReactDOM.render(React.createElement(MessageArea, { messages: messages }), document.getElementById('global-message-area'));
}