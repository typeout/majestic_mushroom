const express    = require("express"),
      app        = express(),
      bodyParser = require("body-parser"),
      mongoose   = require("mongoose"),
      methodOverride = require("method-override"),
      passport = require("passport"),
      LocalStrategy = require("passport-local"),
      session = require("express-session"),
      MongoStore = require("connect-mongo")(session),
      stripe = require("stripe")("sk_test_SQZ5t7HgfPBB2Hk3BEeMPIxV");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static('assets'));
app.use(express.static('semantic'));

// Connecting to mlab mongodb, need to put that url to a keys folder away from the app!
mongoose.connect("mongodb://domas:domas666@ds263493.mlab.com:63493/mmushroom", { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

//DB Schemas
const MenuItem = require("./models/menuitem");
const User = require("./models/user");
const Order = require("./models/order");

//cart object
const Cart = require("./models/cart");

//Passport and session
app.use(session({
  secret: "geri vyrai geroj girioj gera gira gerai gere",
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 180 * 60 * 1000 }
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.session = req.session;
  next();
});

//seedUser("Domas", "domas");
function seedUser(username, password) {
  User.register(new User({username: username}), password, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      console.log("user " + username + " seeded...");
    }
  });
}



//Landing page route "Home"
app.get("/", (req, res) => {
  res.render("getHome");
});

//Location route
app.get("/location", (req, res) => {
  res.render("getLocation");
});

//Gallery route
app.get("/gallery", (req, res) => {
  res.render("getGallery");
});

//Sustainability route
app.get("/sustainability", (req, res) => {
  res.render("getSustainability");
});

//Menu routes
//Displays the initial menu
app.get("/menu", (req, res) => {
  MenuItem.find({menu: "Starters, Salads and Sides"}, (err, menuItems) => {
    if(err) {
      console.log(err);
    } else {
      res.render("getMenu", {menuItems: menuItems});
    }
  }); 
});

//Displays a submenu by selected submenu
app.get("/menu/:menu", (req, res) => {
  MenuItem.find({menu: req.params.menu}, (err, menus) => {
    if(err) {
      console.log(err);
    } else {
      res.send({menuItems: menus});
    }
  })
});

//Shopping cart routes
app.get("/shopping-cart", (req, res) => {
  if (!req.session.cart) {
    return res.render("getShoppingCart", {products: null});
  }
  let cart = new Cart(req.session.cart);
  res.render("getShoppingCart", {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

app.get("/checkout", (req, res) => {
  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  }
  let cart = new Cart(req.session.cart);
  res.render("checkout", {total: cart.totalPrice});
});

app.post("/checkout", (req, res) => {
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
app.get("/add-to-cart/:id", (req, res) => {
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

//Backend routes
//dashboard route
app.get("/backend", isLoggedIn, (req, res) => {
  res.redirect("backend/menu");
});

//menu routes
//Displays all menu items in the restaurant
app.get("/backend/menu", isLoggedIn, (req, res) => {
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
app.get("/backend/menu/new", isLoggedIn, (req, res) => {
  res.render("backend/newMenuItem");
});

//Creates a new menu item
app.post("/backend/menu", isLoggedIn, (req, res) => {
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
app.get("/backend/menu/:id", isLoggedIn, (req, res) => {
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
app.put("/backend/menu/:id", isLoggedIn, (req, res) => {
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
app.delete("/backend/menu/:id", isLoggedIn, (req, res) => {
  MenuItem.findByIdAndRemove(req.params.id, err => {
    if (err) {
      console.log(err);
      res.redirect("/backend/menu");
    } else {
      res.redirect("/backend/menu");
    }
  });
});

//user authentication
//login form
app.get("/backend/login", (req, res) => {
  res.render("backend/login");
});

//login route
app.post("/backend/login", passport.authenticate("local", 
  {
      successRedirect: "/backend",
      failureRedirect: "/backend/login"
  }), (req, res) => {
});

//logout route
app.get("/backend/logout", (req, res) => {
  req.logout();
  res.redirect("/backend/login");
})


//Authorization middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()){
      return next();
  }
  res.redirect("/backend/login");
}

//Starting server, listening for environment port(when deployed) or port 5000
app.listen(process.env.PORT || 5000, () => {
  console.log("Majestic Mushroom server has started...");
});