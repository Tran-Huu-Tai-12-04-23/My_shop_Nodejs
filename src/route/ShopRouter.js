const userMiddleware = require("../middelware/userMiddleware");
const Authentications = require("../middelware/Authentications");
const ShopControllers = require("../controllers/ShopControllers");
const router = require("express").Router();

router.get("/store/ordered", ShopControllers.storeOrderedOfShop);

module.exports = router;
