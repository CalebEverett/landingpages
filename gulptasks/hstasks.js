//Hubspotify files
  gulp.task('hubspotify', function(){
    //html files - this doesn't work for multiple files
    gulp.src(['components/hubspot/htmlhead.html', outputDir + 'index.html'])
    .pipe(concat(hubspotFile + '.html'))
    .pipe(cheerio({run: function ($, file) {
      $('title').replaceWith('<title>{{ page_meta.html_title }}</title>'),
      $('meta[name=author]').attr('content', '{{ page_meta.meta_author }}'),
      $('meta[name=description]').attr('content', '{{ page_meta.meta_description }}'),
      $('#favicon').attr('href', '{{ site_settings.favicon_src }}'),
      $('.hsform').replaceWith('{% form "form module name" label="Sample form" %}')
      },parserOptions:{decodeEntities: false, xmlMode: false,}
      }))
    .pipe(replace('images/', hubspotFile + '/images/'))
    .pipe(replace('css/ccclandstyle.css', '{{ get_public_template_url("custom/page/css/ccclandstyle.css") }}'))
    .pipe(replace('js/headerscript.js', '{{ get_public_template_url("custom/page/js/headerscript.js") }}'))
    .pipe(replace('js/footerscript.js', '{{ get_public_template_url("custom/page/js/footerscript.js") }}'))
    .pipe(replace('<!--hsheaderincludes-->', '{{ standard_header_includes }}'))
    .pipe(replace('<!--hsfooterincludes-->', '{{ standard_footer_includes }}'))
    .pipe(gulp.dest(hubspotDir + 'templates/' + hubspotFile ));
    gulp.src(['components/hubspot/csshead.css', outputDir + 'css/ccclandstyle.css'])
    .pipe(concat('ccclandstyle.css'))
    .pipe(replace('/images/accet.png', 'http://cdn2.hubspot.net/hub/164638/file-2480610107-png/cccland/images/accet.png'))
    .pipe(replace('/images/bppe.png', 'http://cdn2.hubspot.net/hub/164638/file-2473865141-png/cccland/images/bppe.png'))
    .pipe(replace('/images/ed.png', 'http://cdn2.hubspot.net/hub/164638/file-2473926666-png/cccland/images/ed.png'))
    .pipe(replace('/images/favicon.png', 'http://cdn2.hubspot.net/hub/164638/file-2480633432-ico/cccland/images/favicon.ico'))
    .pipe(replace('/images/hayley.jpg', 'http://cdn2.hubspot.net/hub/164638/file-2480300020-jpg/cccland/images/hayley.jpg'))
    .pipe(replace('/images/JosephHero.jpg', 'http://cdn2.hubspot.net/hub/164638/file-2481161664-jpg/cccland/images/JosephHero.jpg'))
    .pipe(replace('/images/victoria.jpg', 'http://cdn2.hubspot.net/hub/164638/file-2480643302-jpg/cccland/images/victoria.jpg'))
    .pipe(gulp.dest(hubspotDir + 'templates/' + hubspotFile + '/css'));
    gulp.src(['components/hubspot/headhead.js', outputDir + 'js/headerscript.js'])
    .pipe(concat('headerscript.js'))
    .pipe(gulp.dest(hubspotDir + 'templates/' + hubspotFile + '/js'));
    gulp.src(['components/hubspot/foothead.js', outputDir + 'js/footerscript.js'])
    .pipe(concat('footerscript.js'))
    .pipe(gulp.dest(hubspotDir + 'templates/' + hubspotFile + '/js'));
    gulp.src('builds/' + env + '/images/**/*.*')
    .pipe(gulp.dest(hubspotDir + 'files/' + hubspotFile + '/images'));
  });

//re-svg files after hubspotify
gulp.task('hs-svgstore', function () {
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
  .src('builds/hubspot/templates/cccland/cccland.html') //outputDir + 'templates/' + hubspotFile + '/' + hubspotFile + '.html'
  .pipe(inject(svgs, { transform: fileContents }))
  .pipe(gulp.dest('builds/hubspot/templates/cccland/'));
});

//upload to hubspot
gulp.task('cosupload',['hubspotify','hs-svgstore'], shell.task('upload_to_cos --action=upload --hub-id=164638 -t builds/hubspot/  --api-key=[]'));