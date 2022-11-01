const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const images = new Schema(
  {
    nameImage: { type: String, required: true },
    img: {
      data: Buffer,
      contentType: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

const ImagesStore = mongoose.model("images", images);

module.exports = ImagesStore;
