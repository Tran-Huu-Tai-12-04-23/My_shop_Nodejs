const jwt = require("jsonwebtoken");
const createToken = require("../util/CreateToken");

let refeshTokens = [];
const authenticationMiddleware = {
  verifyToken(req, res, next) {
    const { username, password, ...datas } = req.body;

    const data = {
      username: username,
      ...datas,
    };
    const acessToken = createToken.createAccessToken(data);
    const refeshToken = createToken.createRefeshtoken(data);

    if (acessToken) {
      req.session.acessToken = "Beare " + acessToken;
    }
    if (refeshToken) {
      res.cookie("refeshToken", refeshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      refeshTokens.push(refeshToken);
    } else {
      return res.send("Can't create refeshToken..");
    }

    if (!acessToken) return res.status(401);
    // return res.status(200).send({ acessToken, refeshToken });
    next();
  },
  authenticationToken(req, res, next) {
    const authHeader = req.session.acessToken;
    var token;
    if (authHeader) {
      if (authHeader.includes("Beare ")) {
        token = authHeader.split(" ")[1];
      } else {
        token = authHeader;
      }
    }
    if (token == null) return res.status(401).send("Error");
    jwt.verify(token, `${process.env.ACESS_TOKEN}`, (err, user) => {
      if (err) {
        authenticationMiddleware.refeshToken;
      }
      next();
    });
  },
  refeshToken(req, res, next) {
    const refeshToken = req.cookies.refeshToken;
    if (!refeshToken) return res.send("you're not authentication");
    if (!refeshTokens.includes(refeshToken))
      return res.send("you're not authenticated");

    jwt.verify(refeshToken, `${process.env.REFESH_TOKEN}`, (err, user) => {
      if (err) return res.send(err);
      refeshTokens = refeshTokens.filter((token) => token != refeshToken);
      const data = {
        username: user.username,
      };
      const newAcessToken = createToken.createAccessToken(data);
      const newRefeshToken = createToken.createRefeshtoken(data);
      refeshTokens.push(newRefeshToken);
      res.cookie("refeshToken", newRefeshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      req.session.token = "Bearer " + newAcessToken;
      next();
      // return res.send({ newAcessToken, newRefeshToken });
    });
  },
};

module.exports = authenticationMiddleware;
