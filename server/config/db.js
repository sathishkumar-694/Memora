const mongoose = require("mongoose");
const dotenv = require("dotenv")
const dns = require('dns');
dotenv.config();

// Fix for querySrv ECONNREFUSED: Force usage of Google DNS
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (error) {
  console.warn("Could not set DNS servers:", error);
}

const connectDB = async() => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/")
      console.log("Mongo DB connection successfull");

  } catch (error) {
    console.error("connection unsuccessful", error.message);
    process.exit(1);
  }
};
module.exports = connectDB