const usersRouter = require("./usersRouter");
const generRouter = require("./generRouter");
const cartRouter = require("./cartRouter");
const userMiddleware = require("../middelware/userMiddleware");
const Authentications = require("../middelware/Authentications");

function mainRouter(app) {
  app.use("/", generRouter);
  app.use("/", userMiddleware.userLogin, usersRouter);
  app.use(
    "/user/",
    Authentications.authenticationToken,
    userMiddleware.userLogin,
    cartRouter
  );
}

module.exports = mainRouter;
