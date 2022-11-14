const userMiddleware = require("../middelware/userMiddleware");
const Authentications = require("../middelware/Authentications");
const ShopControllers = require("../controllers/ShopControllers");
const router = require("express").Router();

router.delete("/ordered/cancle/:id/:idUserOrdered", ShopControllers.cancleOrdered);
router.put("/product/update/status/:id", ShopControllers.updateStatusOrdered);
router.get("/store/ordered", ShopControllers.storeOrderedOfShop);

module.exports = router;
