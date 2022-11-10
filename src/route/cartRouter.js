const router = require("express").Router();
const { request } = require("express");
const userDB = require("../model/users");
const CartController = require("../controllers/CartController");
const userMiddleware = require("../middelware/userMiddleware");

router.get("/cart/store", CartController.getAllCartStore);
router.delete("/cart/store/delete/:id", CartController.deleteItem);
router.put("/cart/store/:id/:amount", CartController.putProductInCart);
router.delete("/cart/store/destroy/:id", CartController.destroyItem);

module.exports = router;
