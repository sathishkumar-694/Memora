const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config();
const connectDB = async() => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
      console.log("Mongo DB connection successfull");

  } catch (error) {
    console.error("connection unsuccessful", error.message);
    process.exit(1);
  }
};
module.exports = connectDB