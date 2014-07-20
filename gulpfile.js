var gulp = require('gulp'),
  $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
  }),
  browserSync = require('browser-sync');

/*  Config for your environment */

var paths = {
  "tplSrc": "_templates/*.jade", // change your template extension.
  "lessSrc": "_less/*.less",
  "scssSrc": "_scss/*.scss",
  "jsSrc": "_js/*.js",
  "imgSrc": "_images/**",
  "rootDir": "dist/",
  "imgDir": "dist/images/"
}

gulp.task('bs', function() {
  browserSync.init(null, {
    server: {
      baseDir: paths.rootDir
    },
    notify: true,
    xip: false
  });
});

gulp.task('html', function() {
  return gulp.src(paths.tplSrc)
    .pipe($.jade())
    .pipe(gulp.dest(paths.rootDir))
 // If you need prettify HTML, uncomment below 2 lines.
 // .pipe($.prettify())
 // .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('less', function() {
  return gulp.src(paths.lessSrc)
    .pipe($.sourcemaps.init())
      .pipe($.less())
      .pipe($.autoprefixer('last 2 version'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(paths.rootDir + 'css'))
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe($.csso())
    .pipe(gulp.dest(paths.rootDir + 'css'))
    .pipe(browserSync.reload({
      stream: true,
      once: true
    }));
});

gulp.task('scss', function() {
  return gulp.src(paths.scssSrc)
    .pipe($.rubySass({
      style: 'expanded',
    }))
    .pipe($.autoprefixer('last 2 version'))
    .pipe(gulp.dest(paths.rootDir + 'css'))
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe($.csso())
    .pipe(gulp.dest(paths.rootDir + 'css'))
    .pipe(browserSync.reload({
      stream: true,
      once: true
    }));
});

gulp.task('scripts', function() {
  return gulp.src(paths.jsSrc)
    .pipe($.sourcemaps.init())
      .pipe($.uglify())
      .pipe($.concat('all.js'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(paths.rootDir + 'js'));
});

gulp.task('image', function() {
  return gulp.src(paths.imgSrc)
    .pipe($.changed(paths.imgSrc))
    .pipe($.imagemin({
      optimizationLevel: 3
    })) // See gulp-imagemin page.
  .pipe(gulp.dest(paths.imgDir));
});

// If you would like to use Sass/SCSS, toggle 'less' to 'scss'.

gulp.task('watch', function() {
  gulp.watch([paths.tplSrc], ['html']);
  gulp.watch([paths.lessSrc], ['less']);
  // gulp.watch([paths.scssSrc], ['scss']);
  gulp.watch([paths.imgSrc], ['image']);
});

// If you would like to use Sass/SCSS, toggle 'less' to 'scss'.

gulp.task('default', ['image', 'bs', 'scripts', 'less', 'html', 'watch']);