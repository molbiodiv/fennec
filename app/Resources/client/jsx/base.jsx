require('./base/dataTables.jsx')
require('./base/drawCharts.jsx')
require('./base/message.jsx')

// require jQuery normally
const $ = require('jquery');
// create global $ and jQuery variables
global.$ = global.jQuery = $;

require('bootstrap-sass');
require('bootstrap-select')
require('startbootstrap-sb-admin-2/dist/js/sb-admin-2.js');
require('metismenu/dist/metisMenu.js');

require('jquery-ui-dist/jquery-ui');
require('plotly.js/dist/plotly');

