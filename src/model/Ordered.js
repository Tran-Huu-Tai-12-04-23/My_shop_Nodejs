const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Ordered = new Schema(
  {
    authorProduct: { type: "string", required: true },
    productID: { type: "string", required: true, ref: "products" },
    amount: {
      type: "number",
    },
  },
  {
    timestamps: true,
  }
);

const OrderedDB = mongoose.model("Ordered", Ordered);

module.exports = OrderedDB;
