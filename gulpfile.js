'use strict'

let gulp = require('gulp')
let sass = require('gulp-sass')
let autoprefixer = require('gulp-autoprefixer')
let webpack = require('webpack-stream')
let livereload = require('gulp-livereload')
let sources = {
  css: {
    manifests: [
      'scss/application.scss',
      'scss/styleguide.scss'
    ],
    all: 'scss/**/*.scss',
    distPath: 'dist/assets/css'
  },
  fonts: {
    srcPath: 'fonts/**/*',
    distPath: 'dist/assets/fonts'
  },
  scripts: {
    entry: 'js/styleguide.js',
    distPath: 'dist/assets/js/',
    all: 'js/**/*.js'
  }
}

gulp.task('styles', () => {
  return gulp.src(sources.css.manifests)
    .on('error', (error) => { console.log(error) })
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(autoprefixer({
      browsers: [
        '> 0.01%',
        'last 2 versions',
        'Firefox ESR',
        'IE 9',
        'opera 12.1']
    }))
    .pipe(gulp.dest(sources.css.distPath))
    .pipe(livereload())
})

gulp.task('fonts', () => {
  return gulp.src(sources.fonts.srcPath)
    .pipe(gulp.dest(sources.fonts.distPath))
})

gulp.task('scripts', () => {
  return gulp.src(sources.scripts.entry)
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest(sources.scripts.distPath))
})

gulp.task('watch', () => {
  livereload.listen()
  gulp.watch(sources.css.all, ['styles'])
  gulp.watch(sources.scripts.all, ['scripts'])
})

gulp.task('default', ['styles', 'fonts', 'scripts', 'watch'])
