'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var sassLint = require('gulp-sass-lint');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
require('babel-core/register');
// testing
var mocha = require('gulp-mocha');

gulp.task('babel-helpers', function() {
    return gulp.src('app/Resources/client/jsx/helpers/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('helpers.js'))
        .pipe(gulp.dest('web/assets/js/'));
});

function runBabelOnFolder(outFolder, outFileBase) {
    return gulp.src('app/Resources/client/jsx/'+outFolder+'/'+outFileBase+'/*.jsx')
        .pipe(babel({
            presets: ['es2015', 'react']
        }))
        .pipe(concat(outFileBase+'.js'))
        .pipe(gulp.dest('web/assets/js/'+outFolder));
}

gulp.task('babel-project-details', function() {
    return runBabelOnFolder('project', 'details');
});

gulp.task('test', function() {
    return gulp.src('tests/js/**/*.js', {read: false})
        .pipe(mocha({reporter: 'spec', useColors: true}))
});

gulp.task('sass', function () {
  return gulp.src('app/Resources/client/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('.', {includeContent: false}))
    .pipe(gulp.dest('web/assets/css'));
});

gulp.task('sassLint', function() {
  gulp.src('web/assets/scss/*.s+(a|c)ss')
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});

gulp.task('babel', ['babel-helpers','babel-project-details'], function () {
});

gulp.task('css', ['sassLint','sass'], function () {
});

gulp.task('default', ['css','babel','test'], function() {
  // place code for your default task here
});

