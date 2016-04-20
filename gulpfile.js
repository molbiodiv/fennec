var gulp = require('gulp');

gulp.task('default', function() {
  // place code for your default task here
});

var apigen = require('gulp-apigen');

gulp.task('apigen', function() {
  gulp.src('apigen.neon').pipe(apigen('./vendor/bin/apigen'));
});
