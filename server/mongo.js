require("dotenv").config();
const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion } = require('mongodb');
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');
mongoose.connect(process.env.MONGO_URL)      //"mongodb://0.0.0.0:27017/getngo"
.then(() => {
    console.log("conneted to mongoose")
  }).catch((error) => {
    console.log("error in conneting to mongoose:- " + error);
  })
 
  const userSchema = new mongoose.Schema({
    username: {
        type: String,
      },
      password:{
        type: String, 
      },
      number:{
        type:String,
      },
      concent:{
        type: String,
        required: true
      },
      host:[],    
  },
  { timestamps: true }    //this will give up the dates when the user created or when was is updated. 
  )
  userSchema.plugin(passportLocalMongoose);
  userSchema.plugin(findOrCreate);
  const User = mongoose.model("user", userSchema);
  module.exports = User;