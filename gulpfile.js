// Load plugins
var gulp = require('gulp'),
  browserSync = require('browser-sync').create(),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer');

// Theme stylesheet (development)
gulp.task('styles', function() {
  return gulp
    .src('./src/scss/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write('../src/scss/'))
    .pipe(gulp.dest('./dist/'))
    .pipe(browserSync.stream());
});

// Browsersync
gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: 'dist',
    },
  });
});

// Watch
gulp.task('watch', function() {
  gulp.watch('src/scss/style.scss', ['styles']);
});

// Default gulp task
gulp.task('default', ['styles', 'browser-sync', 'watch']);

// Build
gulp.task('build', ['styles']);
