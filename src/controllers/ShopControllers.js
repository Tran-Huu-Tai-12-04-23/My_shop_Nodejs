const OrderedDb = require("../model/Ordered");
const utilsConvertoObject = require("../util/covertoObject");
const userOrderedDb = require("../model/UserOrdered");
const { request } = require("express");

const ShopControllers = {
  storeOrderedOfShop(req, res) {
    OrderedDb.find({ authorProduct: req.session.idUser })
      .populate("productID")
      .then((item) => {
        const userName = req.session.userName;
        const idUser = req.session.idUser;
        return res.render("shop/storeCart", {
          listItems: utilsConvertoObject.mutilyToObject(item),
          userName,
          idUser,
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
      .then((deleteOrdered, deleteUserOrdered) => {
        OrderedDb.find({ authorProduct: req.session.idUser })
          .populate("productID")
          .then((restOrdered) => {
            req.session.shopStore = { ...restOrdered };
            return res.redirect("/shop/store/ordered");
          })
          .catch((err) => res.send(err));
      })
      .catch((err) => res.send(err));
  },
};

module.exports = ShopControllers;
