const usersRouter = require("./usersRouter");
const generRouter = require("./generRouter");
const cartRouter = require("./cartRouter");
const userMiddleware = require("../middelware/userMiddleware");

function mainRouter(app) {
  app.use("/user/", userMiddleware.userLogin, cartRouter);
  app.use("/", generRouter);
  app.use("/", userMiddleware.userLogin, usersRouter);
}

module.exports = mainRouter;
