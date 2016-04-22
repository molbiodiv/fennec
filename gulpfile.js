var gulp = require('gulp');
var apigen = require('gulp-apigen');
var phpunit = require('gulp-phpunit');
var phpcs = require('gulp-phpcs');

gulp.task('apigen', function() {
  gulp.src('apigen.neon').pipe(apigen('./vendor/bin/apigen'));
});

gulp.task('phpunit', function() {
  gulp.src('phpunit.xml').pipe(phpunit('./vendor/bin/phpunit'));
});

gulp.task('phpcs', function () {
  return gulp.src(['src/webservice/*.php','src/webservice/**/*.php'])
             .pipe(phpcs({ bin: 'vendor/bin/phpcs', standard: 'PSR2' }))
             .pipe(phpcs.reporter('log'));
});

gulp.task('default', function() {
  // place code for your default task here
});

