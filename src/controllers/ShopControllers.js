const Ordered = require("../model/Ordered");

const ShopControllers = {
  storeOrderedOfShop(req, res) {
    return res.render("shop/storeCart");
  },
};

module.exports = ShopControllers;
