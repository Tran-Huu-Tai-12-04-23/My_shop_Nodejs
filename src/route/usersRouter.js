const router = require("express").Router();
const { request } = require("express");
const userDB = require("../model/users");
const { UserControllers } = require("../controllers/UserControllers");
const userMiddleware = require("../middelware/userMiddleware");

//get /user/account/edit/:id
router.get("/user/account/edit/:id", UserControllers.editAccount);
//[delete] account /user/account/delete/:id
router.delete("/user/account/delete/:id", UserControllers.deleteAccount);
//[get] user profile
router.get("/user/profile", UserControllers.showProfile);
//[get] all users/ accounts
router.get(
  "/admin/allusers",
  userMiddleware.checkAdmin,
  UserControllers.getAllUsers
);
// [post ] create new item of user :id
router.get("/user/product/getProductEdit/:id", UserControllers.getProductEdit);
//[put] edit product item of user :id
router.put("/user/product/edit/:id", UserControllers.updateProduct);
//[put] soft delete item of user :id
router.put("/user/product/softDelete/:id", UserControllers.softDelete);
//[get] list product deleted
router.get(
  "/user/product/listProductDeleted",
  UserControllers.listProductDeleted
);
//[get] view create new item of user :idz
router.get("/user/create_new_item", UserControllers.createNewItem);
//[get] all products
router.get("/user/product/store", UserControllers.getAllMyProducts);
//[post] crete new product
router.post("/user/create/store", UserControllers.storeCreate);
//[put] restore item of user : id
router.put("/user/product/restore/:id", UserControllers.restore);
//[deltete] user/product/destroy/:id
router.delete("/user/product/destroy/:id", UserControllers.destroy);
//[get] user/product/detail/:id
router.get("/user/product/detail/:id", UserControllers.productDetail);
//get user/product/bought/
router.get("/user/product/bought", UserControllers.getProductUserBought);
//[put] user/product/order/:id
router.put("/user/product/order/:id", UserControllers.userOrderProduct);
//[post] user/product/orderMutil
router.post("/user/product/orderMutil", UserControllers.userOrderMutilProduct);
//[delete] user/product/order/delete/:id
router.delete("/user/product/order/delete/:id", UserControllers.cancleOrdered);
module.exports = router;
