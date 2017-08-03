'use strict';

var gulp = require('gulp');
// testing
var mocha = require('gulp-mocha');

gulp.task('test', function() {
    return gulp.src('tests/js/**/*.js', {read: false})
        .pipe(mocha({reporter: 'spec', useColors: true}))
});

gulp.task('default', ['test'], function() {
  // place code for your default task here
});

