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


// Get all the slider from dom and attach a Slider to it
function SlideController(){
  var sliders = document.getElementsByClassName("slider");
  var slider ;
  for (var i = 0; i < sliders.length; i++) {
    slider = Slider.create(sliders[i]);
    slider.play();
  }
}

// Menu Toggle Controller
var mobileMenu;
function ShowMenu(){
  mobileMenu = document.getElementById("mobileMenu");
  addClass(mobileMenu, "mobile-menu-container--active");
  document.body.style.overflow = "hidden";
}


function MenuController(){
  mobileMenu = document.getElementById("mobileMenu");
  mobileMenu.addEventListener("click", function(e){
    removeClass(e.target, "mobile-menu-container--active");
    document.body.style.overflow = "auto";
  }); 
}

window.onload = function(){
  SlideController();
  MenuController();
};

