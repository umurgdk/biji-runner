var gulp = require('gulp');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');
var connect = require('gulp-connect');

var tsProject = ts.createProject('tsconfig.json', {
  typescript: require('typescript'),
  sourtOut: true
});

gulp.task('scripts', function () {
  var tsResult = tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(ts(tsProject));

  return tsResult.js
    .pipe(concat('nazimhikmetrun.js'))
    .pipe(sourcemaps.write('./', {sourceRoot: '/'}))
    .pipe(gulp.dest('build'))
    .pipe(connect.reload());
});

gulp.task('assets', function () {
   return gulp.src('assets/**/*.*')
       .pipe(gulp.dest('build/assets'));
});

gulp.task('watch', ['scripts'], function() {
  gulp.watch('src/ts/**/*.ts', ['scripts']);
  gulp.watch('src/*.html', ['templates']);
  gulp.watch('assets/**/*', ['assets'])
});

gulp.task('server', function () {
  connect.server({
    root: '.'
  });
});

gulp.task('templates', function () {
  gulp.src('src/*.html')
    .pipe(gulp.dest('build'));
});

gulp.task('build', ['scripts', 'templates', 'assets']);

gulp.task('default', ['build', 'server', 'watch']);
