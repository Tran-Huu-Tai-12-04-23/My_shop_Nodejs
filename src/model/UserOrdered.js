const mongoose = require("mongoose");

const Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
const UserOrdered = new Schema(
  {
    userOrdered: { type: String },
    productID: {
      type: ObjectId,
      ref: "products",
    },
    amount: { type: Number },
  },
  {
    timestamps: true,
  }
);

const UserOrderedDB = mongoose.model("UserOrdered", UserOrdered);

module.exports = UserOrderedDB;
