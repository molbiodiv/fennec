'use strict';

var gulp = require('gulp');
var apigen = require('gulp-apigen');
var phpunit = require('gulp-phpunit');
var spawn = require('child_process').spawn;
var jasmine = require('gulp-jasmine');
var jasminePjs = require('gulp-jasmine-phantom');
var cover = require('gulp-coverage');
var sass = require('gulp-sass');
var sassLint = require('gulp-sass-lint');
var sourcemaps = require('gulp-sourcemaps');
var jshint = require('gulp-jshint');
var jsdoc = require('gulp-jsdoc3');

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

gulp.task('jasminePjs', function () {
  return gulp.src('test/js/*Spec.js')
          .pipe(jasminePjs({
          'integration': true,
          'vendor': ['bower_components/underscore/underscore-min.js', 'bower_components/jquery/dist/jquery.min.js', 'src/webroot/js/helpers/*.js']
	}));
});

gulp.task('jshint', function() {
  return gulp.src(['src/webroot/js/*.js','src/webroot/js/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('jsdoc', function (cb) {
  var config = require('./.jsdoc.json');
  gulp.src(['src/webroot/js/helpers/*.js'], {read: false})
      .pipe(jsdoc(config, cb));
});

gulp.task('js', ['jshint','jsdoc','jasmine'], function () {
});

gulp.task('sass', function () {
  return gulp.src('src/webroot/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('.', {includeContent: false}))
    .pipe(gulp.dest('src/webroot/css'));
});

gulp.task('sassLint', function() {
  gulp.src('src/webroot/scss/*.s+(a|c)ss')
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});

gulp.task('css', ['sassLint','sass'], function () {
});

gulp.task('default', ['css', 'js', 'php'], function() {
  // place code for your default task here
});

