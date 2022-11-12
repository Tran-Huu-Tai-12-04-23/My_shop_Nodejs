const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const users = new Schema(
  {
    username: { type: "string", unique: true },
    password: { type: "string" },
    admin: { type: "boolean", default: false },
  },
  {
    timestamps: true,
  }
);

const userDB = mongoose.model("users", users);

module.exports = userDB;
