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

/**
 *
 * @param outFolder string
 * @param outFileBase string
 * @return {*}
 */
function runBabelOnFolder(outFolder, outFileBase) {
    if(outFolder !== '' && outFolder.slice(-1) !== '/'){
        outFolder += '/';
    }
    return gulp.src('app/Resources/client/jsx/'+outFolder+outFileBase+'/*.js?(x)')
        .pipe(babel({
            presets: ['es2015', 'react']
        }))
        .pipe(concat(outFileBase+'.js'))
        .pipe(gulp.dest('web/assets/js/'+outFolder));
}

gulp.task('babel-helpers', function() {
    return runBabelOnFolder('', 'helpers');
});

gulp.task('babel-base', function() {
    return runBabelOnFolder('', 'base');
});

gulp.task('babel-project-details', function() {
    return runBabelOnFolder('project', 'details');
});

gulp.task('babel-project-helpers', function() {
    return runBabelOnFolder('project', 'helpers');
});

gulp.task('babel-project-trait-details', function() {
    return runBabelOnFolder('project', 'traitDetails');
});

gulp.task('babel-trait-browse', function() {
    return runBabelOnFolder('trait', 'browse');
});

gulp.task('babel-organism-details', function() {
    return runBabelOnFolder('organism', 'details');
});

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

gulp.task('babel', [
    'babel-helpers',
    'babel-base',
    'babel-project-details',
    'babel-project-helpers',
    'babel-project-trait-details',
    'babel-trait-browse',
    'babel-organism-details'
], function () {
});

gulp.task('css', ['sassLint','sass'], function () {
});

gulp.task('default', ['css','babel','test'], function() {
  // place code for your default task here
});

