//comment
$(function() {

$(function() {

//window height
  var wheight = $(window).height()-$('#nav').height(); //get height of the window

  $('.fullheight').css('height', wheight);

  $(window).resize(function() {
    var wheight = $(window).height()-$('#nav').height();; //get height of the window
    $('.fullheight').css('height', wheight);
  }) //on resize

});


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

//not a touch device
  var isTouch = 'ontouchstart' in document.documentElement;
  if(!isTouch){

//animate strong text
$('strong').each(function(){
  var currentStrong = $(this);

  var tweenStrong = new TimelineMax()
  .from(currentStrong, 0.25, {css: {fontWeight: 300}});

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