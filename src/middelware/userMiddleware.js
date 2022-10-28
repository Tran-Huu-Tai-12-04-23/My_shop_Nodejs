const userDB = require("../model/users");
const localStorage = require("local-storage");
const { userActive } = require("../controllers/UserControllers");
const userMiddleware = {
  userLogin: function (req, res, next) {
    if (userActive.id != undefined) {
      // console.log("you have login");
      return next();
    }
    console.log("user isn't already logged in");
    return res.redirect("/login");
  },
  checkAdmin: function (req, res, next) {
    if (userActive.username === undefined) {
      return res.redirect("/login");
    } else if (userActive.admin !== true) {
      return res.send("you are not allowed to access this page");
    }
    next();
  },
};

module.exports = userMiddleware;
