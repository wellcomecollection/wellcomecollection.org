const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const webpack = require('webpack-stream');
const browserSync = require('browser-sync').create();
const gulpStylelint = require('gulp-stylelint');
const sourcemaps = require('gulp-sourcemaps');
const gutil = require('gulp-util');
const webpackConfig = require('./webpack.config.js');
const svgstore = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');
const inject = require('gulp-inject');

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
  },
  images: {
    icons: {
      all: 'images/icons/*.svg',
      srcPath: 'images/icons/svg-sprite.njk',
      distPath: '../server/views/partials'
    }
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

gulp.task('svgstore', function () {
  const svgs = gulp.src(sources.images.icons.all)
    .pipe(svgmin())
    .pipe(svgstore({inlineSvg: true}));

  const fileContents = (filePath, file) => {
    return file.contents.toString();
  };

  return gulp.src(sources.images.icons.srcPath)
    .pipe(inject(svgs, {transform: fileContents}))
    .pipe(gulp.dest(sources.images.icons.distPath));
});

gulp.task('js', () => {
  return gulp.src(sources.js.entry)
    .pipe(webpack(webpackConfig))
    .on('error', err => console.log(err.toString()))
    .pipe(gulp.dest(sources.js.distPath));
});

gulp.task('watch', () => {
  browserSync.init({
    open: false,
    proxy: 'localhost:3000/patterns'
  });

  gulp.watch(sources.css.all, ['styles', 'stylelint']);
  gulp.watch(sources.js.all, ['js']);
  gulp.watch(sources.images.icons.all, ['svgstore']);
});

gulp.task('default', ['styles', 'js', 'svgstore', 'stylelint']);
