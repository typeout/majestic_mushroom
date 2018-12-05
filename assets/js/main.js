//Navbar Hamburger onClick fade in/out drop down menu
$('.hamburger').on("click",function(e){
  e.preventDefault();
   $('.nav').transition('fade down');
});

//dropdowns
$('.dropdown').dropdown();