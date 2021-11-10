'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let authSchema = new Schema({
  username: String,
  email: String,
  password: String,
  verified: Boolean,
  verificationCode: String,
  confirmed: Boolean,
  confirmationCode: String
});

const Auth = mongoose.model('auth', authSchema);
module.exports = Auth;