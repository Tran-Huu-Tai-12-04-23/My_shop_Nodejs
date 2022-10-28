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
      const amountItem = carts.map((x) => x.amount);
      const listItems = productsDB.find({ _id: { $in: dataCartAdded } });
      const countCart = cartStoreDB.countDocuments({
        userAddID: userActive.id,
      });
      Promise.all([listItems, countCart])
        .then(([listItems, countCart]) => {
          return res.render("product/storeCarts", {
            listItems: utilsConvertoObject.mutilyToObject(listItems),
            countCart,
          });
        })
        .catch((err) => {
          return res.send(err);
        });
    });
  },
  //[put] cart store
  getProductInCart(req, res) {
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
        }
        const newcart = {
          productID: req.params.id,
          userAddID: userActive.id,
          amount: cart.amount + 1,
        };
        cartStoreDB.findOneAndUpdate(
          { productID: req.params.id },
          { amount: cart.amount + 1 },
          (err, cart) => {
            if (err) return res.send(err);
            return res.redirect("/");
          }
        );
      }
    );

    // return res.redirect("/");
  },

  //[delete ] user/cart/store/delete/:id
  deleteItem(req, res) {
    cartStoreDB
      .deleteOne({ productID: req.params.id, userAddID: userActive.id })
      .then(() => {
        console.log("delete item successfully");
        return res.redirect("/user/cart/store");
      })
      .catch((err) => {
        return res.send(err);
      });
  },
};

module.exports = CartController;
