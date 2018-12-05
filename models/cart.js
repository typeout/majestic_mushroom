module.exports = function Cart(oldCart) {
  this.items = oldCart.items || {};
  this.totalQty = oldCart.totalQty || 0;
  this.totalPrice = oldCart.totalPrice || 0;

  this.add = function(item, id) {
    let storedItem = this.items[id];
    if (!storedItem) {
      storedItem = this.items[id] = {item: item, qty: 0, price: 0};
    }
    storedItem.qty++;
    storedItem.price = storedItem.item.price * storedItem.qty;
    let fixedStored = +storedItem.price.toFixed(2);
    storedItem.price = fixedStored;
    this.totalQty++;
    this.totalPrice += storedItem.item.price;
    let fixedTotal = +this.totalPrice.toFixed(2);
    this.totalPrice = fixedTotal;
  };

  this.generateArray = function () {
    let arr = [];
    for (let id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  };

};