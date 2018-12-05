// Project configuration
var cssSource = 'src/css/',
  htmlSource = 'src/*.html',
  imgSource = 'src/images/',
  jsSource = 'src/js/',
  scssSource = 'src/scss/',
  cssDist = 'dist/css/',
  htmlDist = 'dist/',
  imgDist = 'dist/images/',
  jsDist = 'dist/js/';

// Load plugins
var autoprefixer = require('autoprefixer'),
  browserSync = require('browser-sync').create(),
  cleanCSS = require('gulp-clean-css'),
  del = require('del'),
  gulp = require('gulp'),
  htmlmin = require('gulp-htmlmin'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  postcss = require('gulp-postcss'),
  rename = require('gulp-rename'),
  runSequence = require('run-sequence'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  taskListing = require('gulp-task-listing'),
  uglify = require('gulp-uglify');

// Show all available tasks
gulp.task('tasks', taskListing.withFilters(/:/));

// Main stylesheet (development)
gulp.task('styles-main', function() {
  return gulp
    .src(scssSource + 'style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(cssDist))
    .pipe(browserSync.stream());
});

// Other stylesheets (development)
gulp.task('styles-other', function() {
  return gulp
    .src(cssSource + '**/*.css')
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest(cssDist))
    .pipe(browserSync.stream());
});

// Development stylesheets (run all styles tasks in sequence instead of asynchronously to avoid potential problems)
gulp.task('styles', function(callback) {
  runSequence('styles-main', 'styles-other', callback);
});

// Scripts (development)
gulp.task('scripts', function() {
  return gulp
    .src(jsSource + '**/*.js')
    .pipe(gulp.dest(jsDist))
    .pipe(browserSync.stream());
});

// HTML
gulp.task('html', function() {
  return gulp
    .src(htmlSource)
    .pipe(htmlmin({ collapseWhitespace: false }))
    .pipe(gulp.dest(htmlDist));
});

// Image optimisation
gulp.task('images', function() {
  return gulp
    .src(imgSource + '**/*')
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        use: [pngquant()],
      })
    )
    .pipe(gulp.dest(imgDist));
});

// Browsersync
gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: 'dist',
    },
  });
});

// Browser Reload
gulp.task('browser-reload', function() {
  browserSync.reload();
});

// Clean
gulp.task('clean', function() {
  return del(['dist']);
});

// Watch
gulp.task('watch', function() {
  gulp.watch(scssSource + 'style.scss', ['styles-main']);
  gulp.watch(cssSource + '**/*.css', ['styles-other']);
  gulp.watch(jsSource + '**/*.js', ['scripts']);
  gulp.watch(imgSource + '**/*', ['images']);
  gulp.watch(htmlSource, ['html', 'browser-reload']);
});

// Gulp task listing
gulp.task('help', taskListing);

// Default gulp task
gulp.task('default', ['styles', 'scripts', 'images', 'html', 'browser-sync', 'watch']);

// -----------------------------------------------------------------------
// Build tasks (cleaning, uglifying, minifiying, image optimisation, etc)
// -----------------------------------------------------------------------

// Main stylesheet (production)
gulp.task('styles-main-prod', function() {
  return gulp
    .src(scssSource + 'style.scss')
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: 'compressed',
      }).on('error', sass.logError)
    )
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(cssDist));
});

// Other stylesheets (production)
gulp.task('styles-other-prod', function() {
  return gulp
    .src(cssSource + '**/*.css')
    .pipe(cleanCSS())
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest(cssDist));
});

// Production stylesheets (run all styles tasks in sequence instead of asynchronously to avoid potential problems)
gulp.task('styles-prod', function(callback) {
  runSequence('styles-main-prod', 'styles-other-prod', callback);
});

// Scripts (production)
gulp.task('scripts-prod', function() {
  return gulp
    .src(jsSource + '**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest(jsDist));
});

// Minify HTML
gulp.task('html-prod', function() {
  return gulp
    .src(htmlSource)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(htmlDist));
});

// Final build task
gulp.task('build', function(callback) {
  runSequence('clean', 'styles-prod', 'scripts-prod', 'html-prod', 'images', callback);
});
