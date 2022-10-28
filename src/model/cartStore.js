const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cartStore = new Schema(
  {
    userAddID: { type: String, required: true },
    productID: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const cartStoreDB = mongoose.model("cartStore", cartStore);

module.exports = cartStoreDB;
