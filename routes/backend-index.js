const express = require("express"),
      router = express.Router(),
      passport = require("passport"),
      middleware = require("../middleware"),
      Order = require("../models/order");

//dashboard route
router.get("/", middleware.isLoggedIn, (req, res) => {
  Order.find({made: false}, (err, liveOrders) => {
    if (err) {
      console.log(err);
    } else {
      liveOrders.sort((a, b) => { return b.orderDate.getTime() - a.orderDate.getTime(); });
      res.render("backend/dashboard", {liveOrders: liveOrders});
    }
  });
});

//set live orders to complete
router.put("/:id", middleware.isLoggedIn, (req, res) => {
  Order.findByIdAndUpdate(req.params.id, { made: true }, (err, updatedOrder) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/backend");
    }
  });
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