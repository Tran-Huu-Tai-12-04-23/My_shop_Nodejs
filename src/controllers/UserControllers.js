const userDB = require("../model/users");
const productsDB = require("../model/products");
const utilsConvertoObject = require("../util/covertoObject");
const localStorage = require("local-storage");
const userActive = {
  username: undefined,
  id: undefined,
  admin: false,
};
var countCartStore = 0;

const UserControllers = {
  //get home
  getHome(req, res) {
    productsDB.find({ delete: false }, (err, products) => {
      if (err) return res.send(err);
      return res.render("home", {
        products: utilsConvertoObject.mutilyToObject(products),
      });
    });
  },
  // login and regester
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
  regester(req, res) {
    res.render("user/regester");
  },
  // create a new account
  regesterStore(req, res) {
    userDB.findOne({ username: req.body.username }, (err, users) => {
      if (users) {
        return res.send("can't create account , because user already exists");
      } else if (req.body.password !== req.body.confirmpassword) {
        return res.send(
          "can't create account , because confirmpassword incorrect!!!"
        );
      } else {
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

  //[get] view create nnew item of user:id
  create(req, res) {
    res.render("user/createitem");
  },
  //[post] create new item of user:id
  storeCreate(req, res) {
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
  getAllProducts(req, res) {
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
  updataProduct(req, res) {
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

  //[get] list product deleted
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
