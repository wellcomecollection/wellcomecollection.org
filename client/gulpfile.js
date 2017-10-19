const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const webpack = require('webpack-stream');
const gulpStylelint = require('gulp-stylelint');
const sourcemaps = require('gulp-sourcemaps');
const gutil = require('gulp-util');
const hash = require('gulp-hash');
const clean = require('gulp-clean');
const rename = require('gulp-rename');
const webpackConfig = require('./webpack.config.js');
const jsToSassString = require('json-sass/lib/jsToSassString');
const fs = require('fs');
const path = require('path');
const devMode = gutil.env.dev;

const sources = {
  scss: {
    all: 'scss/**/*.scss',
    jsConfig: 'scss/**/*.js',
    critical: {
      manifests: [
        'scss/critical.scss'
      ],
      distPath: '../server/views/partials/'
    },
    nonCritical: {
      manifests: [
        'scss/non-critical.scss',
        'scss/styleguide.scss'
      ],
      all: ['scss/**/*.scss', '!scss/critical.scss'],
      distPath: '../dist/assets/css'
    }
  },
  js: {
    entry: './js/app.js',
    distPath: '../dist/assets/js/',
    all: 'js/**/*.js'
  },
  libs: {
    srcPath: './libs/**/*.js',
    distPath: '../dist/assets/libs/'
  },
  fonts: {
    srcPath: './fonts/**/*.{woff,woff2}',
    distPath: '../dist/assets/fonts/'
  },
  images: {
    srcPath: './images/**/*.*',
    distPath: '../dist/assets/images/'
  },
  icons: {
    srcPath: './icons/**/*.*',
    distPath: '../dist/assets/icons/'
  },
  cacheJSON: {
    distPath: '../server/config/'
  }
};

gulp.task('scss:compileJsToScss', () => {
  const configPath = '../config';
  const compiledVariablesPath = 'scss/utilities/compiled_variables';
  const files = fs.readdirSync(configPath);

  if (!fs.existsSync(compiledVariablesPath)) {
    fs.mkdirSync(compiledVariablesPath);
  }

  return files.filter(file => path.extname(file) === '.js')
    .forEach((file) => {
      const fileName = path.basename(file, '.js');
      const scssFileName = `_${fileName.replace(/-/g, '_')}.scss`;
      const fileExport = require(path.join(__dirname, configPath, file));
      const scssString = `$${fileName}: ${jsToSassString(fileExport)};\n`;

      fs.writeFile(path.join(compiledVariablesPath, scssFileName), scssString, () => {});
    });
});

gulp.task('fonts:copy', () => {
  gulp.src(sources.fonts.srcPath)
    .pipe(gulp.dest(sources.fonts.distPath));
});

gulp.task('images:copy', () => {
  gulp.src(sources.images.srcPath)
    .pipe(gulp.dest(sources.images.distPath));
});

gulp.task('icons:copy', () => {
  gulp.src(sources.icons.srcPath)
    .pipe(gulp.dest(sources.icons.distPath));
});

gulp.task('libs:copy', () => {
  gulp.src(sources.libs.srcPath)
    .pipe(gulp.dest(sources.libs.distPath));
});

// TODO move paths to vars
gulp.task('css:clean', () => {
  return gulp.src('../dist/assets/css/')
    .pipe(clean({force: true}));
});

gulp.task('js:clean', () => {
  return gulp.src(['../dist/assets/js/', '!../dist/assets/js/libs/'])
    .pipe(clean({force: true}));
});

// TODO: pull out autoprefixing / sourcemaps to it's own task
gulp.task('scss:compile', ['css:clean'], () => {
  return gulp.src(sources.scss.nonCritical.manifests)
    .pipe(devMode ? sourcemaps.init() : gutil.noop())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .on('error', sass.logError)
    .pipe(autoprefixer({
      browsers: [
        'last 2 versions',
        'iOS 8'
      ]
    }))
    .pipe(devMode ? sourcemaps.write() : gutil.noop())
    .pipe(gulp.dest(sources.scss.nonCritical.distPath));
});

gulp.task('scss:compileCritical', () => {
  return gulp.src(sources.scss.critical.manifests)
    .pipe(devMode ? sourcemaps.init() : gutil.noop())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .on('error', sass.logError)
    .pipe(autoprefixer({
      browsers: [
        'last 2 versions',
        'iOS 8'
      ]
    }))
    .pipe(devMode ? sourcemaps.write() : gutil.noop())
    .pipe(rename(function (path) {
      path.basename += path.extname;
      path.extname = '.njk';
    }))
    .pipe(gulp.dest(sources.scss.critical.distPath));
});

gulp.task('js:compile', ['js:clean'], () => {
  return gulp.src(sources.js.entry)
    .pipe(webpack(webpackConfig))
    .on('error', (err) => {
      console.log(err.toString());
      // Allows the stream to continue, thus not breaking watch§
      this.emit('end');
    })
    .pipe(gulp.dest(sources.js.distPath));
});

gulp.task('css:bust', ['scss:compile'], () => {
  gulp.src('../dist/assets/css/non-critical.css')
    .pipe(hash({
      hashLength: 16
    }))
    .pipe(gulp.dest('../dist/assets/css/'))
    .pipe(hash.manifest('css-assets.json'))
    .pipe(gulp.dest(sources.cacheJSON.distPath));
});

gulp.task('js:bust', ['js:compile'], () => {
  gulp.src('../dist/assets/js/app.js')
    .pipe(hash({
      hashlength: 16
    }))
    .pipe(gulp.dest('../dist/assets/js/'))
    .pipe(hash.manifest('js-assets.json', true))
    .pipe(gulp.dest(sources.cacheJSON.distPath));
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

gulp.task('watch', () => {
  gulp.watch(sources.scss.jsConfig, ['scss:compileJsToScss']);
  gulp.watch(sources.scss.nonCritical.all, ['css:bust', 'scss:compileCritical']);
  gulp.watch(sources.scss.critical.manifests, ['scss:compileCritical']);
  gulp.watch(sources.js.all, ['js:bust']);
  gulp.watch(sources.fonts.srcPath, ['fonts:copy']);
  gulp.watch(sources.images.srcPath, ['images:copy']);
  gulp.watch(sources.icons.srcPath, ['icons:copy']);
  gulp.watch(sources.libs.srcPath, ['libs:copy']);
});

gulp.task('js', ['js:compile']);
gulp.task('scss', ['scss:compileJsToScss', 'scss:lint', 'scss:compile', 'scss:compileCritical']);
gulp.task('lint', ['scss:compileJsToScss', 'scss:lint']);
gulp.task('compile', ['css:bust', 'js:bust', 'scss:compileJsToScss', 'scss:compileCritical', 'fonts:copy', 'images:copy', 'icons:copy', 'libs:copy']);
gulp.task('build', ['scss', 'js']);
gulp.task('dev', ['compile', 'watch']);
