'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let authSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, lowercase: true, trim: true },
  password: { type: String, required: true },
  active: Boolean,
  confirmed: Boolean,
  confirmationCode: Number,
  loggedIn: { type: Boolean },
  loggedInAt: { type: Date, default: Date.now },
  createdAt: { type: Date },
});

const Auth = mongoose.model('auth', authSchema);
module.exports = Auth;