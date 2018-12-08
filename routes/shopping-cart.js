const express = require("express"),
      router = express.Router(),
      MenuItem = require("../models/menuitem"),
      Order = require("../models/order"),
      Cart = require("../models/cart"),
      stripeKey = require('../config/keys.js').stripeURI;
      stripe = require("stripe")(stripeKey);

//show shopping cart
router.get("/shopping-cart", (req, res) => {
  if (!req.session.cart) {
    return res.render("getShoppingCart", {products: null});
  }
  let cart = new Cart(req.session.cart);
  res.render("getShoppingCart", {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

//show check out screen with form
router.get("/checkout", (req, res) => {
  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  }
  let cart = new Cart(req.session.cart);
  res.render("checkout", {total: cart.totalPrice});
});

//process checkout and charge with stripe logic
router.post("/checkout", (req, res) => {
  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  }
  let token = req.body.guest.stripeToken;
  let amount = req.session.cart.totalPrice * 100;
  let fixedAmount = +amount.toFixed(2);

  stripe.charges.create({
    amount: fixedAmount,
    currency: 'usd',
    description: 'Majestic Mushroom',
    source: token,
    receipt_email: req.body.guest.email,
  }, (err, charge) => {
    if (err) {
      console.log(err);
    } else {
      let order = {
        guestName: req.body.guest.name,
        guestEmail: req.body.guest.email,
        guestPhone: req.body.guest.phone,
        orderTotal: req.session.cart.totalPrice,
        order: req.session.cart,
        paid: true,
        made: false,
        chargeId: charge.id
      }
      Order.create(order, (err, newOrder) => {
        if (err) {
          console.log(err);
        } else {
          req.session.cart = null;
          res.render("getSuccess");
        }
      });
    }
  });
});

//add to cart route
router.get("/add-to-cart/:id", (req, res) => {
  let itemId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});

  MenuItem.findById(itemId, (err, item) => {
    if (err) {
      console.log(err);
      return res.redirect("/menu");
    } else {
      cart.add(item, item.id);
      req.session.cart = cart;
      // console.log(req.session.cart);
      res.redirect("/menu");
    }
  });
});

//reduce by one route
router.get("/reduce/:id", (req, res) => {
  let itemId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(itemId);
  req.session.cart = cart;
  res.redirect("/shopping-cart");
});

//remove item route
router.get("/remove/:id", (req, res) => {
  let itemId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(itemId);
  req.session.cart = cart;
  res.redirect("/shopping-cart");
});

module.exports = router;