const mongoose = require("mongoose");

const Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
const UserOrdered = new Schema(
  {
    userOrdered: { type: String, required: true },
    productID: {
      type: ObjectId,
      required: true,
      ref: "products",
    },
    amount: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const UserOrderedDB = mongoose.model("UserOrdered", UserOrdered);

module.exports = UserOrderedDB;
