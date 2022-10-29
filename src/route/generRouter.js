const router = require("express").Router();
const userDB = require("../model/users");
const { UserControllers } = require("../controllers/UserControllers");
const userMiddleware = require("../middelware/userMiddleware");

//[delete] account /user/account/delete/:id
router.delete("/user/account/delete/:id", UserControllers.deleteAccount);
//get /user/account/edit/:id
router.get(
  "/user/account/edit/:id",
  userMiddleware.userLogin,
  UserControllers.editAccount
);
//put /user/account/edit/:id
router.put("/user/account/change_pass/:id", UserControllers.updataPass);
//[get] logout
router.get("/logout", UserControllers.logout);
//[get] form regester
router.get("/regester", UserControllers.regester);
// [post] get data user to regester
router.post("/regester/store", UserControllers.regesterStore);
//[get] from loggin
router.get("/login", UserControllers.login);
// [post] checklogin
router.post("/login/checklogin", UserControllers.loginCheck);
//[get] all users/ accounts
router.get("/allusers", userMiddleware.checkAdmin, UserControllers.getAllUsers);
// [get] home
router.get("/", UserControllers.getHome);

module.exports = router;
