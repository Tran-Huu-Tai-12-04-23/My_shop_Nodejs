const usersRouter = require("./usersRouter");
const generRouter = require("./generRouter");
const cartRouter = require("./cartRouter");

function mainRouter(app) {
  app.use("/user/", cartRouter);
  app.use("/", generRouter);
  app.use("/", usersRouter);
}

module.exports = mainRouter;
