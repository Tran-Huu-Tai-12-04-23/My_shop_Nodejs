const userDB = require("../model/users");
const productsDB = require("../model/products");
const utilsConvertoObject = require("../util/covertoObject");
const ImagesStore = require("../model/ImagesStore");
const fs = require("fs");
const UserOrdered = require("../model/UserOrdered");
const cartStoreDB = require("../model/cartStore");
const OrderedDb = require("../model/Ordered");

var userActive = {
  name: undefined,
  admin: false,
  id: undefined,
};

const UserControllers = {
  getHome(req, res) {
    let search = "";
    if (req.query.search != undefined) {
      search = req.query.search;
    }
    const countCart = cartStoreDB.countDocuments({
      userAddID: req.session.idUser,
    });
    const listProduct = productsDB.find({
      delete: false,
      $or: [{ description: { $regex: search, $options: "i" } }],
    });

    Promise.all([countCart, listProduct])
      .then(([countCart, listProduct]) => {
        const shopStore = req.session.shopStore;
        return res.render("home", {
          countCart,
          products: utilsConvertoObject.mutilyToObject(listProduct),
          shopStore,
        });
      })
      .catch((err) => res.send(err));
  },

  // login and register
  login(req, res) {
    res.render("user/login");
  },
  //logour
  logout(req, res) {
    // return res.send(req.session.acessToken);
    userActive.name = undefined;
    userActive.admin = false;
    userActive.id = undefined;
    req.session.destroy();
    res.clearCookie("refeshToken");
    return res.redirect("/");
  },
  // /login/checklogin
  loginCheck(req, res, next) {
    userDB.findOne({ username: req.body.username }, (err, user) => {
      if (!user) {
        return res.send("login failed, account not found");
      }
      if (err) {
        return res.send("login failed: " + err.message);
      }
      if (user.password === req.body.password) {
        req.session.username = user.username;
        req.session.idUser = user.id;
        req.session.admin = user.admin;
        userActive.name = user.username;
        userActive.id = user.id;
        userActive.admin = user.admin;
        OrderedDb.find({
          authorProduct: req.session.idUser,
        })
          .populate("productID")
          .then((items) => {
            req.session.shopStore = { ...items };
            console.log("Login successful");
            return res.redirect("/");
          })
          .catch((err) => res.send(err));
      } else {
        console.log("Password incorrect!!");
        return res.send("password incorrect");
      }
    });
  },
  showProfile(req, res) {
    return res.render("user/profile");
  },

  register(req, res) {
    res.render("user/register");
  },
  // create a new account
  registerStore(req, res) {
    userDB.findOne({ username: req.body.username }, (err, users) => {
      if (users) {
        return res.send("can't create account , because user already exists");
      } else if (req.body.password !== req.body.confirmpassword) {
        return res.send(
          "can't create account , because confirmpassword incorrect!!!"
        );
      } else {
        const img = fs.readFileSync(req.file.path);
        const encode_image = img.toString("base64");
        const newImages = new ImagesStore({
          nameImage: req.body.username + "_avatar" + ".jpg",
          img: {
            data: Buffer.from(encode_image, "base64"),
            contentType: req.file.mimetype,
          },
        });
        newImages.save();
        const newAccount = new userDB(req.body);
        console.log("create accout success", newAccount);
        newAccount.save();

        return res.redirect("/");
      }
    });
  },
  //get all users
  getAllUsers(req, res) {
    userDB.find({}, (err, user) => {
      const shopStore = req.session.shopStore;
      res.render("user/users", {
        user: utilsConvertoObject.mutilyToObject(user),
        shopStore,
      });
    });
  },

  //delete user /user/account/delete/:id
  deleteAccount(req, res) {
    userDB.findOneAndDelete({ _id: req.params.id, admin: false }, (err, it) => {
      if (err) return res.send(err);
      productsDB.deleteMany({ authorID: it._id }, (err, data) => {
        if (err) return res.send(err);
        console.log("data deleted" + data);
        console.log("check " + it);
        const shopStore = req.session.shopStore;
        return res.redirect("/admin/allusers", {
          shopStore,
        });
      });
    });
  },
  //put user /user/account/edit/:id
  editAccount(req, res) {
    userDB
      .findOne({ _id: req.params.id })
      .then((user) => {
        if (user) {
          return res.render("user/editPass", {
            user: utilsConvertoObject.singleToObject(user),
          });
        } else {
          return res.send("can't find account ");
        }
      })
      .catch((err) => {
        return res.send(err);
      });
  },
  updataPass(req, res) {
    userDB
      .findOne({ _id: req.params.id })
      .then((user) => {
        if (user) {
          console.log(user.password + "===" + req.body.password);
          if (user.password === req.body.password) {
            return req.body.newpassword;
          } else {
            return res.send("password incorrect !!!");
          }
        }
      })
      .then((password) => {
        if (password === req.body.confirmpassword) {
          userDB
            .updateOne(
              { _id: req.params.id },
              {
                password: req.body.newpassword,
              }
            )
            .then((data) => {
              return res.redirect("/");
            })
            .catch((err) => {
              return res.send(err);
            });
        }
      })
      .catch((err) => {
        return res.send(err);
      });
  },
  //[get] view create nnew item of user:id
  createNewItem(req, res) {
    const shopStore = req.session.shopStore;
    res.render("user/createitem", {
      shopStore,
    });
  },
  //[post] create new item of user:id
  storeCreate(req, res) {
    if (
      req.body.linkimage === "" ||
      req.body.name === "" ||
      req.body.cost === "" ||
      req.body.description === ""
    ) {
      return res.send(" : you must enter full filed ");
    }
    productsDB.findOne({ nameproduct: req.body.name }, (err, product) => {
      if (err) {
        return res.send(err);
      }
      if (product) {
        return res.send("PRODUCT HAS CREATED");
      } else {
        const newData = {
          authorID: req.session.idUser,
          nameproduct: req.body.name,
          description: req.body.description,
          cost: req.body.cost,
          link_image: req.body.linkimage,
        };
        const newProduct = new productsDB(newData);
        newProduct.save();
        // return res.send(req.body);
        const shopStore = req.session.shopStore;
        return res.redirect("/user/product/store", {
          shopStore,
        });
      }
    });
  },

  //[get] user/product/store
  getAllMyProducts(req, res) {
    const count = productsDB.countDocuments({
      authorID: req.session.idUser,
      delete: true,
    });
    const products = productsDB.find({
      authorID: req.session.idUser,
      delete: false,
    });
    Promise.all([products, count])
      .then(([products, count]) => {
        const shopStore = req.session.shopStore;
        return res.render("user/productStore", {
          products: utilsConvertoObject.mutilyToObject(products),
          count,
          shopStore,
        });
      })
      .catch((err) => {
        return res.send(err);
      });
  },

  //[get] put user/product/getProductEdit/:id
  getProductEdit(req, res) {
    productsDB.findById(req.params.id, (err, product) => {
      if (err) return res.send(err);
      const shopStore = req.session.shopStore;
      return res.render("user/getProductEdit", {
        product: utilsConvertoObject.singleToObject(product),
        shopStore,
      });
    });
  },

  //[put] put user/product/edit/:id
  updateProduct(req, res) {
    const dataProducts = { authorID: req.session.idUser, ...req.body };
    productsDB.findByIdAndUpdate(req.params.id, dataProducts, (err, docs) => {
      if (err) return res.send(err);
      const shopStore = req.session.shopStore;
      console.log("Update product compelete ");
      return res.redirect("/user/product/store", {
        shopStore,
      });
    });
    // console.log("update complete!!!");
    // return res.redirect("/user/product/store");
  },

  //[put] user/product/softdelete/:id
  softDelete(req, res) {
    productsDB.findOneAndUpdate(
      { _id: req.params.id },
      { delete: true },
      (err, data) => {
        if (err) return res.send(err);
        const shopStore = req.session.shopStore;
        console.log("Delete compelete !!!");
        return res.redirect("/user/product/store", {
          shopStore,
        });
      }
    );
  },

  //[delete] destroy user/product/destroy/:id
  destroy(req, res) {
    productsDB.deleteOne({ _id: req.params.id }, (err, data) => {
      if (err) return res.send(err);
      console.log(data);
      const shopStore = req.session.shopStore;
      return res.redirect("/user/product/listProductDeleted", {
        shopStore,
      });
    });
  },

  //[put] user/product/restore/:id
  restore(req, res) {
    productsDB.findOneAndUpdate(
      { _id: req.params.id },
      { delete: false },
      (err, data) => {
        if (err) return res.send(err);
        console.log("restore compelete!!!" + data);
        const shopStore = req.session.shopStore;
        return res.redirect("/user/product/listProductDeleted", {
          shopStore,
        });
      }
    );
  },

  //[get] list product deleted "/user/product/listProductDeleted"
  listProductDeleted(req, res) {
    productsDB.find(
      {
        authorID: req.session.idUser,
        delete: true,
      },
      (err, products) => {
        if (err) return res.send(err);
        const shopStore = req.session.shopStore;
        return res.render("user/listProductDeleted", {
          products: utilsConvertoObject.mutilyToObject(products),
          shopStore,
        });
      }
    );
  },
  //[get] user/product/detail/:id
  productDetail(req, res) {
    productsDB.findOne({ _id: req.params.id }, (err, product) => {
      if (err) return res.send(err);
      const shopStore = req.session.shopStore;
      return res.render("product/detailProduct", {
        product: utilsConvertoObject.singleToObject(product),
        shopStore,
      });
    });
  },
  // [get] user/product/bought
  getProductUserBought(req, res) {
    const listItemOrdered = UserOrdered.find({
      userOrdered: req.session.idUser,
    })
      .populate("productID")
      .then((item) => {
        const shopStore = req.session.shopStore;
        return res.render("user/productUserOrdered", {
          item: utilsConvertoObject.mutilyToObject(item),
          shopStore,
        });
      })
      .catch((err) => res.send(err));
  },
  //[put] user/product/order/:id
  userOrderProduct(req, res) {
    const newOrdered = new UserOrdered({
      userOrdered: req.session.idUser,
      amount: req.body.amount,
      productID: req.params.id,
    });
    productsDB
      .findOne({ _id: req.params.id })
      .then((item) => {
        const newReceivedOrdered = new OrderedDb({
          nameUserOrdered: req.session.username,
          authorProduct: item.authorID,
          productID: req.params.id,
          amount: req.body.amount,
          status: "Processing",
        });
        newOrdered.save();
        newReceivedOrdered.save();
        const shopStore = req.session.shopStore;
        return res.redirect("/user/product/bought", {
          shopStore,
        });
      })
      .catch((err) => res.send(err));
  },
  //[post] user/product/orderMutil
  userOrderMutilProduct(req, res) {
    if (req.body === undefined || req.body.productID === undefined) {
      return res.send(
        "You have no product in cartStore!! please add item in cart.."
      );
    }
    if (req.body.productID.length == 1) {
      const newOrdered = new UserOrdered({
        userOrdered: req.session.idUser,
        amount: req.body.amount,
        productID: req.body.productID,
      });
      newOrdered.save();
    } else if (req.body.productID.length > 1) {
      req.body.productID.forEach((item, index) => {
        const newOrdered = new UserOrdered({
          userOrdered: req.session.idUser,
          amount: req.body.amount[index],
          productID: item,
        });
        newOrdered.save();
      });
    }
    cartStoreDB
      .deleteMany({
        userAddID: req.session.idUser,
        productID: { $in: req.body.productID },
      })
      .then((data) => {
        console.log(data);
        const shopStore = req.session.shopStore;
        return res.redirect("/user/product/bought", shopStore);
      });
  },
  //[delete] user/product/order/delete/:id : cancle ordered
  cancleOrdered(req, res) {
    UserOrdered.deleteOne({
      userOrdered: req.session.idUser,
      productID: req.params.id,
    })
      .then((data) => {
        const shopStore = req.session.shopStore;
        return res.redirect("/user/product/bought", {
          shopStore,
        });
      })
      .catch((err) => res.send(err));
  },
};

module.exports = { UserControllers, userActive };
