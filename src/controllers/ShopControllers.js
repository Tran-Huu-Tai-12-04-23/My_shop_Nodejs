const OrderedDb = require("../model/Ordered");
const utilsConvertoObject = require("../util/covertoObject");

const ShopControllers = {
  storeOrderedOfShop(req, res) {
    OrderedDb.find({ authorProduct: req.session.idUser })
      .populate("productID")
      .then((item) => {
        return res.render("shop/storeCart", {
          listItems: utilsConvertoObject.mutilyToObject(item),
        });
      })
      .catch((err) => res.send(err));
  },
};

module.exports = ShopControllers;
