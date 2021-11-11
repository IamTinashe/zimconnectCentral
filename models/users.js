'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let userSchema = new Schema({
  username: String,
  userAuthID: { type: String, required: true },
  fullname: String,
  company: String,
  email: { type: String, lowercase: true, trim: true },
  role: { type: String, lowercase: true, trim: true }
});

const User = mongoose.model('users', userSchema);
module.exports = User;