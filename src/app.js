const express = require("express");
const mainRouter = require("./route/mainRoute");
const { engine } = require("express-handlebars");
const connectMgdb = require("./config/connectuserDb");
const methodOverride = require("method-override");
const helper = require("./helper/helper");
const path = require("path");
const ImagesStore = require("./model/ImagesStore");

app = express();
// use static file
app.use(express.static(path.join(__dirname, "resourse/public")));
app.engine(
  ".hbs",
  engine({
    extname: "hbs",
    helpers: helper,
  })
);
// use middleware
// app.use(userMiddleware.userLogin);
const port = process.env.PORT || 8000;
//// override with POST having ?_method=DELETE
app.use(methodOverride("_method"));
// get bodt from clinet request
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.set("view engine", "hbs");
app.set("views", "./src/resourse/public/views");
// use middleware to get user post

// run route main in app
mainRouter(app);

// connect to mongoose db
connectMgdb();

app.listen(port, () => {
  console.log(`app listening on http://localhost:${port}`);
});

app.get("/photo", (req, res) => {
  ImagesStore.findOne({})
    .then((result) => {
      return res.render("img", {
        result: result.toObject(),
      });
    })
    .catch((err) => {
      return res.send(err);
    });
});
