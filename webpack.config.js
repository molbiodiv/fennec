// webpack.config.js
var Encore = require('@symfony/webpack-encore');

Encore
    // directory where all compiled assets will be stored
    .setOutputPath('web/assets/js/')
    // what's the public path to this directory (relative to your project's document root dir)
    .setPublicPath('/js')
    // empty the outputPath dir before each build
    .cleanupOutputBeforeBuild()
    // will output as web/build/app.js
    .addEntry('base', ['babel-polyfill', './app/Resources/client/jsx/base.jsx'])
    .addEntry('helpers', ['./app/Resources/client/jsx/helpers.jsx'])
    .addEntry('project/details', ['./app/Resources/client/jsx/project/details.jsx'])
    .addEntry('project/helpers', ['./app/Resources/client/jsx/project/helpers.jsx'])
    .addEntry('project/traitDetails', ['./app/Resources/client/jsx/project/traitDetails.jsx'])
    .addEntry('organism/details', ['./app/Resources/client/jsx/organism/details.jsx'])
    .addEntry('organism/search', ['./app/Resources/client/jsx/organism/search.jsx'])
    .addEntry('trait/browse', ['./app/Resources/client/jsx/trait/browse.jsx'])
    .addEntry('trait/search', ['./app/Resources/client/jsx/trait/search.jsx'])
    .enableSourceMaps(!Encore.isProduction())
;



// export the final configuration
module.exports = Encore.getWebpackConfig();