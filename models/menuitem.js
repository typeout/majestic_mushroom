const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name: String,
  picture: String,
  description: String,
  price: Number,
  menu: String,
  calories: Number,
  alergens: String
});

module.exports = mongoose.model("MenuItem", menuItemSchema);