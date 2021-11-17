'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let resumesSchema = new Schema({
  candidateID: String,
  fullname: String,
  gender: String,
  email: String,
  dob: Date,
  skills: Array,
  yearsOfExp: String,
  education: Array,
  profession: String,
  audioclip_url: String,
  cv_url: String,
  image_url: String,
  salary: String,
  views: Number,
  selectionStatus: Array,
});

const Resumes = mongoose.model('resumes', resumesSchema);
module.exports = Resumes;