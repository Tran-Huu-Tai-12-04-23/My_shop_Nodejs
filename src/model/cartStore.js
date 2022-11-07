const mongoose = require("mongoose");

const Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
const cartStore = new Schema(
  {
    userAddID: { type: String, required: true },
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

const cartStoreDB = mongoose.model("cartStore", cartStore);

module.exports = cartStoreDB;
