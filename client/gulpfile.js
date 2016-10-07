'use strict'

let gulp = require('gulp')
let sass = require('gulp-sass')
let autoprefixer = require('gulp-autoprefixer')
let webpack = require('webpack-stream')
let browserSync = require('browser-sync').create()
let gulpStylelint = require('gulp-stylelint')
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
  }
}

gulp.task('styles', () => {
  return gulp.src(sources.css.manifests)
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
})

gulp.task('default', ['styles', 'scripts', 'stylelint'])
