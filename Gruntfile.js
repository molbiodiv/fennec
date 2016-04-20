module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jasmine: {
      js: {
        src: [
          'src/webroot/js/organismDetails.js'
        ],
        options: {
          specs: 'test/js/*Spec.js',
          vendor: [
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/jquery-ui/jquery-ui.min.js',
            'bower_components/d3/d3.min.js',
            'bower_components/underscore/underscore-min.js',
          ]
        }
      }
    },
    'phpunit-runner': {
      all: {
        options: {
          phpunit: 'vendor/bin/phpunit',
          configuration: 'phpunit.xml'
        },
        files: {
          testFiles: 'test/php/'
        }
      }
    }
  });

  // Load the plugin that provides the "jasmine" task.
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  // Load the plugin that provides the "phpunit-runner" task.
  grunt.loadNpmTasks('grunt-phpunit-runner');

  // Default task(s).
  grunt.registerTask('default', []);

};
