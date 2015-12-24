var builder = require('gulp-nw-builder');
var gulp = require('gulp');
 
gulp.task('build', function() {
  return gulp.src(['app/**/*'])
    .pipe(builder({
        version: 'v0.12.3',
        platforms: ['win64']
     }));
});