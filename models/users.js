'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let userSchema = new Schema({
  username: String,
  fullname: String,
  companyID: String,
  email: String,
  password: String,
  verified: Boolean,
  verificationCode: String,
  confirmed: Boolean,
  confirmationCode: String,
  role: String
});

const User = mongoose.model('users', userSchema);
module.exports = User;