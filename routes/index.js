const express = require("express"),
      router = express.Router();

//Landing page route "Home"
router.get("/", (req, res) => {
  res.render("getHome");
});

//Location route
router.get("/location", (req, res) => {
  res.render("getLocation");
});

//Gallery route
router.get("/gallery", (req, res) => {
  res.render("getGallery");
});

//Sustainability route
router.get("/sustainability", (req, res) => {
  res.render("getSustainability");
});

module.exports = router;