const express    = require("express"),
      app        = express(),
      bodyParser = require("body-parser"),
      mongoose   = require("mongoose");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('assets'));

// Connecting to mlab mongodb, need to put that url to a keys folder away from the app!
mongoose.connect("mongodb://domas:domas666@ds263493.mlab.com:63493/mmushroom", { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// MongoDB menuItem Schema
const menuItemSchema = new mongoose.Schema({
  name: String,
  picture: String,
  description: String,
  price: Number,
  menu: String,
  calories: Number,
  alergens: String
});
let MenuItem = mongoose.model("MenuItem", menuItemSchema);

// MenuItem.create(
//     {
//         name: "Buffalo Cauliflower Bites", 
//         picture: "pictures/menu1.png",
//         description: "with ranch dipping sauce",
//         price: 5.95,
//         menu: "Starters, Salads and Sides",
//         calories: 680,
//         alergens: "Peanuts"  
//     },
//     (err, menuItem) => {
//         if(err) {
//             console.log(err);
//         } else {
//             console.log("Menu Item created");
//             console.log(menuItem);
//         }
//     });


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

//Menu route
app.get("/menu", (req, res) => {
  MenuItem.find({}, (err, menuItems) => {
    if(err) {
      console.log(err);
    } else {
      res.render("getMenu", {menuItems: menuItems});
    }
  }); 
});

//Checkout routes
app.get("/checkout", (req, res) => {
  res.render("checkout");
});

app.post("/checkout", (req, res) => {
  res.render("checkout");
});



//Starting server, listening for environment port(when deployed) or port 5000
app.listen(process.env.PORT || 5000, () => {
  console.log("Majestic Mushroom server has started...");
});