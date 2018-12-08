const express = require("express"),
      router = express.Router(),
      MenuItem = require("../models/menuitem"),
      middleware = require("../middleware");

//Displays all menu items in the restaurant
router.get("/", middleware.isLoggedIn, (req, res) => {
  MenuItem.find({}, (err, menuItems) => {
    if (err) {
      console.log(err);
      res.render("backend/dashboard");
    } else {
      res.render("backend/getMenu", {menuItems: menuItems});
    }
  })
});

//Displays a form to add a new menu item
router.get("/new", middleware.isLoggedIn, (req, res) => {
  res.render("backend/newMenuItem");
});

//Creates a new menu item
router.post("/", middleware.isLoggedIn, (req, res) => {
  MenuItem.create(req.body.menuItem, (err, newMenuItem) => {
    if (err) {
      console.log(err);
      res.render("backend/newMenuItem", {errMsg: "Failed to create new item."});
    } else {
      res.redirect("/backend/menu");
    }
  });
});

//Displays a menu item by selected id
router.get("/:id", middleware.isLoggedIn, (req, res) => {
  MenuItem.findById(req.params.id, (err, menuItem) => {
    if (err) {
      console.log(err);
      res.redirect("/backend/menu");
    } else {
      res.render("backend/getMenuItem", {menuItem: menuItem, });
    }
  });
});

//Updates a menu item by selected id
router.put("/:id", middleware.isLoggedIn, (req, res) => {
  MenuItem.findByIdAndUpdate(req.params.id, req.body.menuItem, (err, menuItem) => {
    if (err) {
      console.log(err);
      res.render("backend/getMenuItem", {menuItem: menuItem, errMsg: "Couldn't update menu item."});
    } else {
      MenuItem.findById(menuItem._id, (err, updatedMenuItem) => {
        if (err) {
          console.log(err);
          res.render("backend/getMenuItem", {menuItem: menuItem, errMsg: "Couldn't update menu item."});
        } else {
          res.render("backend/getMenuItem", {menuItem: updatedMenuItem, successMsg: "Item successfully updated."});
        }
      });
    }
  })
});

//deletes menu item by selected id
router.delete("/:id", middleware.isLoggedIn, (req, res) => {
  MenuItem.findByIdAndRemove(req.params.id, err => {
    if (err) {
      console.log(err);
      res.redirect("/backend/menu");
    } else {
      res.redirect("/backend/menu");
    }
  });
});

module.exports = router;