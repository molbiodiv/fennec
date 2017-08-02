'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var sassLint = require('gulp-sass-lint');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
// testing
var mocha = require('gulp-mocha');

gulp.task('test', function() {
    return gulp.src('tests/js/**/*.js', {read: false})
        .pipe(mocha({reporter: 'spec', useColors: true}))
});

gulp.task('sass', function () {
  return gulp.src('app/Resources/client/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.css'))
    .pipe(sourcemaps.write('.', {includeContent: false}))
    .pipe(gulp.dest('web/assets/css'));
});

gulp.task('sassLint', function() {
  gulp.src('web/assets/scss/*.s+(a|c)ss')
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});

gulp.task('css', ['sassLint','sass'], function () {
});

gulp.task('default', ['css','test'], function() {
  // place code for your default task here
});

