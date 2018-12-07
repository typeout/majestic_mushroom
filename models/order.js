const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  guestName: String,
  guestEmail: String,
  guestPhone: String,
  orderTotal: Number,
  orderDate: { type: Date, default: Date.now },
  order: Object,
  paid: Boolean,
  made: Boolean,
  chargeId: String
});

module.exports = mongoose.model("Order", orderSchema);