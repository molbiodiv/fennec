require('./base/dataTables.jsx')
require('./base/drawCharts.jsx')
require('./base/message.jsx')

// require jQuery normally
const $ = require('jquery');

require('bootstrap-sass');
require('startbootstrap-sb-admin-2/dist/js/sb-admin-2.js');
require('metismenu/dist/metisMenu.js');

// create global $ and jQuery variables
global.$ = global.jQuery = $;