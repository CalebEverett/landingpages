var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    cheerio = require('gulp-cheerio'),
    compass = require('gulp-compass'),
    concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
    gutil = require('gulp-util'),
    inject = require('gulp-inject'),
    minifyHTML = require('gulp-minify-html'),
    path = require('path'),
    replace = require('gulp-replace'),
    shell = require('gulp-shell'),
    svgmin = require('gulp-svgmin'),
    svgstore = require('gulp-svgstore'),
    fs = require('fs'),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload,
    uglify = require('gulp-uglify');

var env,
    jsSources,
    sassSources,
    htmlSources,
    outputDir,
    outputDir,
    sassStyle,
    hubspotDir = 'builds/hubspot/',
    hubspotFile = 'cccland', //used for .html file and for hubspot folders
    phpSources;

env = 'development';

if (env==='development') {
  outputDir = 'builds/development/';
  sassStyle = 'expanded';
} else {
  outputDir = 'builds/production/';
  sassStyle = 'compressed';
}

jsFooterSources = [
  'components/scripts/footer/jqloader.js',
  'components/scripts/footer/TweenMax.min.js',
  'components/scripts/footer/jquery.scrollmagic.min.js',
  'components/scripts/footer/modal.js',
  'components/scripts/footer/footerscript.js'

];

jsHeaderSources = [
  'node_modules/components-webfontloader/webfont.js',
  'components/scripts/header/headerscript.js',
  'components/scripts/header/hubspotforms.js' //comment out this line when deploying to hubspot
];

phpSources = ['builds/development/*.php','builds/development/*/*.php'];

sassSources = ['components/sass/ccclandstyle.scss'];
htmlSources = [outputDir + '*.html'];

gulp.task('browser-sync', function() {
    browserSync({
        proxy: "projects.dev"
    });
});

gulp.task('jsFooter', function() {
  return gulp.src(jsFooterSources)
    .pipe(concat('footerscript.js'))
    .pipe(browserify())
    .on('error', gutil.log)
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(gulp.dest(outputDir + 'js'));
});

gulp.task('jsHeader', function() {
  return gulp.src(jsHeaderSources)
    .pipe(concat('headerscript.js'))
    .pipe(browserify())
    .on('error', gutil.log)
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(gulp.dest(outputDir + 'js'));
});

gulp.task('compass', function() {
  gulp.src(sassSources)
    .pipe(compass({
      project_path: "./",
      sass: 'components/sass/',
      logging: true,
      css: outputDir + 'css',
      image: outputDir + 'images',
      style: sassStyle,
      require: ['susy', 'breakpoint']
    })
    .on('error', gutil.log))
    //.pipe(gulp.dest( outputDir + 'css'))
    .pipe(reload({stream:true}));
});

gulp.task('watch', function() {
  gulp.watch(jsFooterSources, ['jsFooter',browserSync.reload]);
  gulp.watch(jsHeaderSources, ['jsHeader',browserSync.reload]);
  gulp.watch(['components/sass/*.scss', 'components/sass/*/*.scss'], ['compass']);
  gulp.watch(phpSources, [browserSync.reload]);
});

//copy php files to production
gulp.task('movephp', function() {
gulp.src('builds/development/*.php')
.pipe(gulpif(env === 'production', gulp.dest(outputDir)));
gulp.src('builds/development/inc/*.php')
.pipe(gulpif(env === 'production', gulp.dest(outputDir+ 'inc')));
});

// Copy images to production
gulp.task('move', function() {
  gulp.src('builds/development/images/**/*.*')
  .pipe(gulpif(env === 'production', gulp.dest(outputDir+'images')));
});

// Copy svgs to production
gulp.task('movesvg', function() {
  gulp.src('builds/development/svg/**/*.*')
  .pipe(gulpif(env === 'production', gulp.dest(outputDir+'svg')));
});

gulp.task('default', ['watch', 'html', 'jsFooter', 'jsHeader','compass', 'move', 'movephp', , 'movesvg', 'browser-sync']);
