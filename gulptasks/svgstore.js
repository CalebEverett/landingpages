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
  .src('builds/development/inc/svgs.php')
  .pipe(inject(svgs, { transform: fileContents }))
  .pipe(gulp.dest('builds/development/inc'));
});