const userDB = require("../model/users");
const productsDB = require("../model/products");
const utilsConvertoObject = require("../util/covertoObject");
const cartStoreDB = require("../model/cartStore");
const { userActive } = require("./UserControllers");
var countCartStore = 0;
const CartController = {
  //[get] cart/store/
  getAllCartStore(req, res) {
    cartStoreDB.find({ userAddID: userActive.id }, (err, carts) => {
      if (err) return res.send(err);
      const dataCartAdded = carts.map((item) => item.productID);
      const listItems = cartStoreDB
        .find({ productID: { $in: dataCartAdded }, userAddID: userActive.id })
        .populate("productID"); //get productIDs have id in cartStoreDB
      const countCart = cartStoreDB.countDocuments({
        userAddID: userActive.id,
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
  //[put] cart store
  putProductInCart(req, res) {
    cartStoreDB.findOne(
      { productID: req.params.id, userAddID: userActive.id },
      (err, cart) => {
        if (err) return res.send(err);
        if (!cart) {
          const newCart = {
            productID: req.params.id,
            userAddID: userActive.id,
            amount: 1,
          };
          const newProductAdded = new cartStoreDB(newCart);
          newProductAdded.save();
          console.log("add new complete");
          return res.redirect("/");
        } else {
          const newcart = {
            productID: req.params.id,
            userAddID: userActive.id,
            amount: cart.amount + 1,
          };
          cartStoreDB.findOneAndUpdate(
            { productID: req.params.id, userAddID: userActive.id },
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

  //[delete ] user/cart/store/delete/:id
  deleteItem(req, res) {
    cartStoreDB
      .findOne({ productID: req.params.id, userAddID: userActive.id })
      .then((item) => {
        if (item.amount == 1) {
          console.log("remove");
          cartStoreDB
            .deleteOne({
              productID: req.params.id,
              userAddID: userActive.id,
            })
            .then((x) => res.redirect("/user/cart/store"))
            .catch((err) => res.send(err));
        } else {
          console.log("update");
          cartStoreDB
            .updateOne(
              { productID: req.params.id, userAddID: userActive.id },
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
        userAddID: userActive.id,
      })
      .then((item) => {
        res.redirect("/user/cart/store");
      })
      .catch((err) => res.send(err));
  },
};

module.exports = CartController;
