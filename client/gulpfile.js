'use strict'

const gulp = require('gulp')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const webpack = require('webpack-stream')
const browserSync = require('browser-sync').create()
const gulpStylelint = require('gulp-stylelint')
const gutil = require('gulp-util')
const svgstore = require('gulp-svgstore')
const svgmin = require('gulp-svgmin')
const path = require('path')
const inject = require('gulp-inject')
const sources = {
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
    icons: {
      all: 'images/icons/*.svg',
      srcPath: 'images/icons/svg-sprite.njk',
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
  const svgs = gulp.src(sources.images.icons.all)
      .pipe(svgmin())
      .pipe(svgstore({inlineSvg: true}))

  const fileContents = (filePath, file) => {
    return file.contents.toString()
  }

  return gulp.src(sources.images.icons.srcPath)
    .pipe(inject(svgs, {transform: fileContents}))
    .pipe(gulp.dest(sources.images.icons.distPath))
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
  gulp.watch(sources.images.icons.all, ['svgstore'])
})

gulp.task('default', ['styles', 'scripts', 'svgstore', 'stylelint'])
