const jwt = require("jsonwebtoken");

const createToken = {
  createRefeshtoken(data) {
    return jwt.sign(data, `${process.env.RESFESH_TOKEN}`, {
      expiresIn: "365d",
    });
  },
  createAccessToken(data) {
    return jwt.sign(data, `${process.env.ACESS_TOKEN}`, {
      expiresIn: "30s",
    });
  },
};

module.exports = createToken;
