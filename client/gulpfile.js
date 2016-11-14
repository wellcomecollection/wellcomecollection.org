const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const webpack = require('webpack-stream');
const browserSync = require('browser-sync').create();
const gulpStylelint = require('gulp-stylelint');
const sourcemaps = require('gulp-sourcemaps');
const gutil = require('gulp-util');
const webpackConfig = require('./webpack.config.js');
const webpackConfigHead = require('./webpack-head.config.js');
const svgstore = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');
const inject = require('gulp-inject');
const eslint = require('gulp-eslint');
const eslintConfig = require('./.eslintrc.json');
const devMode = gutil.env.dev;

const sources = {
  scss: {
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
  fonts: {
    srcPath: './fonts/**/*.{woff,woff2}',
    distPath: '../dist/assets/fonts/'
  },
  images: {
    icons: {
      all: 'images/icons/**/*.svg',
      srcPath: 'images/icons/svg-sprite.njk',
      distPath: '../server/views/_partials'
    }
  }
};

gulp.task('fonts:copy', function() {
   gulp.src(sources.fonts.srcPath)
   .pipe(gulp.dest(sources.fonts.distPath));
});

// TODO: pull out autoprefixing / sourcemaps to it's own task
gulp.task('scss:compile', () => {
  return gulp.src(sources.scss.manifests)
    .pipe(devMode ? sourcemaps.init() : gutil.noop())
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
    .pipe(devMode ? sourcemaps.write() : gutil.noop())
    .pipe(gulp.dest(sources.scss.distPath))
    .pipe(browserSync.stream());
});

gulp.task('scss:lint', () => {
  return gulp.src(sources.scss.all)
    .pipe(gulpStylelint({
      syntax: 'scss',
      failAfterError: !devMode,
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

gulp.task('js:compile', () => {
  return gulp.src(sources.js.entry)
    .pipe(webpack(webpackConfig))
    .on('error', function(err) {
      console.log(err.toString())
      // Allows the stream to continue, thus not breaking watch§
      this.emit('end');
    })
    .pipe(gulp.dest(sources.js.distPath));
});

gulp.task('js:lint', () => {
  return gulp.src(sources.js.all)
    .pipe(eslint(eslintConfig))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('browsersync', () => {
  browserSync.init({
    open: false,
    proxy: 'localhost:3000/patterns'
  });
});

gulp.task('watch', () => {
  gulp.watch(sources.scss.all, ['scss:compile']);
  gulp.watch(sources.js.all, ['js:compile']);
  gulp.watch(sources.images.icons.all, ['svgstore']);
  gulp.watch(sources.fonts.srcPath, ['fonts:copy']);
});

gulp.task('js', ['js:lint', 'js:compile']);
gulp.task('scss', ['scss:lint', 'scss:compile']);
gulp.task('lint', ['scss:lint', 'js:lint']);
gulp.task('compile', ['scss:compile', 'js:compile', 'svgstore', 'fonts:copy']);
gulp.task('build', ['scss', 'js']);
gulp.task('dev', ['compile', 'browsersync', 'watch']);
