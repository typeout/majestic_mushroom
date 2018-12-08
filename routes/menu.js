const express = require("express"),
      router = express.Router(),
      MenuItem = require("../models/menuitem");

//Displays the initial menu
router.get("/", (req, res) => {
  MenuItem.find({menu: "Starters, Salads and Sides"}, (err, menuItems) => {
    if(err) {
      console.log(err);
    } else {
      res.render("getMenu", {menuItems: menuItems});
    }
  }); 
});

//Displays a submenu by selected submenu
router.get("/:menu", (req, res) => {
  MenuItem.find({menu: req.params.menu}, (err, menus) => {
    if(err) {
      console.log(err);
    } else {
      res.send({menuItems: menus});
    }
  })
});


module.exports = router;