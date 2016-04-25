'use strict';

var gulp = require('gulp');
var apigen = require('gulp-apigen');
var phpunit = require('gulp-phpunit');
var spawn = require('child_process').spawn;
var jasmine = require('gulp-jasmine');
var cover = require('gulp-coverage');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('apigen', function() {
  gulp.src('apigen.neon').pipe(apigen('./vendor/bin/apigen'));
});

gulp.task('phpunit', function() {
  gulp.src('phpunit.xml').pipe(phpunit('./vendor/bin/phpunit'));
});

gulp.task('phpcs', function () {
  spawn('vendor/bin/phpcs', [], {stdio: 'inherit'});
});

gulp.task('php', ['phpcs','apigen','phpunit'], function () {
});

gulp.task('jasmine', function() {
    gulp.src(['test/js/*Spec.js'])
        .pipe(cover.instrument({
            pattern: ['src/webroot/js/helpers/*.js']
        }))
        .pipe(jasmine({'config': {
          'spec_dir': './',
          'helpers': ['src/webroot/js/helpers/*.js']
        }}))
        .pipe(cover.gather())
        .pipe(cover.format())
        .pipe(gulp.dest('test/js/cover'));;
});

gulp.task('sass', function () {
  return gulp.src('src/webroot/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('.', {includeContent: false}))
    .pipe(gulp.dest('src/webroot/css'));
});

gulp.task('default', function() {
  // place code for your default task here
});

