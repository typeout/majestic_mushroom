const express    = require("express"),
      app        = express(),
      bodyParser = require("body-parser"),
      mongoose   = require("mongoose"),
      methodOverride = require("method-override"),
      passport = require("passport"),
      LocalStrategy = require("passport-local"),
      session = require("express-session"),
      MongoStore = require("connect-mongo")(session),
      middleware = require("./middleware");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static('assets'));
app.use(express.static('semantic'));

// Connecting to mlab mongodb, need to put that url to a keys folder away from the app!
const db = require('./config/keys.js').mongoURI;
mongoose.connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

//Schemas
const User = require("./models/user");

//Routes
const indexRoutes = require("./routes/index"),
      menuRoutes = require("./routes/menu"),
      shoppingCartRoutes = require("./routes/shopping-cart"),
      backendIndexRoutes = require("./routes/backend-index"),
      backendMenuRoutes = require("./routes/backend-menu");

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

//global variables
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.session = req.session;
  next();
});

//Use routes
app.use(indexRoutes);
app.use("/menu", menuRoutes);
app.use(shoppingCartRoutes);
app.use("/backend", backendIndexRoutes);
app.use("/backend/menu", backendMenuRoutes);

middleware.seedUser("admin", "password");

//Starting server, listening for environment port(when deployed) or port 5000
app.listen(process.env.PORT || 5000, () => {
  console.log("Majestic Mushroom server has started...");
});