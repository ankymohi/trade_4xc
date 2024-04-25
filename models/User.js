// models/Signup.js
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const signupSchema = new Schema({
  accountType: String,
  title: String,
  firstname: String,
  username:String,  
  lastname: String,
  email: { type: String, required: true, unique: true },
  dob: String,
  country: String,
  phone: String,
  password : String,
  kyc:Boolean,
});

signupSchema.plugin(passportLocalMongoose);


const Signup = mongoose.model('User', signupSchema);

module.exports = Signup;
