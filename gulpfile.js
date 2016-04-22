var gulp = require('gulp');
var apigen = require('gulp-apigen');
var phpunit = require('gulp-phpunit');
var spawn = require('child_process').spawn;

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

gulp.task('default', function() {
  // place code for your default task here
});

