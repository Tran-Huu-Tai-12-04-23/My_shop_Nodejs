const usersRouter = require("./usersRouter");
const generRouter = require("./generRouter");
const cartRouter = require("./cartRouter");
const userMiddleware = require("../middelware/userMiddleware");
const Authentications = require("../middelware/Authentications");
const ShopRouter = require("../route/ShopRouter");

function mainRouter(app) {
  app.use("/", generRouter);
  app.use("/shop", ShopRouter);
  app.use(
    "/",
    userMiddleware.userLogin,
    Authentications.authenticationToken,
    usersRouter
  );
  app.use(
    "/user/",
    userMiddleware.userLogin,
    Authentications.authenticationToken,
    cartRouter
  );
  app.use("/refeshtoken", Authentications.refeshToken);
}

module.exports = mainRouter;
