const path = require('path');
const gulp = require('gulp');
const babel = require('gulp-babel');
const minify = require('gulp-uglifyjs');

gulp.task('default', () => {
  return gulp
    .src('./client/src/admin.js')
    .pipe(babel({
      presets: ['es2015', 'es2016']
    }))
    .pipe(minify())
    .pipe(gulp.dest('./client/dist/'));
});