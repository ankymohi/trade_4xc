// models/Signup.js
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const walletSchema = new Schema({
  identifier: String,
  from:String,
  two:String,
  amount: Number,
  date : String,
  processed:String,
  paymentmethod : String,
  message:String,
  userid:String,
});




const Transactions = mongoose.model('Transactions', walletSchema);

module.exports = Transactions;
