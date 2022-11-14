const userDB = require("../model/users");
const OrderedDb = require("../model/Ordered");

const userMiddleware = {
  userLogin: function (req, res, next) {
    if (req.session.idUser != undefined) {
      console.log("you login successfully!!!");
      return next();
    } else {
      console.log("user isn't already logged in");
    }
    return res.redirect("/login");
  },
  checkAdmin: function (req, res, next) {
    if (req.session.username === undefined) {
      return res.redirect("/login");
    } else if (req.session.admin !== true) {
      return res.send("you are not allowed to access this page");
    }
    next();
  },

};

module.exports = userMiddleware;
