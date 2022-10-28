const router = require("express").Router();
const { request } = require("express");
const userDB = require("../model/users");
const { UserControllers } = require("../controllers/UserControllers");
const userMiddleware = require("../middelware/userMiddleware");

// [post ] create new item of user :id
router.get(
  "/user/product/getProductEdit/:id",
  userMiddleware.userLogin,
  UserControllers.getProductEdit
);
//[put] edit product item of user :id
router.put(
  "/user/product/edit/:id",
  userMiddleware.userLogin,
  UserControllers.updataProduct
);
//[put] soft delete item of user :id
router.put(
  "/user/product/softDelete/:id",
  userMiddleware.userLogin,
  UserControllers.softDelete
);
//[get] list product deleted
router.get(
  "/user/product/listProductDeleted",
  userMiddleware.userLogin,
  UserControllers.listProductDeleted
);
//[get] view create new item of user :idz
router.get("/user/create", userMiddleware.userLogin, UserControllers.create);
//[get] all products
router.get(
  "/user/product/store",
  userMiddleware.userLogin,
  UserControllers.getAllProducts
);
//[post] crete new product
router.post("/user/create/store", UserControllers.storeCreate);
//[put] restore item of user : id
router.put("/user/product/restore/:id", UserControllers.restore);
//[deltete] user/product/destroy/:id
router.delete("/user/product/destroy/:id", UserControllers.destroy);
//[get] user/product/detail/:id
router.get("/user/product/detail/:id", UserControllers.productDetail);
module.exports = router;
