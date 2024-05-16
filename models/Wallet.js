// models/Signup.js
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const walletSchema = new Schema({
  walletname: String,
  balance: Number,
  leverage : String,
  account:String,
  userId : String,
});




const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;
