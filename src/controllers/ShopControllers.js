const OrderedDb = require("../model/Ordered");
const utilsConvertoObject = require("../util/covertoObject");
const userOrderedDb = require("../model/UserOrdered");

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
  updateStatusOrdered(req, res) {
    OrderedDb.updateOne({ _id: req.params.id }, { status: "preparing " })
      .then((data) => {
        console.log(data);
        res.redirect("/shop/store/ordered");
      })
      .catch((err) => res.send(err));
  },
  cancleOrdered(req, res) {
    const deleteOrdered = OrderedDb.deleteOne({ _id: req.params.id });
    const deleteUserOrdered = userOrderedDb.deleteOne({
      userOrdered: req.params.idUserOrdered,
    });
    Promise.all([deleteOrdered, deleteUserOrdered])
      .then((data, data2) => {
        return res.redirect("/shop/store/ordered");
      })
      .catch((err) => res.send(err));
  },
};

module.exports = ShopControllers;
