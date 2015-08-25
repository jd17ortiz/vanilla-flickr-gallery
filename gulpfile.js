'use strict';

// include gulp
var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');


gulp.task('sass-watch', function () {
  gulp.watch('app/sass/**/*.scss', ['sass']);
});

gulp.task('js-watch', function () {
  gulp.watch('app/js/**/*.js', ['js']);
});

gulp.task('sass', function () {
  gulp.src('app/sass/**/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer())
      .pipe(gulp.dest('dist/css'))
      .pipe(browserSync.stream());
});

gulp.task('js', function () {
  gulp.src(['app/js/utilities.js','app/js/flickr-api.js','app/js/gallery.js','app/js/app.js'])
      .pipe(uglify())
      .pipe(concat('all.js'))
      .pipe(gulp.dest('dist/js'))
      .pipe(browserSync.stream());
});
// webserver and live reload
gulp.task('serve', [], function() {
    browserSync({
        notify: false,
        open: true,
        server: {
            baseDir: "app",
            routes: {
              "/app" : "app",
              "/dist" : "dist"
            }
        }
    });
    gulp.watch('app/sass/*.scss', ['sass-watch']);
    gulp.watch('app/js/*.js', ['js-watch']);
    gulp.watch('app/**/*.html').on('change', browserSync.reload);
});


gulp.task('default', ['sass','js','serve']);
