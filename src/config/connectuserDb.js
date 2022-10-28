const mongoose = require("mongoose");

async function connectDb() {
  try {
    await mongoose.connect("mongodb://localhost:27017/createshop", {
      useNewUrlParser: true,
    });
    console.log("Connect successfully!!!");
  } catch (error) {
    console.error(error);
    console.log("Connect failure!!!");
  }
}

module.exports = connectDb;
