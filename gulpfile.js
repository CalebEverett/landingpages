var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    cheerio = require('gulp-cheerio'),
    compass = require('gulp-compass'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    gutil = require('gulp-util'),
    inject = require('gulp-inject'),
    minifyHTML = require('gulp-minify-html'),
    path = require('path'),
    replace = require('gulp-replace'),
    svgmin = require('gulp-svgmin'),
    svgstore = require('gulp-svgstore'),
    uglify = require('gulp-uglify');


var env,
    jsSources,
    sassSources,
    htmlSources,
    outputDir,
    outputDir,
    sassStyle,
    hubspotDir = 'builds/hubspot/';
    hubspotFile = 'cccland' //used for .html file and for hubspot folders

env = 'development';

if (env==='development') {
  outputDir = 'builds/development/';
  sassStyle = 'expanded';
} else {
  outputDir = 'builds/production/';
  sassStyle = 'compact';
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
  'components/scripts/header/hubspotforms.js'
];

sassSources = ['components/sass/ccclandstyle.scss'];
htmlSources = [outputDir + '*.html'];

gulp.task('jsFooter', function() {
  gulp.src(jsFooterSources)
    .pipe(concat('footerscript.js'))
    .pipe(browserify())
    .on('error', gutil.log)
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(gulp.dest(outputDir + 'js'))
    .pipe(connect.reload())
});

gulp.task('jsHeader', function() {
  gulp.src(jsHeaderSources)
    .pipe(concat('headerscript.js'))
    .pipe(browserify())
    .on('error', gutil.log)
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(gulp.dest(outputDir + 'js'))
    .pipe(connect.reload())
});

gulp.task('compass', function() {
  gulp.src(sassSources)
    .pipe(compass({
      sass: 'components/sass',
      logging: true,
      css: outputDir + 'css',
      image: outputDir + 'images',
      style: sassStyle,
      require: ['susy', 'breakpoint']
    })
    .on('error', gutil.log))
//    .pipe(gulp.dest( outputDir + 'css'))
    .pipe(connect.reload())
});

gulp.task('svgstore', function () {
  var svgs = gulp
  .src('builds/development/svg/*.svg')
  .pipe(svgmin())
  .pipe(svgstore({ inlineSvg: true }))
  .pipe(cheerio(function ($) {
    $('svg').attr('style', 'display:none');
  }));

  function fileContents (filePath, file) {
    return file.contents.toString();
  }

  return gulp
  .src('builds/development/index.html')
  .pipe(inject(svgs, { transform: fileContents }))
  .pipe(gulp.dest('builds/development'));
});
gulp

gulp.task('watch', function() {
  gulp.watch(jsFooterSources, ['jsFooter']);
  gulp.watch(jsHeaderSources, ['jsHeader']);
  gulp.watch(['components/sass/*.scss', 'components/sass/*/*.scss'], ['compass']);
  gulp.watch('builds/development/svg/*.svg', ['svgstore']);
  gulp.watch('builds/development/*.html', ['html']);
});

gulp.task('connect', function() {
  connect.server({
    root: outputDir,
    livereload: true
  });
});

gulp.task('html', function() {
  gulp.src('builds/development/*.html')
    .pipe(gulpif(env === 'production', minifyHTML()))
    .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
    .pipe(connect.reload())
});

// Copy images to production
gulp.task('move', function() {
  gulp.src('builds/development/images/**/*.*')
  .pipe(gulpif(env === 'production', gulp.dest(outputDir+'images')))
});

//Hubspotify files
  gulp.task('hubspotify', function(){
    gulp.src(['components/hubspot/htmlhead.html', outputDir + 'index.html'])
    .pipe(concat(hubspotFile + '.html'))
    .pipe(cheerio(function ($, file) {
      $('meta[name=author]').attr('content', '{{ page_meta.meta_author }}'),
      $('meta[name=description]').attr('content', '{{ page_meta.meta_description }}'),
      $('link[rel=shortcut]').attr('href', '{{ site_settings.favicon_src }}')
      }))
    .pipe(replace('hubspot', 'HubSpot'))
    .pipe(replace('<!--hsheaderincludes-->', '{{ standard_header_includes }}'))
    .pipe(replace('<!--hsfooterincludes-->', '{{ standard_footer_includes }}'))
    .pipe(gulp.dest(hubspotDir + 'files/' + hubspotFile + '/templates'));
    gulp.src(['components/hubspot/csshead.txt', outputDir + 'css/ccclandstyle.css'])
    .pipe(concat('ccclandstyle.css'))
    .pipe(replace('hubspot', 'HubSpot'))
    .pipe(gulp.dest(hubspotDir + 'files/' + hubspotFile + '/css'));
    gulp.src(['components/hubspot/headhead.js', outputDir + 'js/headerscript.js'])
    .pipe(concat('headerscript.js'))
    .pipe(replace('hubspot', 'HubSpot'))
    .pipe(gulp.dest(hubspotDir + 'files/' + hubspotFile + '/js'));
    gulp.src(['components/hubspot/foothead.js', outputDir + 'js/footerscript.js'])
    .pipe(concat('footerscript.js'))
    .pipe(replace('hubspot', 'HubSpot'))
    .pipe(gulp.dest(hubspotDir + 'files/' + hubspotFile + '/js'));
    gulp.src('builds/' + env + '/images/**/*.*')
    .pipe(gulp.dest(hubspotDir + 'files/' + hubspotFile + '/images'));
  });

gulp.task('default', ['watch', 'svgstore', 'html', 'jsFooter', 'jsHeader','compass', 'move', 'connect']);
