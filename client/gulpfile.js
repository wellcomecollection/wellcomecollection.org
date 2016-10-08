'use strict'

let gulp = require('gulp')
let sass = require('gulp-sass')
let sourcemaps = require('gulp-sourcemaps')
let autoprefixer = require('gulp-autoprefixer')
let webpack = require('webpack-stream')
let browserSync = require('browser-sync').create()
let gulpStylelint = require('gulp-stylelint')
let gutil = require('gulp-util')
let svgstore = require('gulp-svgstore')
let svgmin = require('gulp-svgmin')
let path = require('path')
let inject = require('gulp-inject')
let sources = {
  css: {
    manifests: [
      'scss/application.scss',
      'scss/styleguide.scss'
    ],
    all: 'scss/**/*.scss',
    distPath: '../dist/assets/css'
  },
  scripts: {
    entry: 'js/styleguide.js',
    distPath: '../dist/assets/js/',
    all: 'js/**/*.js'
  },
  images: {
    svg: {
      all: 'images/svg/*.svg',
      srcPath: 'images/svg/svg-sprite.njk',
      distPath: '../server/views/partials'
    }
  }
}

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
    .pipe(browserSync.stream())
})

gulp.task('stylelint', () => {
  return gulp.src(sources.css.all)
    .pipe(gulpStylelint({
      syntax: 'scss',
      failAfterError: false,
      reporters: [
        {formatter: 'string', console: true}
      ]
    }))
})

gulp.task('svgstore', function () {
  let svgs = gulp.src(sources.images.svg.all)
      .pipe(svgmin((file) => {
        let prefix = path.basename(file.relative, path.extname(file.relative))

        return {
          plugins: [{
            cleanupIDs: {
              prefix: prefix + '-',
              minify: true
            }
          }]
        }
      }))
      .pipe(svgstore({inlineSvg: true}))

  const fileContents = (filePath, file) => {
    return file.contents.toString()
  }

  return gulp.src(sources.images.svg.srcPath)
    .pipe(inject(svgs, {transform: fileContents}))
    .pipe(gulp.dest(sources.images.svg.distPath))
})

gulp.task('scripts', () => {
  return gulp.src(sources.scripts.entry)
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest(sources.scripts.distPath))
})

gulp.task('watch', () => {
  browserSync.init({
    proxy: 'localhost:3000/patterns'
  })
  gulp.watch(sources.css.all, ['styles', 'stylelint'])
  gulp.watch(sources.scripts.all, ['scripts'])
  gulp.watch(sources.images.svg.all, ['svgstore'])
})

gulp.task('default', ['styles', 'scripts', 'svgstore', 'stylelint'])
