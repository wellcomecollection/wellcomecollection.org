const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const webpack = require('webpack-stream');
const browserSync = require('browser-sync').create();
const gulpStylelint = require('gulp-stylelint');
const sourcemaps = require('gulp-sourcemaps');
const onst gutil = require('gulp-util');
const webpackConfig = require('./webpack.config.js');

const sources = {
  css: {
    manifests: [
      'scss/application.scss',
      'scss/styleguide.scss'
    ],
    all: 'scss/**/*.scss',
    distPath: '../dist/assets/css'
  },
  js: {
    entry: './js/app.js',
    distPath: '../dist/assets/js/',
    all: 'js/**/*.js'
  }
};

gulp.task('styles', () => {
  return gulp.src(sources.css.manifests)
    .pipe(gutil.env.dev ? sourcemaps.init() : gutil.noop())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .on('error', sass.logError)
    .pipe(autoprefixer({
      browsers: [
        '> 0.01%',
        'last 2 versions',
        'Firefox ESR',
        'IE 9',
        'opera 12.1']
    }))
    .pipe(gutil.env.dev ? sourcemaps.write() : gutil.noop())
    .pipe(gulp.dest(sources.css.distPath))
    .pipe(browserSync.stream());
});

gulp.task('stylelint', () => {
  return gulp.src(sources.css.all)
    .pipe(gulpStylelint({
      syntax: 'scss',
      failAfterError: false,
      reporters: [
        {formatter: 'string', console: true}
      ]
    }));
});

gulp.task('js', () => {
  return gulp.src(sources.js.entry)
      .pipe(webpack(webpackConfig))
      .pipe(gulp.dest(sources.js.distPath));
});

gulp.task('watch', () => {
  browserSync.init({
    open: false,
    proxy: 'localhost:3000/patterns'
  });
  gulp.watch(sources.css.all, ['styles', 'stylelint']);
  gulp.watch(sources.js.all, ['js']);
});

gulp.task('default', ['styles', 'js', 'stylelint']);
