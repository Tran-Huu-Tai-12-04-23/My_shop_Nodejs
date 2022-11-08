const userDB = require("../model/users");
const productsDB = require("../model/products");
const utilsConvertoObject = require("../util/covertoObject");
const ImagesStore = require("../model/ImagesStore");
const fs = require("fs");
const path = require("path");

const userActive = {
  username: undefined,
  id: undefined,
  admin: false,
};
var countCartStore = 0;

const UserControllers = {
  //get home
  getHome(req, res) {
    let search = "";
    let search2 = "";
    if (req.query.search != undefined) {
      search = req.query.search;
      search2 =
        req.query.search.charAt(0).toUpperCase() + req.query.search.slice(1);
    }
    productsDB.find(
      {
        delete: false,
        $or: [
          { description: { $regex: ".*" + search + ".*" } },
          { description: { $regex: ".*" + search2 + ".*" } },
        ],
      },
      (err, products) => {
        if (err) return res.send(err);
        return res.render("home", {
          products: utilsConvertoObject.mutilyToObject(products),
        });
      }
    );
  },
  // login and register
  login(req, res) {
    res.render("user/login");
  },
  //logour
  logout(req, res) {
    userActive.username = undefined;
    userActive.id = undefined;
    userActive.admin = false;

    return res.redirect("/");
  },
  // /login/checklogin
  loginCheck(req, res) {
    userDB.findOne({ username: req.body.username }, (err, user) => {
      if (!user) {
        return res.send("login failed, account not found");
      }
      if (err) {
        return res.send("login failed: " + err.message);
      }
      if (user.password === req.body.password) {
        userActive.username = user.username;
        userActive.id = user.id;
        userActive.admin = user.admin;
        return res.redirect("/");
      } else {
        console.log("Password incorrect!!");
        return res.send("password incorrect");
      }
    });
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
      res.render("user/users", {
        user: utilsConvertoObject.mutilyToObject(user),
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
        return res.redirect("/admin/allusers");
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
    res.render("user/createitem");
  },
  //[post] create new item of user:id
  storeCreate(req, res) {
    if (
      req.body.linkimage === '' ||
      req.body.name === '' ||
      req.body.cost === '' ||
      req.body.description === ''
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
          authorID: userActive.id,
          nameproduct: req.body.name,
          description: req.body.description,
          cost: req.body.cost,
          link_image: req.body.linkimage,
        };
        const newProduct = new productsDB(newData);
        newProduct.save();
        // return res.send(req.body);
        return res.redirect("/user/product/store");
      }
    });
  },

  //[get] user/product/store
  getAllMyProducts(req, res) {
    const count = productsDB.countDocuments({
      authorID: userActive.id,
      delete: true,
    });
    const products = productsDB.find({
      authorID: userActive.id,
      delete: false,
    });
    Promise.all([products, count])
      .then(([products, count]) => {
        return res.render("user/productStore", {
          products: utilsConvertoObject.mutilyToObject(products),
          count,
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
      return res.render("user/getProductEdit", {
        product: utilsConvertoObject.singleToObject(product),
      });
    });
  },

  //[put] put user/product/edit/:id
  updateProduct(req, res) {
    const dataProducts = { authorID: userActive.id, ...req.body };
    productsDB.findByIdAndUpdate(req.params.id, dataProducts, (err, docs) => {
      if (err) return res.send(err);
      console.log("Update product compelete ");
      return res.redirect("/user/product/store");
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
        console.log("Delete compelete !!!");
        return res.redirect("/user/product/store");
      }
    );
  },

  //[delete] destroy user/product/destroy/:id
  destroy(req, res) {
    productsDB.deleteOne({ _id: req.params.id }, (err, data) => {
      if (err) return res.send(err);
      console.log(data);
      return res.redirect("/user/product/listProductDeleted");
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
        return res.redirect("/user/product/listProductDeleted");
      }
    );
  },

  //[get] list product deleted "/user/product/listProductDeleted"
  listProductDeleted(req, res) {
    productsDB.find(
      {
        authorID: userActive.id,
        delete: true,
      },
      (err, products) => {
        if (err) return res.send(err);
        return res.render("user/listProductDeleted", {
          products: utilsConvertoObject.mutilyToObject(products),
        });
      }
    );
  },
  //[get] user/product/detail/:id
  productDetail(req, res) {
    productsDB.findOne({ _id: req.params.id }, (err, product) => {
      if (err) return res.send(err);
      return res.render("product/detailProduct", {
        product: utilsConvertoObject.singleToObject(product),
      });
    });
  },
};

module.exports = { UserControllers, userActive, countCartStore };
