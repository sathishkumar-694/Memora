const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
  fname: {
    type: String,
     
  },
  lname: {
    type: String,
     
  },

  userName: {
    type: String,
     
    unique: true,
  },
  email: {
    type: String,
     
    unique: true,
  },
  password: {
    type: String,
     
  },
  dob: {
    type: Date,
     
  },
  
  gender: {
    type: String,
     
  },
  mobile: {
    type: String,
     
  },
  city: {
    type: String,
     
  },
   district: {
    type: String,
     
  },

  agree: {
    type: Boolean,
     
  },

  googleId:{
    type:String
  } 



});

module.exports = mongoose.model("User" , userSchema)