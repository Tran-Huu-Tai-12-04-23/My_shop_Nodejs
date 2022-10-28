const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const products = new Schema(
  {
    authorID: { type: String, required: true },
    nameproduct: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    cost: { type: Number, required: true, default: 0 },
    link_image: { type: String, required: true },
    delete: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

const productsDB = mongoose.model("products", products);

module.exports = productsDB;
