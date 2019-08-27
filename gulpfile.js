// Init modules
const { src, dest, watch, series, parallel } = require('gulp');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const replace = require('gulp-replace');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');

// File path variables
const paths = {
  scssPath: 'app/styles/**/*.scss',
  jsPath: 'app/js/**/*.js',
  imgPath: 'app/img/*'
};

// Sass task
const scssTask = () => {
  return src(paths.scssPath)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist/css'));
};

// JS task
const jsTask = () => {
  return src(paths.jsPath)
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(dest('dist/js'));
};

const imgTask = () => {
  return src(paths.imgPath)
    .pipe(imagemin())
    .pipe(dest('dist/img'));
};

// Cachebusting task
const cachebustTask = () => {
  return src(['index.html']).pipe(dest('dist/cache'));
};

// Watch task
const watchTask = () => {
  watch(
    [paths.scssPath, paths.jsPath, paths.imgPath],
    parallel(scssTask, jsTask, imgTask)
  );
};

// Default task
exports.default = series(
  parallel(scssTask, jsTask, imgTask),
  cachebustTask,
  watchTask
);
