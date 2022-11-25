const router = require("express").Router();
const userDB = require("../model/users");
const { UserControllers } = require("../controllers/UserControllers");
const userMiddleware = require("../middelware/userMiddleware");
const upload = require("../controllers/UploadsControllers");
const Authentications = require("../middelware/Authentications");

//put /user/account/edit/:id
router.put(
  "/user/account/change_pass/:id",
  userMiddleware.userLogin,
  UserControllers.updatePass
);
//[get] logout
router.get("/logout", UserControllers.logout);
//[get] form register
router.get("/register", UserControllers.register);
// [post] get data user to register
router.post(
  "/register/store",
  upload.single("avatar"),
  UserControllers.registerStore
);
//[get] from loggin
router.get("/login", UserControllers.login);
// [post] checklogin
router.post(
  "/login/checklogin",
  Authentications.verifyToken,
  UserControllers.loginCheck
);

// [get] home
router.get("/", UserControllers.getHome);

module.exports = router;
