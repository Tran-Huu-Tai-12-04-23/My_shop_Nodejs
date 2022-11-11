const userDB = require("../model/users");
const productsDB = require("../model/products");
const utilsConvertoObject = require("../util/covertoObject");
const cartStoreDB = require("../model/cartStore");

const CartController = {
  //[get] cart/store/
  getAllCartStore(req, res) {
    cartStoreDB.find({ userAddID: req.session.idUser }, (err, carts) => {
      if (err) return res.send(err);
      const dataCartAdded = carts.map((item) => item.productID);
      const listItems = cartStoreDB
        .find({
          productID: { $in: dataCartAdded },
          userAddID: req.session.idUser,
        })
        .populate("productID"); //get productIDs have id in cartStoreDB
      const countCart = cartStoreDB.countDocuments({
        userAddID: req.session.idUser,
      });

      Promise.all([listItems, countCart])
        .then(([listItems, countCart]) => {
          var sumTotals = 0;
          listItems.forEach((item) => {
            sumTotals += item.amount * item.productID.cost;
          });
          return res.render("product/storeCarts", {
            listItems: utilsConvertoObject.mutilyToObject(listItems),
            countCart,
            sumTotals,
          });
        })
        .catch((err) => {
          return res.send(err);
        });
    });
  },
  //[put] /cart/store/:id/:amount mutily item to ordered
  putMutilyProductInCart(req, res) {
    cartStoreDB.findOne(
      { productID: req.params.id, userAddID: req.session.idUser },
      (err, cart) => {
        if (err) return res.send(err);
        if (!cart) {
          const newCart = {
            productID: req.params.id,
            userAddID: req.session.idUser,
            amount: req.params.amount,
          };
          const newProductAdded = new cartStoreDB(newCart);
          newProductAdded.save();
          console.log("add new complete");
          return res.redirect("/");
        } else {
          const newcart = {
            productID: req.params.id,
            userAddID: req.session.idUser,
            amount: cart.amount + req.params.amount,
          };
          cartStoreDB.findOneAndUpdate(
            { productID: req.params.id, userAddID: req.session.idUser },
            { amount: cart.amount + 1 },
            (err, cart) => {
              if (err) return res.send(err);
              return res.redirect("/user/cart/store");
            }
          );
        }
      }
    );

    // return res.redirect("/");
  },
  //[put] /cart/store/:idsingle item to ordered
  putProductInCart(req, res) {
    cartStoreDB
      .findOne({ productID: req.params.id, userAddID: req.session.idUser })
      .then((item) => {
        if (item) {
          const newCart = {
            productID: req.params.id,
            userAddID: req.session.idUser,
            amount: item.amount + 1,
          };
          cartStoreDB
            .updateOne(
              { productID: req.params.id, userAddID: req.session.idUser },
              newCart
            )
            .then((data) => {
              return res.redirect("/user/cart/store");
            })
            .catch((err) => res.send(err));
        }
      })
      .catch((err) => res.send(err));
    // return res.redirect("/");
  },

  //[delete ] user/cart/store/delete/:id
  deleteItem(req, res) {
    cartStoreDB
      .findOne({ productID: req.params.id, userAddID: req.session.idUser })
      .then((item) => {
        if (item.amount == 1) {
          console.log("remove");
          cartStoreDB
            .deleteOne({
              productID: req.params.id,
              userAddID: req.session.idUser,
            })
            .then((x) => res.redirect("/user/cart/store"))
            .catch((err) => res.send(err));
        } else {
          console.log("update");
          cartStoreDB
            .updateOne(
              { productID: req.params.id, userAddID: req.session.idUser },
              { amount: item.amount - 1 }
            )
            .then((x) => res.redirect("/user/cart/store"))
            .catch((err) => res.send(err));
        }
      })
      .catch((err) => res.send(err));
  },

  // destroy user/cart/store/destroy/:id
  destroyItem: (req, res) => {
    cartStoreDB
      .deleteOne({
        productID: req.params.id,
        userAddID: req.session.idUser,
      })
      .then((item) => {
        res.redirect("/user/cart/store");
      })
      .catch((err) => res.send(err));
  },
};

module.exports = CartController;
