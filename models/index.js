'use strict';
const Users = require('./users');
const Resumes = require('./resumes');
const mongoose = require('mongoose');
const username = 'admin';
const password = 'zimconnect';
const host = '159.69.120.82';
const port = '27017';
const db = 'zimconnect';

mongoose.connect(`mongodb://${username}:${password}@${host}:${port}/${db}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

module.exports = class Models {
  constructor() { }

  async getUsers(){
    return await Users.find({}); 
  }

  async getResumes(){
    return await Resumes.find({}); 
  }
}