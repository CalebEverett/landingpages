//show page loader while page loads
$(window).load(function() {
    // Animate loader off screen
    $(".loader").fadeOut("slow");
  });

$(function() {

//screensize breakpoints
var narrow = 400,
    small = 600,
    medium = 960,
    wide = 1200;

//window height
  var wheight = $(window).height()-$('#nav').height(); //get height of the window

  $('.fullheight').css('height', wheight);

  $(window).resize(function() {
    var wheight = $(window).height()-$('#nav').height(); //get height of the window
    $('.fullheight').css('height', wheight);
  }); //on resize

  //window width
  var wwidth = $(window).width(); //get width of the window

  $(window).resize(function() {
    var wwidth = $(window).width(); //get width of the window
  }); //on resize

    //animate intro call to action
    var t1 = new TimelineMax();

    if(wwidth <= small) {

      t1.from(".introcta", 0.5, {opacity:0,delay:1.0})
      .from(".introcta", 1.5, {marginBottom: wheight-$('.titletext').height()-$('.introcta').height(),ease: Bounce.easeOut})
      .from("#handarrow", 1.0, {fill:'#1270C8',repeat:-1,yoyo:true});
    }

    else if (wwidth > small) {
      t1.from(".introcta", 0.5, {opacity:0,delay:0.5})
      .from(".introtext", 0.5, {opacity:0,delay:-.25})
      .from("#handarrow", 0.5, {opacity:0,delay:-.25})
      .from(".introtext", 1.5, {marginRight: wwidth/2, ease:Bounce.easeOut})
      .from("#handarrow", 1.0, {fill:'#1270C8',repeat:-1,yoyo:true});
    }

   //set up ScrollMagic
  var controller = new ScrollMagic({
    globalSceneOptions: {
      triggerHook: "onLeave"
    }
  });

  //pin the navigation
  var pin = new ScrollScene({
    triggerElement: '#nav',
  }).setPin('#nav').addTo(controller);

//smooth scrolling
$(function() {
  $('a[href*=#]:not([href*=#modal])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top-$('#nav').height()
        }, 800);
        return false;
      }
    }
  });
});

//not a touch device
  var isTouch = 'ontouchstart' in document.documentElement;
  if(!isTouch){

    //animate strong text
    $('strong').each(function(){
      var currentStrong = $(this);

      var tweenStrong = new TimelineMax()
      .from(currentStrong, 0.25, {fontWeight: 300})
      .to(currentStrong, 0.25, {textShadow:"5px 0px 10px yellow, 0px 5px 10px yellow, -5px 0px 10px yellow, 0px -5px 10px yellow"});

      var scene = new ScrollScene({triggerElement: currentStrong, offset: -$(window).height()*0.75})
      .setTween(tweenStrong)
      .addTo(controller);

    });//animate strong text

    //animate testimonials
    $('.testimonial').each(function(){
      var currentTest = $(this);

      var testOrigin = {
        repeat: 0,
        yoyo: false,
        bottom: 0,
        opacity: 0.5,
        scale: 0.5,
        ease: Back.easeOut
      }

      var tweenTest = new TimelineMax()
      .staggerFrom(currentTest, 0.5, testOrigin, 0.25);

      var scene = new ScrollScene({triggerElement: currentTest, offset: -$(window).height()*0.75})
      .setTween(tweenTest)
      .addTo(controller);

    });//animate testimonials

  }//not a touch device

}); //on load