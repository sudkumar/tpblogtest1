// Enable the passage of the 'this' object through the JavaScript timers
 
var __nativeST__ = window.setTimeout, __nativeSI__ = window.setInterval;
 
window.setTimeout = function (vCallback, nDelay) {
  var oThis = this, aArgs = Array.prototype.slice.call(arguments, 2);
  return __nativeST__(vCallback instanceof Function ? function () {
    vCallback.apply(oThis, aArgs);
  } : vCallback, nDelay);
};
 
window.setInterval = function (vCallback, nDelay) {
  var oThis = this, aArgs = Array.prototype.slice.call(arguments, 2);
  return __nativeSI__(vCallback instanceof Function ? function () {
    vCallback.apply(oThis, aArgs);
  } : vCallback, nDelay);
};

/*
* The global functions
*/
// add a class or classes (seperated by spaces) to an element
function addClass(e, cN){
  var classes = cN.split(" ");
  for (var i = 0; i < classes.length; i++) {
    e.classList.add(classes[i]);
  }
}

// remove a class or classes (seperated by spaces) from an element
function removeClass(e, cN){
  var classes = cN.split(" ");
  for (var i = 0; i < classes.length; i++) {
    e.classList.remove(classes[i]);
  }
}



/*
* Manage a Slide
*/
// -- Static properties and methods
Slide.states = {
  INACTIVE: 0,
  PREV: 1,
  NEXT: 2,
  ACTIVE: 3,
};

Slide.classes = {
  active: "slider__item--active",
  activeToLeft : "slider__item--active-to-left",
  activeToRight : "slider__item--active-to-right",
  prev: "slider__item--prev",
  prevToRight: "slider__item--prev-to-right",
  next:"slider__item--next",
  nextToLeft:"slider__item--next-to-left"
};


// the constructor method
function Slide(dom){

  // attach the DOM element to the slide
  this.dom = dom;

  // make me the inactive slide
  this.state = Slide.INACTIVE;
}


// -- Instance properties and methods
Slide.prototype = {

  // add the constructor
  constructor : Slide,

  // make me the prev slide
  makePrev: function(){
    this.state = Slide.states.PREV;
    addClass(this.dom, Slide.classes.prev);
  },

  // make me the next slide
  makeNext: function(){
    this.state = Slide.states.NEXT;
    addClass(this.dom, Slide.classes.next);
  },

  // make me the next slide
  makeActive: function(){
    this.state = Slide.states.ACTIVE;
    addClass(this.dom, Slide.classes.active);
  },

  // make me the inactive
  makeInactive: function(){
    this.state = Slide.states.INACTIVE;
    removeClass(this.dom, 
      Slide.classes.active + " " +
      Slide.classes.activeToLeft + " " +
      Slide.classes.activeToRight + " " +
      Slide.classes.prev + " " +
      Slide.classes.prevToRight + " " +
      Slide.classes.next + " " +
      Slide.classes.nextToLeft 
      );
  },

  // slide to right method
  slideRight: function(){
    // check the current state of mine
    switch (this.state) {
      case Slide.states.ACTIVE:
        addClass(this.dom, Slide.classes.activeToRight);
        break;
      case Slide.states.PREV:
        addClass(this.dom, Slide.classes.prevToRight);
        break;
      default:
        console.log("Can't add slide right to sate: "+ this.state);
        break;
    }
  },
  // slide to right method
  slideLeft: function(){
    // check the current state of mine
    switch (this.state) {
      case Slide.states.ACTIVE:
        addClass(this.dom, Slide.classes.activeToLeft);
        break;
      case Slide.states.NEXT:
        addClass(this.dom, Slide.classes.nextToLeft);
        break;
      default:
        console.log("Can't add slide left to sate: "+ this.state);
        break;
    }
  }
};

/*
* Manage the indicators
*/

// The constructor method
function SliderIndicator(_dom, _slider, _slideTo){

  // attach the dom element
  this.dom = _dom;

  // add the parent slider and my index
  this.slider = _slider;
  this.slideTo = _slideTo;
}

// -- Static properties and methods
SliderIndicator.classes = {
  init: "indicator indicator--circle",
  active: "indicator--active"
};

SliderIndicator.create = function(_slider, _slideTo){
  // now append the indicator to the container
  var sliderIndicatorDom = document.createElement("button");
  addClass(sliderIndicatorDom, "indicator indicator--circle");

  // create the slider indicator object and attach it to dom
  sliderIndicator = new SliderIndicator(sliderIndicatorDom, _slider, _slideTo);
  
  // add the onclick event listener to dom pass the event handler
  sliderIndicatorDom.addEventListener("click", sliderIndicator, false);

  return sliderIndicator;
}

// -- Instance properties and methods
SliderIndicator.prototype = {

  // the constructor function
  constructor : SliderIndicator,

  // make me the active indicator
  makeActive: function(){
    addClass(this.dom, SliderIndicator.classes.active);
  },

  // make me the inactive indicator
  makeInactive: function(){
    removeClass(this.dom, SliderIndicator.classes.active);
  },

  // handle events on button, clicks
  handleEvent: function(e){
    switch(e.type){
      case "click":
        this.slider.goToSlide(this.slider.activeSlide, this.slideTo);
        break;
      default:
        console.log('Unhandled event: '+ e.type);
        break;
    }
  }
};

/*
* Manage the slider controller
*/

// -- contructor function
function SliderController(_dom, _slider, _type){
  this.dom = _dom;
  this.slider = _slider;
  this.type = _type;
  // add the click event listener to dom
  _dom.addEventListener("click", this);
}

// -- Static properties and methods
SliderController.types = {
  LEFT: 1,
  RIGHT: 2
};

// -- Instance methods
SliderController.prototype = {

  // add the constructor
  constructor: SliderController,

  // handle the click event
  handleEvent: function(event){
    switch(event.type){
      case "click":
        if(this.type == SliderController.types.LEFT){
          // get the previous slide
          this.slider.prev();
        }else if(this.type == SliderController.types.RIGHT){
          // get the next slide
          this.slider.next();
        }else{
          console.log('Unkown type of slider controller: '+ this.type);
        }
        break;
      default:
        console.log('Unhandles event: '+ event.type);
        break;
    }
  }
};


/*
* Manage the slider
*/
// constructor for the slider
function Slider(dom){
  this.dom = dom;
  this.slides = [];
  this.indicators = [];
  this.controllers = [];
  this.activeSlide = 0;
  this.totalSlides = 0;
  this.slideDuration = 600;
  this.slideInterval = 5000;
  this.timer = undefined;
  this.state = Slider.states.STOP;
}


// -- Static properties and methods

// state of the slider
Slider.states = {
  STOP: 1,
  PAUSE: 12,
  PLAY: 3
},

// method to create a slider 
Slider.create = function(dom){
  var slider = new Slider(dom);
  // add the hover events to slider
  dom.addEventListener("mouseenter", slider);
  dom.addEventListener("mouseleave", slider);

  // get the slides from the dom
  var slides = dom.getElementsByClassName("slider__item");
  
  // add the slides to the slider
  var slide;
  for (var i = 0; i < slides.length; i++) {
    slide = new Slide(slides[i]);
    slider.slides.push(slide);
  }

  // make the first slide active
  slider.slides[0].makeActive();

  slider.totalSlides = slider.slides.length;

  var dataSet = dom.dataset;
  // add the indicator if set
  if(dataSet.addIndicator != "false"){
    var sliderIndicatorContainer = document.createElement("div");
    addClass(sliderIndicatorContainer, "slider__indicator");
    // add the slider indicator to the container dom
    var sliderIndicator; 
    for (var i = 0; i < slides.length; i++) {
      // create a new slider indicator, passing the slider and its index
      sliderIndicator = SliderIndicator.create(slider, i);

      // add this to slider indicator
      slider.indicators.push(sliderIndicator);

      // append the dom to slider container
      sliderIndicatorContainer.appendChild(sliderIndicator.dom);
    }
    // make the first indicator active
    slider.indicators[0].makeActive();

    // apppend the slider indicator container to slider
    slider.dom.appendChild(sliderIndicatorContainer);
  }

  // add the slider controller to slider
  var sliderController;
  var leftSlideArrow = dom.getElementsByClassName("slider__arrow--left");
  sliderController = new SliderController(leftSlideArrow[0], slider, SliderController.types.LEFT);
  slider.controllers.push(sliderController);
  var rightSlideArrow = dom.getElementsByClassName("slider__arrow--right");
  sliderController = new SliderController(rightSlideArrow[0], slider, SliderController.types.RIGHT);
  slider.controllers.push(sliderController);

  // if slide interval time is set
  if(dataSet.slideInterval){
    slider.slideInterval = parseInt(dataSet.slideInterval);
  }

  // if slide duration time is set
  if(dataSet.slideDuration){
    slider.slideDuration = parseInt(dataSet.slideDuration);
  }

  return slider;
}
// -- Instance properties and methods
Slider.prototype = {
  // add the constructor
  constructor : Slider,

  // pause the slide show
  pause: function(){
    if(this.state == Slide.states.PLAY){
      this.state = Slider.states.PAUSE;
      clearInterval(this.timer);
    }
  },

  // resume the slide show
  resume: function(){
    if(this.state == Slider.states.PAUSE){
      this.play();
    }
  },

  // play the slide show
  play: function(){
    this.state = Slider.states.PLAY;
    this.timer = setInterval.call(this, this.next, this.slideInterval);
  },

  // stop the slide show
  stop: function(){
    this.state = Slider.states.STOP;
    clearInterval(this.timer);
  },

  // reset the slide and indicator, make _from to inactive and _to to active 
  reset: function(_from, _to){
    this.indicators[_to].makeActive();
    this.slides[_from].makeInactive();
    this.slides[_to].makeInactive();
    this.slides[_to].makeActive();
    this.activeSlide = _to;
  },

  // go to ith slide
  goToSlide: function(_from, _to){
    if(_to > _from){
      // animate from right to left side
      this.slides[_to].makeNext();
      this.indicators[_from].makeInactive();

      // call the setTimeout timer with the current context (this)
      setTimeout.call(this, function(){
        this.slides[_from].slideLeft();
        this.slides[_to].slideLeft();

        //after slide been done, reset 
        setTimeout.call(this, this.reset, this.slideDuration, _from, _to);
      }, 10);

    }else if (_to < _from) {
      // animate to left side
      this.slides[_to].makePrev();
      this.indicators[_from].makeInactive();

      setTimeout.call(this, function(){
        this.slides[_from].slideRight();
        this.slides[_to].slideRight();

        //after slide been done, reset 
        setTimeout.call(this, this.reset, this.slideDuration, _from, _to);
      }, 10);
    }
  },

  // go to next slide
  next : function(){
    var next = (this.activeSlide + 1) % this.totalSlides;
    this.goToSlide(this.activeSlide, next);
  },

  // go to prev slide
  prev : function(){
    var prevIndex = (this.activeSlide - 1) % this.totalSlides;
    prevIndex = prevIndex < 0 ? this.totalSlides-1: prevIndex;
    this.goToSlide(this.activeSlide, prevIndex);
  },

  // handle events
  handleEvent: function(event){
    switch(event.type){
      case "mouseenter":
        // pause the slide show over mouse enter if it's playing
        this.pause();
        break;
      case "mouseleave":
        // start the slide show if it is stopped
        this.resume();
        break; 
      default:
        console.log('Unhandled event: +', event.type);
        break;
    }
  }
};

// Get all the slider from dom and attach a Slider to it
var sliders = document.getElementsByClassName("slider");
var slider ;
for (var i = 0; i < sliders.length; i++) {
  slider = Slider.create(sliders[i]);
  // slider.play();
}
