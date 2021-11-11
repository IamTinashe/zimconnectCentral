'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let authSchema = new Schema({
  username: String,
  email: { type: String, lowercase: true, trim: true },
  password: String,
  active: Boolean,
  confirmed: Boolean,
  confirmationCode: Number
});

const Auth = mongoose.model('auth', authSchema);
module.exports = Auth;