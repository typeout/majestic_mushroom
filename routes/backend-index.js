const express = require("express"),
      router = express.Router(),
      passport = require("passport"),
      middleware = require("../middleware");

//dashboard route
router.get("/", middleware.isLoggedIn, (req, res) => {
  res.redirect("backend/menu");
});

//login form
router.get("/login", (req, res) => {
  res.render("backend/login");
});

//login route
router.post("/login", passport.authenticate("local", 
  {
      successRedirect: "/backend",
      failureRedirect: "/backend/login"
  }), (req, res) => {
});

//logout route
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/backend/login");
})

module.exports = router;