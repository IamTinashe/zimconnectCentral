'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let userSchema = new Schema({
  username: { type: String, required: true },
  userAuthID: { type: String, required: true },
  fullname: { type: String, required: true },
  company: { type: String, required: true },
  email: { type: String, lowercase: true, trim: true, required: true },
  role: { type: String, lowercase: true, trim: true },
  myCandidates: { type: Array },
  loggedIn: { type: Boolean },
  loggedInAt: { type: Date, default: Date.now },
  createdAt: { type: Date },
});

const User = mongoose.model('users', userSchema);
module.exports = User;