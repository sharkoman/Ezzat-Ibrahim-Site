var gulp = require('gulp');
var $    = require('gulp-load-plugins')();
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var maps = require('gulp-sourcemaps');
var livereload = require('gulp-livereload');
var connect = require('gulp-connect');
var del = require('del');
var zip = require('gulp-zip');

var projectName = 'ezzat-ibrahim';

var sassPaths = [
  'bower_components/foundation-sites/scss',
  'bower_components/motion-ui/src'
];

// compile sass files
gulp.task('sass', function() {
  return gulp.src('scss/app.scss')
    .pipe(maps.init())
    .pipe($.sass({
      includePaths: sassPaths
    })
      .on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9']
    }))
    .pipe(maps.write("./"))
    .pipe(gulp.dest('css/'));
});

// concat scripts
gulp.task('scripts', function() {
  return gulp.src(['bower_components/jquery/dist/jquery.js',
    'bower_components/what-input/what-input.js',
    'bower_components/foundation-sites/dist/foundation.js',
    'bower_components/pickadate/lib/picker.js',
    'bower_components/pickadate/lib/picker.date.js',
    'bower_components/pickadate/lib/picker.time.js',
    'js/jquery.nicescroll.js',
    'js/pace.js'])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('js/'));
});

// minify-scripts
gulp.task('compress',['scripts'], function() {
  return gulp.src('js/vendor.js')
    .pipe(uglify())
    .pipe(rename('vendor.min.js'))
    .pipe(gulp.dest('js/'));
});

// minify-css
gulp.task('minify-css',['sass'], function() {
  return gulp.src('css/app.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rename('app.min.css'))
    .pipe(gulp.dest('css/'))
    .pipe(livereload());
});

// reload html files
gulp.task('reload', function () {
  gulp.src(['./*.html'])
    .pipe(livereload());
});

// add localhost server
gulp.task('connect', function() {
  connect.server({
    root: './',
    livereload: false
  });
});

// Delete all files from dis folder
gulp.task('clean', function () {
  del(['dist/**/*']);
});

// package all files to dist folder
gulp.task('build', ['clean'] ,function () {
  return gulp.src(['css/**/*', 'img/**/*', 'js/**/*', 'favicon.ico', '*.html'], {base: './'})
        .pipe(gulp.dest('dist'));
});


// Zip the dist folder
gulp.task('zip', function() {
    return gulp.src('dist/**/*')
        .pipe(zip(projectName+'-dist.zip'))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['connect','minify-css'], function() {
  livereload.listen();
  gulp.watch(['scss/**/*.scss'], ['minify-css', 'reload']);
  gulp.watch(['*.html'], ['reload']);
});
